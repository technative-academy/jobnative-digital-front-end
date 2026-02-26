import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="nav-item">
          Home
        </NavLink>

        <NavLink to="/events" className="nav-item">
          Events
        </NavLink>

        <NavLink to="/dashboard" className="nav-item">
          Dashboard
        </NavLink>
      </div>

      <div className="navbar-right">
        <NavLink to="/login" className="nav-item">
          Login
        </NavLink>

        <NavLink to="/signup" className="nav-item">
          Sign Up
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
