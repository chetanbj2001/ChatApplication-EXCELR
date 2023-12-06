import React from 'react'
import { Link } from "react-router-dom";
import './css/NavigationBar/navbar.css'


const Navigationbar = () => {
  return (
    <div>
       <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          SupportChat
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="buttonofnav collapse navbar-collapse " id="navbarNav">
          <ul className="navbar-nav ml-auto">
            
            <li className="nav-item">
            
              <Link className="icons-link1 nav-link" to="/userlogin">
              <span class="material-symbols-outlined">person</span>
                User 
              </Link>
            </li>
            <li className="nav-item">
            
              <Link className="icons-link2 nav-link" to="/agentlogin">
              <span class="material-symbols-outlined">support_agent</span>
                Agent
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
      </div>
  )
}

export default Navigationbar