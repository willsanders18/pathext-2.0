import './Run.css'

function Confirmation() {
  return (
    <div className="confirmation-page">
      <h1>Submission Received</h1>
      <p>
        Your files were successfully uploaded and PathExt is now running its algorithm.
      </p>
      <p>
        Once processing is complete, your results will be sent to the email address you provided.
      </p>
      <p className="confirmation-small">
        Thank you for using PathExt 2.0.
      </p>
    </div>
  )
}

export default Confirmation