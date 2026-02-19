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
              <a href="#about">ABOUT</a>
            </li>
            <li>
              <a href="#run">RUN</a>
            </li>
            <li>
              <a href="#hiw">HOW IT WORKS</a>
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

      <div class="about-tab" id='about'>
        <p class="sentence">PathExt's Story</p>
        <p class="about-description">
          PathExt, first coded in 2020 by [INSERT PROPER AUTHORS/CREDITS], is a
specialized programming tool that sifts through user-uploaded genome sequencing data
to find the most significant genes and their relations. Through datamining, discovering
patterns/trends in large form datasets computationally, the program deconstructs the
uploaded files and highlights which genes or ‘nodes’ are most active under the user’s
given circumstances. Once found, the connections or ‘pathways’ between each node
are evaluated to find the shortest distance between those of highest importance,
mapping those ‘routes’ in turn.
        </p>
        <p class="sentence">Why PathExt.com</p>
        <p class="about-description">
          Traditional gene evaluation techniques require lengthy completion time, are arduous in
procedure, and monetarily debilitating for the average researcher for whom they are
designed. Our team’s solution aims to decrease the time commitment through parallel
processing, provide a straightforward interface to operate, and remove the burden of
cost from the user entirely. We want to make this technology more widely available for
the researchers who want to use it, without further hindering their progress with
complicated. Therefore, PathExt is now available in webpage format, as opposed to its
original command-line functionality, to accomplish that very thing.
        </p>
      </div>

      <div class="run-tab" id='run'>
        {/* <p>Run</p> */}

        <form>
          <label htmlFor="name">Name:</label>
          <input type="text" id='name' name='name'/>
          <label htmlFor="email">Email:</label>
          <input type="email" name='email' id='email' required/><br/>
          <label htmlFor="pertubation">Name of Pertubation:</label>
          <input type="text" name='pertubation' id='pertubation'/>
          <label htmlFor="threshold">Percentile Threshold</label>
          <input type="text" inputMode='numeric' name='threshold' id='threshold'/><br/>
          <label htmlFor="control">Name of Control Sample:</label>
          <input type="text" name='control' id='control'/>
          <label htmlFor="q-score">Q-Score Cutoff</label>
          <input type="text" inputMode='numeric' name='q-score' id='q-score'/><br/>
          <label htmlFor="path-length">Path Length Threshold</label>
          <input type="text" inputMode='numeric' name='path-length' id='path-length'/><br/>
          <input type="submit" value="Submit"/>
        </form>
      </div>

      <div class="hiw-tab" id='hiw'>
        How it Works
      </div>

    </html>
    
  )
}

export default App
