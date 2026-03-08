import './Run.css'

function Run() {
  return (
    <div className="run-tab" id="run">
      <form>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" />

        <label htmlFor="email">Email:</label>
        <input type="email" name="email" id="email" required />
        <br />

        <label htmlFor="pertubation">Name of Pertubation:</label>
        <input type="text" name="pertubation" id="pertubation" />

        <label htmlFor="threshold">Percentile Threshold</label>
        <input type="text" inputMode="numeric" name="threshold" id="threshold" />
        <br />

        <label htmlFor="control">Name of Control Sample:</label>
        <input type="text" name="control" id="control" />

        <label htmlFor="q-score">Q-Score Cutoff</label>
        <input type="text" inputMode="numeric" name="q-score" id="q-score" />
        <br />

        <label htmlFor="path-length">Path Length Threshold</label>
        <input type="text" inputMode="numeric" name="path-length" id="path-length" />
        <br />

        <input type="submit" value="Submit" />
      </form>
    </div>
  )
}

export default Run