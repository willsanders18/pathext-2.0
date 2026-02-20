import logo from '../assets/logo.png'
import './Run.css'

function Run() {
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
        </html>
    )
}

export default Run