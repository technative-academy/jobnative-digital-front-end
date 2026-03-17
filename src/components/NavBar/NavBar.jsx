import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './NavBar.css';

function getNavItemClassName({ isActive }) {
  return isActive ? 'nav-item nav-item--active' : 'nav-item';
}

function getEventsNavItemClassName({ isActive }) {
  return isActive ? 'nav-item nav-item--active-green' : 'nav-item';
}

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isEventsPage = location.pathname.startsWith('/events');

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink className="navbar-brand" to="/">
          <span
            className={`navbar-brand__job${isEventsPage ? ' navbar-brand__job--green' : ''}`}
          >
            Job
          </span>
          <span className="navbar-brand__native">Native</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink className={getNavItemClassName} to="/">
            Home
          </NavLink>
          <NavLink className={getEventsNavItemClassName} to="/events">
            Events
          </NavLink>
          {isAuthenticated ? (
            <NavLink className={getNavItemClassName} to="/dashboard">
              Dashboard
            </NavLink>
          ) : null}
          {user?.role === 'admin' ? (
            <NavLink className={getNavItemClassName} to="/admin">
              Admin
            </NavLink>
          ) : null}
        </div>
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span className="navbar-user">{user?.name || 'Member'}</span>
            <button
              className="navbar-logout"
              onClick={handleLogout}
              type="button"
            >
              Log out
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
