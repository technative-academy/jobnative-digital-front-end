import { LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./NavBar.css";

function getNavItemClassName({ isActive }) {
  return isActive ? "nav-item nav-item-active" : "nav-item";
}

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink className={getNavItemClassName} to="/">
          Home
        </NavLink>
        {isAuthenticated ? (
          <NavLink className={getNavItemClassName} to="/dashboard">
            Dashboard
          </NavLink>
        ) : null}
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">{user?.name || "Member"}</span>
            <button className="navbar-logout" onClick={handleLogout} type="button">
              <LogOut size={16} strokeWidth={2.25} />
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink className={getNavItemClassName} to="/login">
              Login
            </NavLink>
            <NavLink className={getNavItemClassName} to="/signup">
              Sign Up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
