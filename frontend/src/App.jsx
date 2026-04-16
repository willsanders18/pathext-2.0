import { useState } from 'react'
import logo from './assets/logo.png'
import './App.css'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useNavigate,
  Outlet,
} from 'react-router-dom'

import Run from './Run/Run.jsx'
import About from './About/About.jsx'
import HowItWorks from './HowItWorks/HowItWorks.jsx'
import Output from './Output/Output.jsx'
import TopNet from './Output/TopNet.jsx'

const Layout = () => {
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
              <NavLink to="/run">RUN</NavLink>
            </li>

            <li className="dropdown">
              <NavLink to="/output" className="dropbtn">OUTPUT</NavLink>
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
              <NavLink to="/howitworks">HOW IT WORKS</NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <Outlet />
    </>
  )
}

const Home = () => {
  const navigate = useNavigate()

  return (
    <>
      <div className="description">
        <p className="sentence">The smartest way to manage your data</p>
      </div>

      <div className="btn-container">
        <button
          className="hiw-btn"
          onClick={() => navigate('/howitworks')}
        >
          HOW IT WORKS
        </button>
      </div>
    </>
  )
}

function App() {
  const [outputData, setOutputData] = useState([])
  const [outputColumns, setOutputColumns] = useState([])
  const [outputFileName, setOutputFileName] = useState('')

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/run" element={<Run />} />
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
          <Route path="/topnet" element={<TopNet />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App