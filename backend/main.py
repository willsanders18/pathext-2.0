from fastapi import FastAPI, BackgroundTasks, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
import os, uuid, shutil, zipfile, asyncio
from pathlib import Path
from dotenv import load_dotenv
 
load_dotenv()
 
MAIL_USERNAME = os.getenv('MAIL_USERNAME')
MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
 
# Paths — these match the Docker container layout
PATHEXT_DIR    = Path('/pathext')
PATHEXT_PYTHON = Path('/pathext/venv/bin/python')
JOBS_DIR       = Path('/app/jobs')
JOBS_DIR.mkdir(exist_ok=True)
 
app = FastAPI()
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=['https://your-domain.com'],  # update for production
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
 
conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USERNAME,
    MAIL_PASSWORD=MAIL_PASSWORD,
    MAIL_FROM=MAIL_USERNAME,
    MAIL_PORT=587,
    MAIL_SERVER='smtp.gmail.com',
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
)
 
# ── Email helpers ────────────────────────────────────────────────────
 
async def send_confirmation_email(email: str, fm: FastMail):
    msg = MessageSchema(
subject='PathExt – Job Received',
        recipients=[email],
        body=f'<h2>Job Queued</h2><p>We will email results to <b>{email}</b> when complete.</p>',
        subtype=MessageType.html,
    )
    await fm.send_message(msg)
 
async def send_results_email(email: str, zip_path: Path, fm: FastMail):
    msg = MessageSchema(
        subject='PathExt – Results Ready',
        recipients=[email],
        body='<h2>Your PathExt results are attached.</h2>',
        subtype=MessageType.html,
        attachments=[{'file': str(zip_path), 'headers': {
            'Content-Disposition': 'attachment; filename=results.zip'}}],
    )
    await fm.send_message(msg)
 
async def send_error_email(email: str, detail: str, fm: FastMail):
    msg = MessageSchema(
        subject='PathExt – Job Failed',
        recipients=[email],
        body=f'<h2>Job Failed</h2><pre>{detail}</pre>',
        subtype=MessageType.html,
    )
    await fm.send_message(msg)
 
# ── Job runner ──────────────────────────────────────────────────────
 
async def run_pathext_job(
    job_dir, email, mode, microarray_path, network_path,
    perturbation_sample, control_sample, percentile_threshold,
    path_length_threshold, q_score_cutoff, num_randomizations, fm,
):
    output_dir = job_dir / 'output'
    output_dir.mkdir()
 
    # Inject venv bin into PATH so .sh scripts resolve 'python' correctly
    env = os.environ.copy()
    env['PATH'] = str(PATHEXT_DIR / 'venv' / 'bin') + ':' + env['PATH']
 
    try:
        if mode == 'ha':
            cmd = [
                str(PATHEXT_PYTHON),
                str(PATHEXT_DIR / 'get_highest_activity_TopNet.py'),
                str(microarray_path), perturbation_sample, str(network_path),
                str(percentile_threshold), str(path_length_threshold),
                str(output_dir / 'HA_base_network.txt'),
                str(output_dir / 'HA_TopNet.txt'),
            ]
        else:
            script = ('get_Activated_Response_TopNet.sh' if mode == 'activated'
                      else 'get_Repressed_Response_TopNet.sh')
            prefix = 'Activated_Response' if mode == 'activated' else 'Repressed_Response'
            cmd = [
                'bash', str(PATHEXT_DIR / script),
                str(microarray_path), perturbation_sample, control_sample,
                str(network_path), str(percentile_threshold),
                str(path_length_threshold), str(q_score_cutoff),
                str(num_randomizations), str(output_dir) + '/',
                f'{prefix}_base_network.txt', f'{prefix}_TopNet.txt',
            ]
 
        proc = await asyncio.create_subprocess_exec(
            *cmd, cwd=str(PATHEXT_DIR), env=env,
            stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await proc.communicate()
 
        if proc.returncode != 0:
            raise RuntimeError(stderr.decode())
        # Zip outputs and email
        zip_path = job_dir / 'results.zip'
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            for f in output_dir.iterdir():
                zf.write(f, arcname=f.name)
        await send_results_email(email, zip_path, fm)
 
    except Exception as exc:
        await send_error_email(email, str(exc), fm)
 
    finally:
        await asyncio.sleep(120)   # buffer for email attachment upload
        shutil.rmtree(job_dir, ignore_errors=True)
 
# ── Endpoints ────────────────────────────────────────────────────────
 
@app.post('/api/run-pathext')
async def api_run_pathext(
    background_tasks: BackgroundTasks,
    email: EmailStr                  = Form(...),
    mode: str                        = Form(...),   # activated|repressed|ha
    perturbation_sample: str         = Form(...),
    percentile_threshold: float      = Form(...),
    path_length_threshold: int       = Form(...),
    microarray_file: UploadFile      = File(...),
    network_file: UploadFile         = File(...),
    control_sample: str | None       = Form(default=None),
    q_score_cutoff: float | None     = Form(default=None),
    num_randomizations: int | None   = Form(default=None),
):
    if mode not in ('activated', 'repressed', 'ha'):
        raise HTTPException(422, "mode must be 'activated', 'repressed', or 'ha'")
    if mode in ('activated', 'repressed') and None in (control_sample, q_score_cutoff, num_randomizations):
        raise HTTPException(422, 'control_sample, q_score_cutoff, num_randomizations required')
 
    job_dir = JOBS_DIR / str(uuid.uuid4())
    job_dir.mkdir()
 
    microarray_path = job_dir / microarray_file.filename
    network_path    = job_dir / network_file.filename
    with open(microarray_path, 'wb') as f: shutil.copyfileobj(microarray_file.file, f)
    with open(network_path, 'wb') as f:    shutil.copyfileobj(network_file.file, f)
 
    fm = FastMail(conf)
    background_tasks.add_task(asyncio.run, send_confirmation_email(email, fm))
    background_tasks.add_task(asyncio.run, run_pathext_job(
        job_dir, email, mode, microarray_path, network_path,
        perturbation_sample, control_sample, percentile_threshold,
        path_length_threshold, q_score_cutoff, num_randomizations, fm,
    ))
 
    return {'message': 'Job submitted. Check your email for confirmation and results.',
            'job_id': str(job_dir.name)}
