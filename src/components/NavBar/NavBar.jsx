import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className='navbar'>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? "navbar-active" : ""
                }
            >
                Home
            </NavLink>

            <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    isActive ? "navbar-active" : ""
                }
            >
                Dashboard
            </NavLink>

        </nav>
    )
}

export default Navbar