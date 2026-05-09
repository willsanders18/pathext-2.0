import './Run.css'
import { useForm } from "react-hook-form"
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Run() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [file1Name, setFile1Name] = useState(null)
  const [file2Name, setFile2Name] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    setLoading(true)
    setApiError(null)

    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('mode', data.mode)
    formData.append('perturbation_sample', data.perturbationName)
    formData.append('percentile_threshold', data.percentileThreshold)
    formData.append('path_length_threshold', data.pathLengthThreshold)
    formData.append('microarray_file', data.dataFile1[0])
    formData.append('network_file', data.dataFile2[0])

    if (data.mode !== 'ha') {
      formData.append('control_sample', data.controlSampleName)
      formData.append('q_score_cutoff', data.qScoreCutoff)
      formData.append('num_randomizations', data.numRandomizations)
    }

    try {
      const res = await fetch('/api/run-pathext', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || 'Something went wrong. Please try again.')
      }

      navigate('/confirmation')
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="title-container">
        <p className="title">Run PathExt</p>
      </div>

      <div className="run-tab" id="run">
        <form className="run-form" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="error-banner">
              {apiError}
            </div>
          )}

          {/* Mode selector spans full width */}
          <div className="form-group">
            <label>*Mode</label>
            <select {...register("mode", { required: "Mode is required" })}>
              <option value="">Select a mode...</option>
              <option value="activated">Activated Response</option>
              <option value="repressed">Repressed Response</option>
              <option value="ha">Highest Activity (HA)</option>
            </select>
            {errors.mode && <span className="error">{errors.mode.message}</span>}
          </div>

          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label>*Name</label>
                <input
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <span className="error">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label>*Name of Perturbation Sample</label>
                <input
                  placeholder="e.g. GSM1829740"
                  {...register("perturbationName", { required: "Perturbation sample is required" })}
                />
                {errors.perturbationName && <span className="error">{errors.perturbationName.message}</span>}
              </div>

              <div className="form-group">
                <label>*Name of Control Sample</label>
                <input
                  placeholder="e.g. GSM1829696"
                  {...register("controlSampleName", { required: "Control sample name is required" })}
                />
                {errors.controlSampleName && <span className="error">{errors.controlSampleName.message}</span>}
              </div>

              <div className="form-group">
                <label>*Q-Score Cutoff</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="0.05"
                  {...register("qScoreCutoff", {
                    required: "Q-score cutoff is required",
                    min: { value: 0, message: "Must be ≥ 0" },
                    max: { value: 1, message: "Must be ≤ 1" }
                  })}
                />
                {errors.qScoreCutoff && <span className="error">{errors.qScoreCutoff.message}</span>}
              </div>

              <div className="form-group">
                <label>*Microarray File</label>
                <label className="file-upload-label">
                  <span>{file1Name ?? "Choose file…"}</span>
                  <input
                    type="file"
                    accept=".tsv,.txt"
                    style={{ display: "none" }}
                    {...register("dataFile1", {
                      required: "Microarray file is required",
                    })}
                    onChange={(e) => {
                      setFile1Name(e.target.files[0]?.name ?? null)
                      register("dataFile1").onChange(e)
                    }}
                  />
                </label>
                {errors.dataFile1 && <span className="error">{errors.dataFile1.message}</span>}
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>*Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" }
                  })}
                />
                {errors.email && <span className="error">{errors.email.message}</span>}
              </div>

              <div className="form-group">
                <label>*Percentile Threshold</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  placeholder="0.5"
                  {...register("percentileThreshold", {
                    required: "Percentile threshold is required",
                    min: { value: 0, message: "Must be ≥ 0" },
                    max: { value: 1, message: "Must be ≤ 1" }
                  })}
                />
                {errors.percentileThreshold && <span className="error">{errors.percentileThreshold.message}</span>}
              </div>

              <div className="form-group">
                <label>*Path Length Threshold</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="2"
                  {...register("pathLengthThreshold", {
                    required: "Path length threshold is required",
                    min: { value: 1, message: "Must be ≥ 1" }
                  })}
                />
                {errors.pathLengthThreshold && <span className="error">{errors.pathLengthThreshold.message}</span>}
              </div>

              <div className="form-group">
                <label>*Network File</label>
                <label className="file-upload-label">
                  <span>{file2Name ?? "Choose file…"}</span>
                  <input
                    type="file"
                    accept=".tsv,.txt"
                    style={{ display: "none" }}
                    {...register("dataFile2", {
                      required: "Network file is required",
                    })}
                    onChange={(e) => {
                      setFile2Name(e.target.files[0]?.name ?? null)
                      register("dataFile2").onChange(e)
                    }}
                  />
                </label>
                {errors.dataFile2 && <span className="error">{errors.dataFile2.message}</span>}
              </div>

              <div className="form-group">
                <label>*Number of Randomizations</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  placeholder="100"
                  {...register("numRandomizations", {
                    required: "Number of randomizations is required",
                    min: { value: 1, message: "Must be ≥ 1" }
                  })}
                />
                {errors.numRandomizations && <span className="error">{errors.numRandomizations.message}</span>}
              </div>
            </div>
          </div>

          <div className="submit-row">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Run