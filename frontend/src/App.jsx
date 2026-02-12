import { useState } from 'react'
import logo from './assets/logo.png'
import './App.css'

function App() {

  return (
    <html>
      <header class="main-header">
        <div class="logo">
          <img src={logo} alt="PathExt 2.0" class="logo-img" width="150" height="75"/>
        </div>
        <nav class="navbar">
          <ul>
            <li>
              <a href="#">HOME</a>
            </li>
            <li>
              <a href="#">ABOUT</a>
            </li>
            <li>
              <a href="#">RUN</a>
            </li>
            <li>
              <a href="#">HOW IT WORKS</a>
            </li>
          </ul>
        </nav>
      </header>

      <div class="description">
        <p class="sentence">The smartest way to manage your data</p>
      </div>

      <div class="btn-container">
        <button class="hiw-btn">HOW IT WORKS</button>
      </div>

    </html>
    
  )
}

export default App
