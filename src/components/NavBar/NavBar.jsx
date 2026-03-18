import { useState, useEffect } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  async function handleLogout() {
    await logout();
    closeMenu();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink className="navbar-brand" to="/" onClick={closeMenu}>
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

      {/* Mobile burger button */}
      <button
        className={`navbar-burger${menuOpen ? ' navbar-burger--open' : ''}`}
        onClick={toggleMenu}
        type="button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
      >
        <span className="navbar-burger__line" />
        <span className="navbar-burger__line" />
        <span className="navbar-burger__line" />
      </button>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`}>
        <div className="mobile-menu__links">
          <NavLink
            className={getNavItemClassName}
            to="/"
            style={{ '--i': 0 }}
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            className={getEventsNavItemClassName}
            to="/events"
            style={{ '--i': 1 }}
            onClick={closeMenu}
          >
            Events
          </NavLink>
          {isAuthenticated ? (
            <NavLink
              className={getNavItemClassName}
              to="/dashboard"
              style={{ '--i': 2 }}
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>
          ) : null}
          {user?.role === 'admin' ? (
            <NavLink
              className={getNavItemClassName}
              to="/admin"
              style={{ '--i': 3 }}
              onClick={closeMenu}
            >
              Admin
            </NavLink>
          ) : null}

          <div className="mobile-menu__divider" style={{ '--i': isAuthenticated ? (user?.role === 'admin' ? 4 : 3) : 2 }} />

          {isAuthenticated ? (
            <>
              <span className="mobile-menu__user" style={{ '--i': user?.role === 'admin' ? 5 : 4 }}>
                {user?.name || 'Member'}
              </span>
              <button
                className="navbar-logout mobile-menu__logout"
                onClick={handleLogout}
                type="button"
                style={{ '--i': user?.role === 'admin' ? 6 : 5 }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                className={getNavItemClassName}
                to="/login"
                style={{ '--i': 3 }}
                onClick={closeMenu}
              >
                Login
              </NavLink>
              <NavLink
                className={getNavItemClassName}
                to="/signup"
                style={{ '--i': 4 }}
                onClick={closeMenu}
              >
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
