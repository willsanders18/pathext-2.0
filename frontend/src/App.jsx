import { useState } from 'react'
import logo from './assets/logo.png'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Run from './Run/Run.jsx'
import About from './About/About.jsx'
import HowItWorks from './HowItWorks/HowItWorks'
import Output from './Output/Output.jsx'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <html>
      <header class="main-header">
        <div class="logo">
          <img src={logo} alt="PathExt 2.0" class="logo-img" width="150" height="75"/>
        </div>
        <nav class="navbar">
          <ul>
            <li>
              <a href="/">HOME</a>
            </li>
            <li>
              <a href="/about">ABOUT</a>
            </li>
            <li>
              <a href="/run">RUN</a>
            </li>
            <li>
              <a href="/howitworks">HOW IT WORKS</a>
            </li>
          </ul>
        </nav>
      </header>

      <div class="description">
        <p class="sentence">The smartest way to manage your data</p>
      </div>

      <div class="btn-container">
        <button class="hiw-btn" onClick={() => navigate('/howitworks')}>HOW IT WORKS</button>
      </div>


    </html>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/run' element={<Run />}/>
        <Route path='/howitworks' element={<HowItWorks />}/>
        <Route path='/output' element={<Output />}/>
      </Routes>
    </Router>
    
  )
}

export default App
