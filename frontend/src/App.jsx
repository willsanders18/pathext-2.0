import { useState, useRef } from 'react'
import logo from './assets/logo.png'
import './App.css'
import Confirmation from './Run/Confirmation.jsx'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import Run from './Run/Run.jsx'
import About from './About/About.jsx'
import HowItWorks from './HowItWorks/HowItWorks.jsx'
import Output from './Output/Output.jsx'
import TopNet from './Output/TopNet.jsx'

const BackToTopButton = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBackToTop = () => {
    if (location.pathname !== '/') {
      navigate('/')

      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      }, 50)
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  return (
    <button className="back-to-top-btn" onClick={handleBackToTop}>
      BACK TO TOP
    </button>
  )
}

const Layout = () => {
  const location = useLocation()

  return (
    <>
      <header className="main-header">
        <div className="logo">
          <img
            src={logo}
            alt="PathExt 2.0"
            className="logo-img"
            width="150"
            height="75"
          />
        </div>

        <nav className="navbar">
          <ul>
            <li>
              <NavLink to="/">HOME</NavLink>
            </li>

            <li>
              <NavLink to="/about">ABOUT</NavLink>
            </li>

            <li>
              <NavLink
                to="/run"
                className={
                  location.pathname.startsWith('/run') ||
                  location.pathname.startsWith('/confirmation')
                    ? 'active'
                    : ''
                }
              >
                RUN
              </NavLink>
            </li>

            <li className="dropdown">
              <NavLink
                to="/output"
                className={
                  location.pathname.startsWith('/output') ||
                  location.pathname.startsWith('/topnet')
                    ? 'dropbtn active'
                    : 'dropbtn'
                }
              >
                OUTPUT
              </NavLink>

              <ul className="dropdown-content">
                <li>
                  <NavLink to="/output">Table</NavLink>
                </li>

                <li>
                  <NavLink to="/topnet">TopNet Structure</NavLink>
                </li>
              </ul>
            </li>

            <li>
              {/* <NavLink to="/howitworks">HOW IT WORKS</NavLink> */}
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />

      <BackToTopButton />
    </>
  )
}

const Home = () => {
  const howItWorksSectionRef = useRef(null)

  const handleHowItWorksClick = () => {
    howItWorksSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <>
      <div className="landing-page-top">
        <div className="description">
          <p className="sentence">
            Analyze gene networks, not just individual genes
          </p>
        </div>

        <div className="btn-container">
          <button className="hiw-btn" onClick={handleHowItWorksClick}>
            HOW IT WORKS
          </button>
        </div>
      </div>

      {/* Permanent blank space attached to the bottom of the landing page */}
      <div className="landing-extension-space" />

      {/* How It Works Section */}
      <div
        id="how-it-works-section"
        ref={howItWorksSectionRef}
        className="how-it-works-section"
      >
        <div className="hiw-tab" id="hiw">
          <h1>How It Works</h1>

          <section>
            <h2>What Does PathExt Do?</h2>

            <p>
              PathExt is a tool designed to help you make sense of complex
              biological data by looking at how genes interact with each other —
              not just individually, but as part of a larger network.
            </p>

            <p>
              Instead of only identifying which genes are active, PathExt
              focuses on how genes work together through connected pathways.
              This allows it to uncover important biological processes that may
              not be obvious when analyzing genes in isolation.
            </p>
          </section>

          <section>
            <h2>How PathExt Works Behind the Scenes</h2>

            <ul>
              <li>
                <strong>Step 1: Input Data</strong> — Your uploaded file
                contains gene-related measurements, such as expression or
                centrality values.
              </li>

              <li>
                <strong>Step 2: Network Integration</strong> — PathExt maps your
                data onto a network of known gene/protein interactions.
              </li>

              <li>
                <strong>Step 3: Path Analysis</strong> — The system evaluates
                connections between genes and identifies the most significant
                paths.
              </li>

              <li>
                <strong>Step 4: Top Network, or TopNet</strong> — A smaller,
                meaningful sub-network is extracted, highlighting the most
                relevant genes and pathways.
              </li>
            </ul>
          </section>

          <section>
            <h2>How to Use This Tool</h2>

            <ol>
              <li>
                <strong>Prepare Your File</strong>

                <ul>
                  <li>
                    Upload a <code>.tsv</code> or <code>.txt</code> file.
                  </li>
                  <li>The file should be tab-delimited.</li>
                  <li>
                    Each column should represent a variable, such as gene name
                    or centrality measures.
                  </li>
                </ul>
              </li>

              <li>
                <strong>Upload Your Data</strong>

                <ul>
                  <li>
                    Go to the <strong>Run</strong> page.
                  </li>
                  <li>Fill out the requested information.</li>
                  <li>Results will be sent to the email provided.</li>
                  <li>
                    Go to the <strong>Output</strong> page.
                  </li>
                  <li>
                    Click <strong>Choose File</strong>.
                  </li>
                  <li>Select your dataset.</li>
                </ul>
              </li>

              <li>
                <strong>View Results</strong>

                <ul>
                  <li>
                    Your data table and a TopNet visualization will
                    automatically appear.
                  </li>
                  <li>Click any column header to sort values.</li>
                </ul>
              </li>

              <li>
                <strong>Explore the Data</strong>

                <ul>
                  <li>Identify key genes and patterns.</li>
                  <li>Compare values across columns.</li>
                  <li>Use sorting to analyze trends.</li>
                </ul>
              </li>
            </ol>
          </section>

          <section>
            <h2>Tips for Best Results</h2>

            <ul>
              <li>Make sure your file is tab-separated.</li>
              <li>Include column headers in the first row.</li>
              <li>Avoid extra spaces or unusual formatting.</li>
              <li>Larger files may take slightly longer to load.</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}

function App() {
  const [outputData, setOutputData] = useState([])
  const [outputColumns, setOutputColumns] = useState([])
  const [outputFileName, setOutputFileName] = useState('')

  const [topNetText, setTopNetText] = useState('')
  const [topNetFileName, setTopNetFileName] = useState('')

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/about" element={<About />} />

          <Route path="/run" element={<Run />} />

          <Route path="/confirmation" element={<Confirmation />} />

          <Route path="/howitworks" element={<HowItWorks />} />

          <Route
            path="/output"
            element={
              <Output
                data={outputData}
                setData={setOutputData}
                columns={outputColumns}
                setColumns={setOutputColumns}
                fileName={outputFileName}
                setFileName={setOutputFileName}
              />
            }
          />

          <Route
            path="/topnet"
            element={
              <TopNet
                uploadedText={topNetText}
                setUploadedText={setTopNetText}
                uploadedFileName={topNetFileName}
                setUploadedFileName={setTopNetFileName}
              />
            }
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App