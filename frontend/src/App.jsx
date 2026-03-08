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
            <li>
              <NavLink to="/output">OUTPUT</NavLink>
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
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/run" element={<Run />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/output" element={<Output />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App