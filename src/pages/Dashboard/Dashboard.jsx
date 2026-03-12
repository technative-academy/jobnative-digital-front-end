import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Recently';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateValue));
}

function Dashboard() {
  const { logout, user } = useAuth();

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <h1>Welcome, {user?.name || 'there'}</h1>
      </div>

      <div className="dashboard-grid">
        <article className="dashboard-panel">
          <h2>Account snapshot</h2>
          <dl className="dashboard-details">
            <div>
              <dt>Name</dt>
              <dd>{user?.name || 'Unknown'}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user?.email || 'Unknown'}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{user?.role || 'user'}</dd>
            </div>
            <div>
              <dt>Member since</dt>
              <dd>{formatDate(user?.createdAt)}</dd>
            </div>
          </dl>
        </article>

        <article className="dashboard-panel dashboard-panel--accent">
          <div className="dashboard-actions">
            <Link className="btn-primary" to="/">
              Browse companies
            </Link>
            <button
              className="dashboard-secondary"
              onClick={logout}
              type="button"
            >
              Log out
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
