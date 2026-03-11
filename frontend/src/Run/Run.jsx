import logo from '../assets/logo.png'
import './Run.css'
import { useForm } from "react-hook-form"
import React, { useState } from 'react'

function Run() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [file1Name, setFile1Name] = useState(null)
  const [file2Name, setFile2Name] = useState(null)

  const onSubmit = (data) => {
    console.log("Form submitted:", data)
  }

  return (
    <>
      <header className="main-header">
        <div className="logo">
          <img src={logo} alt="PathExt 2.0" className="logo-img" width="150" height="75" />
        </div>
        <nav className="navbar">
          <ul>
            <li><a href="/">HOME</a></li>
            <li><a href="/about">ABOUT</a></li>
            <li><a href="/run">RUN</a></li>
            <li><a href="/howitworks">HOW IT WORKS</a></li>
          </ul>
        </nav>
      </header>

      <div className="run-tab" id="run">
        <form className="run-form" onSubmit={handleSubmit(onSubmit)}>

          <div className="form-columns">

            {/* Left Column */}
            <div className="form-column">

              {/* Name */}
              <div className="form-group">
                <label>Name</label>
                <input
                  placeholder="Your name"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <span className="error">{errors.name.message}</span>}
              </div>

              {/* Name of Perturbation */}
              <div className="form-group">
                <label>Name of Perturbation</label>
                <input
                  placeholder="e.g. Drug treatment"
                  {...register("perturbationName", { required: "Perturbation name is required" })}
                />
                {errors.perturbationName && <span className="error">{errors.perturbationName.message}</span>}
              </div>

              {/* Name of Control Sample */}
              <div className="form-group">
                <label>Name of Control Sample</label>
                <input
                  placeholder="e.g. DMSO"
                  {...register("controlSampleName", { required: "Control sample name is required" })}
                />
                {errors.controlSampleName && <span className="error">{errors.controlSampleName.message}</span>}
              </div>

              {/* Q-Score Cutoff */}
              <div className="form-group">
                <label>Q-Score Cutoff</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  placeholder="0.1"
                  {...register("qScoreCutoff", {
                    required: "Q-score cutoff is required",
                    min: { value: 0, message: "Must be ≥ 0" },
                    max: { value: 1, message: "Must be ≤ 1" }
                  })}
                />
                {errors.qScoreCutoff && <span className="error">{errors.qScoreCutoff.message}</span>}
              </div>

              {/* Data File 1 */}
              <div className="form-group">
                <label>Data File 1</label>
                <label className="file-upload-label">
                  <span>{file1Name ?? "Choose file…"}</span>
                  <input
                    type="file"
                    accept=".tsv"
                    style={{ display: "none" }}
                    {...register("dataFile1", {
                      required: "Data file 1 is required",
                      validate: (files) => {
                        if (!files[0]) return true
                        return files[0].name.endsWith(".tsv") || "File must be a .tsv"
                      }
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

            {/* Right Column */}
            <div className="form-column">

              {/* Email */}
              <div className="form-group">
                <label>Email</label>
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

              {/* Percentile Threshold */}
              <div className="form-group">
                <label>Percentile Threshold</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="e.g. 95"
                  {...register("percentileThreshold", {
                    required: "Percentile threshold is required",
                    min: { value: 0, message: "Must be ≥ 0" },
                    max: { value: 100, message: "Must be ≤ 100" }
                  })}
                />
                {errors.percentileThreshold && <span className="error">{errors.percentileThreshold.message}</span>}
              </div>

              {/* Path Length Threshold */}
              <div className="form-group">
                <label>Path Length Threshold</label>
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

              {/* Data File 2 */}
              <div className="form-group">
                <label>Data File 2</label>
                <label className="file-upload-label">
                  <span>{file2Name ?? "Choose file…"}</span>
                  <input
                    type="file"
                    accept=".tsv"
                    style={{ display: "none" }}
                    {...register("dataFile2", {
                      required: "Data file 2 is required",
                      validate: (files) => {
                        if (!files[0]) return true
                        return files[0].name.endsWith(".tsv") || "File must be a .tsv"
                      }
                    })}
                    onChange={(e) => {
                      setFile2Name(e.target.files[0]?.name ?? null)
                      register("dataFile2").onChange(e)
                    }}
                  />
                </label>
                {errors.dataFile2 && <span className="error">{errors.dataFile2.message}</span>}
              </div>

            </div>
          </div>

          {/* Submit — centered below both columns */}
          <div className="submit-row">
            <button type="submit" className="submit-btn">Submit</button>
          </div>

        </form>
      </div>
    </>
  )
}

export default Run