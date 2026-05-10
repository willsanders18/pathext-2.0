# PathExt Web Application

A full stack web application for running PathExt, a computational tool for extracting pathways from biological networks.

---

## Prerequisites

Before setting up the repository, you need to install Docker Desktop. Follow the instructions for your operating system below.

### Windows

1. Ensure your system is running Windows 10 version 2004 or later, or Windows 11
2. Download Docker Desktop from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
3. Run the installer
4. During installation, make sure **"Use WSL 2 based engine"** is checked
5. After installation completes, open Docker Desktop
6. Go to **Settings → Resources → WSL Integration**
7. Enable integration for your WSL distro (e.g. Ubuntu)
8. Click **Apply & Restart**
9. Open your WSL terminal and verify Docker is working:

```bash
docker --version
docker compose version
```

Both commands should print version numbers. All Docker commands should be run inside WSL, not the Windows command prompt or PowerShell.

> **Note:** If you don't have WSL installed, open PowerShell as Administrator and run `wsl --install`, then restart your machine before installing Docker Desktop.

---

### Mac

1. Download Docker Desktop from [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Choose **Mac with Apple Silicon** if you have an M1/M2/M3 chip
   - Choose **Mac with Intel chip** if you have an older Mac
2. Open the downloaded `.dmg` file and drag Docker to your Applications folder
3. Open Docker from Applications
4. Follow the onboarding prompts and grant any requested permissions
5. Open Terminal and verify Docker is working:

```bash
docker --version
docker compose version
```

Both commands should print version numbers.

---

## Setup

### 1. Clone the repository

**Windows (WSL terminal):**

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

**Mac (Terminal):**

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

### 2. Configure environment variables

The backend requires a `.env` file for email credentials. Create it inside the `backend/` folder:

**Windows (WSL terminal):**

```bash
nano backend/.env
```

**Mac (Terminal):**

```bash
nano backend/.env
```

Add the following to the file:

```
MAIL_USERNAME=you@gmail.com
MAIL_PASSWORD=your_google_app_password
```

Save and exit with `Ctrl+X`, then `Y`, then `Enter`.

### 3. Build and run

> **Note:** The first build takes 15–20 minutes because it compiles Python 3.6.9 and Python 3.10.13 from source inside the container. Every subsequent build is fast because Docker caches these steps.

```bash
docker compose build
docker compose up
```

Once running, open your browser and navigate to:

- **Frontend:** [http://localhost](http://localhost)
- **Backend API docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## Daily Usage

**Start the application:**

```bash
docker compose up
```

**Start in the background:**

```bash
docker compose up -d
```

**Stop the application:**

```bash
docker compose down
```

**Rebuild after code changes:**

```bash
docker compose build
docker compose up
```

---

## How It Works

1. Fill out the form on the frontend with your input files and parameters
2. Submit the form — you will receive a confirmation email immediately
3. PathExt runs in the background on the server
4. When complete, you will receive an email with the output files attached as a zip archive

### Input Parameters

| Parameter               | Description                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| `email`                 | Email address to receive results                                          |
| `mode`                  | `activated`, `repressed`, or `ha` (highest activity)                      |
| `perturbation_sample`   | Column name of the perturbation sample in your microarray file            |
| `control_sample`        | Column name of the control sample (not required for `ha` mode)            |
| `percentile_threshold`  | Percentile cutoff for node activity (e.g. `0.5`)                          |
| `path_length_threshold` | Maximum path length (e.g. `2`)                                            |
| `q_score_cutoff`        | FDR cutoff for significance (e.g. `0.05`, not required for `ha` mode)     |
| `num_randomizations`    | Number of randomizations for FDR (e.g. `100`, not required for `ha` mode) |
| `microarray_file`       | Tab-separated microarray expression file                                  |
| `network_file`          | Tab-separated network edge list file                                      |

---

## Troubleshooting

**Docker commands not found on Windows:**
Make sure you are running commands inside WSL, not Windows Command Prompt or PowerShell. Open Ubuntu or your WSL distro from the Start menu.

**Port 80 already in use:**
Something else on your machine is using port 80. Edit `docker-compose.yml` and change `"80:80"` to `"8080:80"`, then access the frontend at `http://localhost:8080`.

**Email not sending:**
Verify your `backend/.env` file exists and contains both `MAIL_USERNAME` and `MAIL_PASSWORD`. Make sure the password is a Google App Password and not your regular Gmail password.

**Frontend showing outdated content:**
Try a hard refresh in your browser (`Ctrl+Shift+R` on Windows, `Cmd+Shift+R` on Mac) or rebuild the containers:

```bash
docker compose build
docker compose up
```

**Job failed error in email:**
Check that your `perturbation_sample` and `control_sample` values exactly match column headers in your microarray file, including capitalization.
