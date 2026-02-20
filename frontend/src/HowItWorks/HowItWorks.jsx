import logo from '../assets/logo.png'
import './HowItWorks.css'

function HowItWorks() {
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
      
              <div class="hiw-tab" id='hiw'>
                How it Works
              </div>
        </html>
    )
}

export default HowItWorks