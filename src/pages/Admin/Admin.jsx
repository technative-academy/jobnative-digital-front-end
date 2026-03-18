import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { companiesService } from '../../services/companies.service';
import { eventsService } from '../../services/events.service';
import {
  COMPANIES_QUERY_KEY,
  LOCAL_COMPANIES_QUERY_KEY,
} from '../../lib/companyData';
import { EVENTS_QUERY_KEY, LOCAL_EVENTS_QUERY_KEY } from '../../lib/eventData';
import Tag from '../../components/Tag/Tag';
import './Admin.css';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function SkeletonRows() {
  return Array.from({ length: 3 }, (_, i) => (
    <div key={i} className="admin-skeleton-row" aria-hidden="true">
      <div
        className="skeleton skeleton--rounded"
        style={{ width: 40, height: 40, flexShrink: 0 }}
      />
      <div style={{ flex: 1 }}>
        <div
          className="skeleton"
          style={{ width: '50%', height: 14, marginBottom: 6 }}
        />
        <div className="skeleton" style={{ width: '30%', height: 11 }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div
          className="skeleton skeleton--pill"
          style={{ width: 72, height: 32 }}
        />
        <div
          className="skeleton skeleton--pill"
          style={{ width: 64, height: 32 }}
        />
      </div>
    </div>
  ));
}

function CompanyEmptyIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}

function EventEmptyIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`chevron-icon${expanded ? ' chevron-icon--open' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PendingCompanyItem({ company, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = company.description || company.technologies?.length > 0;

  return (
    <div className="pending-item">
      <div className="pending-row">
        <div className="pending-info">
          <div className="pending-avatar">{getInitials(company.name)}</div>
          <div className="pending-text">
            <div className="pending-name">{company.name}</div>
            <div className="pending-meta">
              {company.industry && <span>{company.industry}</span>}
              {company.industry && company.website && ' · '}
              {company.website && (
                <a href={company.website} target="_blank" rel="noreferrer">
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="pending-right">
          <div className="pending-actions">
            <button
              className="btn-approve"
              onClick={() => onApprove(company.id)}
            >
              Approve
            </button>
            <button className="btn-reject" onClick={() => onReject(company.id)}>
              Reject
            </button>
          </div>
          {hasDetails && (
            <button
              className="btn-chevron"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? 'Collapse details' : 'Expand details'}
            >
              <ChevronIcon expanded={expanded} />
            </button>
          )}
        </div>
      </div>
      {expanded && hasDetails && (
        <div className="pending-details">
          {company.description && (
            <p className="pending-description">{company.description}</p>
          )}
          {company.technologies?.length > 0 && (
            <div className="pending-detail-row">
              <span className="pending-detail-label">Technologies</span>
              <div className="pending-tags">
                {company.technologies.map((tech) => (
                  <Tag category="technology" key={tech.name} text={tech.name} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PendingEventItem({ event, onApprove, onReject }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails =
    event.description ||
    event.technologies?.length > 0 ||
    event.sponsors?.length > 0 ||
    event.start_time ||
    event.startTime;

  return (
    <div className="pending-item">
      <div className="pending-row">
        <div className="pending-info">
          <div className="pending-avatar">{getInitials(event.name)}</div>
          <div className="pending-text">
            <div className="pending-name">{event.name}</div>
            <div className="pending-meta">
              {event.location && <span>{event.location}</span>}
              {event.location && event.website && ' · '}
              {event.website && (
                <a href={event.website} target="_blank" rel="noreferrer">
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="pending-right">
          <div className="pending-actions">
            <button className="btn-approve" onClick={() => onApprove(event.id)}>
              Approve
            </button>
            <button className="btn-reject" onClick={() => onReject(event.id)}>
              Reject
            </button>
          </div>
          {hasDetails && (
            <button
              className="btn-chevron"
              onClick={() => setExpanded((prev) => !prev)}
              aria-label={expanded ? 'Collapse details' : 'Expand details'}
            >
              <ChevronIcon expanded={expanded} />
            </button>
          )}
        </div>
      </div>
      {expanded && hasDetails && (
        <div className="pending-details">
          {(event.start_time || event.startTime) && (
            <div className="pending-detail-row">
              <span className="pending-detail-label">Date</span>
              <span className="pending-detail-value">
                {new Date(event.start_time || event.startTime).toLocaleString()}
                {(event.end_time || event.endTime) &&
                  ` — ${new Date(event.end_time || event.endTime).toLocaleString()}`}
              </span>
            </div>
          )}
          {event.description && (
            <p className="pending-description">{event.description}</p>
          )}
          {event.technologies?.length > 0 && (
            <div className="pending-detail-row">
              <span className="pending-detail-label">Technologies</span>
              <div className="pending-tags">
                {event.technologies.map((tech) => (
                  <Tag
                    category="technology"
                    key={tech.name || tech}
                    text={tech.name || tech}
                  />
                ))}
              </div>
            </div>
          )}
          {event.sponsors?.length > 0 && (
            <div className="pending-detail-row">
              <span className="pending-detail-label">Sponsors</span>
              <div className="pending-tags">
                {event.sponsors.map((sponsor) => (
                  <Tag
                    category="sponsor"
                    key={sponsor.id || sponsor.name}
                    text={sponsor.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Admin() {
  const queryClient = useQueryClient();
  const [companies, setCompanies] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  async function loadPending() {
    try {
      setIsLoading(true);
      const [companyData, eventData] = await Promise.all([
        companiesService.getPending(),
        eventsService.getPending(),
      ]);
      setCompanies(companyData);
      setEvents(eventData);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPending();
  }, []);

  async function handleApproveCompany(id) {
    try {
      await companiesService.approve(id);
      setActionMessage('Company approved.');
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      queryClient.setQueryData(LOCAL_COMPANIES_QUERY_KEY, (current = []) =>
        current.filter((company) => company.id !== id),
      );
      void queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
    } catch {
      setActionMessage('Failed to approve company.');
    }
  }

  async function handleRejectCompany(id) {
    try {
      await companiesService.reject(id);
      setActionMessage('Company rejected.');
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      queryClient.setQueryData(LOCAL_COMPANIES_QUERY_KEY, (current = []) =>
        current.filter((company) => company.id !== id),
      );
      void queryClient.invalidateQueries({ queryKey: COMPANIES_QUERY_KEY });
    } catch {
      setActionMessage('Failed to reject company.');
    }
  }

  async function handleApproveEvent(id) {
    try {
      await eventsService.approve(id);
      setActionMessage('Event approved.');
      setEvents((prev) => prev.filter((e) => e.id !== id));
      queryClient.setQueryData(LOCAL_EVENTS_QUERY_KEY, (current = []) =>
        current.filter((event) => event.id !== id),
      );
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    } catch {
      setActionMessage('Failed to approve event.');
    }
  }

  async function handleRejectEvent(id) {
    try {
      await eventsService.reject(id);
      setActionMessage('Event rejected.');
      setEvents((prev) => prev.filter((e) => e.id !== id));
      queryClient.setQueryData(LOCAL_EVENTS_QUERY_KEY, (current = []) =>
        current.filter((event) => event.id !== id),
      );
      void queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    } catch {
      setActionMessage('Failed to reject event.');
    }
  }

  const showCompanies = activeTab === 'all' || activeTab === 'companies';
  const showEvents = activeTab === 'all' || activeTab === 'events';

  return (
    <div className="admin page-transition">
      {/* Header */}
      <div className="admin-header">
        <h1>Admin - Moderation</h1>
        <div className="admin-badge">
          <ShieldIcon />
          Admin access
        </div>
      </div>

      {/* Action message */}
      {actionMessage && <p className="admin-message">{actionMessage}</p>}

      {/* Tabs */}
      <div className="admin-tabs">
        {['all', 'companies', 'events'].map((tab) => (
          <button
            key={tab}
            className={`admin-tab${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all'
              ? 'All Pending'
              : tab === 'companies'
                ? 'Companies'
                : 'Events'}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <>
          {showCompanies && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Pending Companies</h2>
              </div>
              <SkeletonRows />
            </div>
          )}
          {showEvents && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Pending Events</h2>
              </div>
              <SkeletonRows />
            </div>
          )}
        </>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="admin-section">
          <p className="admin-error">
            Something went wrong loading pending items.
          </p>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {/* Pending Companies */}
          {showCompanies && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Pending Companies</h2>
                <span className="section-count">
                  {companies.length} pending
                </span>
              </div>

              {companies.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <CompanyEmptyIcon />
                  </div>
                  <h3>No pending companies</h3>
                  <p>All company submissions have been reviewed.</p>
                </div>
              ) : (
                companies.map((company) => (
                  <PendingCompanyItem
                    key={company.id}
                    company={company}
                    onApprove={handleApproveCompany}
                    onReject={handleRejectCompany}
                  />
                ))
              )}
            </div>
          )}

          {/* Pending Events */}
          {showEvents && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Pending Events</h2>
                <span className="section-count">{events.length} pending</span>
              </div>

              {events.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <EventEmptyIcon />
                  </div>
                  <h3>No pending events</h3>
                  <p>All event submissions have been reviewed.</p>
                </div>
              ) : (
                events.map((event) => (
                  <PendingEventItem
                    key={event.id}
                    event={event}
                    onApprove={handleApproveEvent}
                    onReject={handleRejectEvent}
                  />
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;
