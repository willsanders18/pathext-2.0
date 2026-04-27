import './HowItWorks.css'

function HowItWorks() {
  return (
    <div className="hiw-tab" id="hiw">
      <h1>How It Works</h1>

      <section>
        <h2>What Does PathExt Do?</h2>
        <p>
          PathExt is a tool designed to help you make sense of complex biological data by looking at how genes interact with 
          each other — not just individually, but as part of a larger network.
        </p>
        <p>
          Instead of only identifying which genes are active, PathExt focuses on how genes work together through connected 
          pathways. This allows it to uncover important biological processes that may not be obvious when analyzing genes in 
          isolation.
        </p>
      </section>

      <section>
        <h2>How PathExt Works (Behind the Scenes)</h2>
        <ul>
          <li>
            <strong>Step 1: Input Data</strong> — Your uploaded file contains gene-related measurements (such as expression or centrality values).
          </li>
          <li>
            <strong>Step 2: Network Integration</strong> — PathExt maps your data onto a network of known gene/protein interactions.
          </li>
          <li>
            <strong>Step 3: Path Analysis</strong> — The system evaluates connections between genes and identifies the most significant paths.
          </li>
          <li>
            <strong>Step 4: Top Network (TopNet)</strong> — A smaller, meaningful sub-network is extracted, highlighting the most relevant genes and pathways.
          </li>
        </ul>
      </section>

      <section>
        <h2>How to Use This Tool</h2>
        <ol>
          <li>
            <strong>Prepare Your File</strong>
            <ul>
              <li>Upload a <code>.tsv</code> or <code>.txt</code> file</li>
              <li>The file should be tab-delimited</li>
              <li>Each column should represent a variable (e.g., gene name, centrality measures)</li>
            </ul>
          </li>

          <li>
            <strong>Upload Your Data</strong>
            <ul>
              <li>Go to the <strong>Run</strong> page</li>
              <li>Fill out the requested information</li> 
              <li>Results will be sent to the email provided</li>
              <li>Go to the <strong>Output</strong> page</li>
              <li>Click <strong>“Choose File”</strong></li>
              <li>Select your dataset</li>
            </ul>
          </li>

          <li>
            <strong>View Results</strong>
            <ul>
              <li>Your data table and a TopNet visualization will automatically appear</li>
              <li>Click any column header to sort values</li>
            </ul>
          </li>

          <li>
            <strong>Explore the Data</strong>
            <ul>
              <li>Identify key genes and patterns</li>
              <li>Compare values across columns</li>
              <li>Use sorting to analyze trends</li>
            </ul>
          </li>
        </ol>
      </section>

      <section>
        <h2>Tips for Best Results</h2>
        <ul>
          <li>Make sure your file is tab-separated</li>
          <li>Include column headers in the first row</li>
          <li>Avoid extra spaces or unusual formatting</li>
          <li>Larger files may take slightly longer to load</li>
        </ul>
      </section>
    </div>
  )
}

export default HowItWorks