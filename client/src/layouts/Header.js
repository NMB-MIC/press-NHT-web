import React from "react";
import { LogoutButton } from "./LogoutBtn";

function Header() {
  return (
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a href="/Detail" className="nav-link">
              Home
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <a href="Upload" className="nav-link">
              Upload
            </a>
          </li>
          {/* <li className="nav-item d-none d-sm-inline-block">
            <a href="Curmodel" className="nav-link">
                Set Current Model
        
            </a>
          </li> */}
          <li className="nav-item d-none d-sm-inline-block">
            <a href="Stock" className="nav-link">
              Material Stock
            </a>
          </li>

          <li className="nav-item d-none d-sm-inline-block">
            <a href="MasterModel" className="nav-link">
              Register New Die
            </a>
          </li>

          <li className="nav-item d-none d-sm-inline-block">
            <a href="MasterMachine" className="nav-link">
              Register New Machine
            </a>
          </li>
        </ul>
        {/* Right navbar links */}
        <li className="nav-item d-none d-sm-inline-block ml-auto">
          <ul className="navbar-nav ml-auto">
            
            <LogoutButton />
          </ul>
        </li>
      </nav>
    </div>
  );
}

export default Header;
