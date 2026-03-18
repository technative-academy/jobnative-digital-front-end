import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { companiesService } from '../../services/companies.service';
import { eventsService } from '../../services/events.service';
import { Button } from '@/components/ui/button';
import {
  COMPANIES_QUERY_KEY,
  LOCAL_COMPANIES_QUERY_KEY,
} from '../../lib/companyData';
import { EVENTS_QUERY_KEY, LOCAL_EVENTS_QUERY_KEY } from '../../lib/eventData';
import Tag from '../../components/Tag/Tag';
import './Admin.css';

function Admin() {
  const queryClient = useQueryClient();
  const [companies, setCompanies] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);

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

  if (isLoading) return <p>Loading pending items...</p>;
  if (error) return <p>Something went wrong loading pending items.</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin - Moderation</h1>

      {actionMessage && <p className="admin-message">{actionMessage}</p>}

      <h2 className="admin-section-title">Pending Companies</h2>
      {companies.length === 0 ? (
        <p>No pending companies to review.</p>
      ) : (
        <div className="admin-list">
          {companies.map((company) => (
            <div key={company.id} className="admin-card">
              <div className="admin-card-header">
                <h2>{company.name}</h2>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-link"
                  >
                    Website
                  </a>
                )}
              </div>
              {company.description && (
                <p className="admin-card-description">{company.description}</p>
              )}
              <div className="admin-card-tags">
                {company.technologies?.map((tech) => (
                  <Tag category="technology" key={tech.name} text={tech.name} />
                ))}
              </div>
              {company.industry && (
                <p className="admin-card-meta">Industry: {company.industry}</p>
              )}
              <div className="admin-card-actions">
                <Button onClick={() => handleApproveCompany(company.id)}>
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectCompany(company.id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="admin-section-title">Pending Events</h2>
      {events.length === 0 ? (
        <p>No pending events to review.</p>
      ) : (
        <div className="admin-list">
          {events.map((event) => (
            <div key={event.id} className="admin-card">
              <div className="admin-card-header">
                <h2>{event.name}</h2>
                {event.website && (
                  <a
                    href={event.website}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-link"
                  >
                    Website
                  </a>
                )}
              </div>
              {event.location && (
                <p className="admin-card-meta">{event.location}</p>
              )}
              {(event.start_time || event.startTime) && (
                <p className="admin-card-meta">
                  {new Date(
                    event.start_time || event.startTime,
                  ).toLocaleString()}
                  {(event.end_time || event.endTime) &&
                    ` — ${new Date(event.end_time || event.endTime).toLocaleString()}`}
                </p>
              )}
              {event.description && (
                <p className="admin-card-description">{event.description}</p>
              )}
              <div className="admin-card-tags">
                {event.technologies?.map((tech) => (
                  <Tag
                    category="technology"
                    key={tech.name || tech}
                    text={tech.name || tech}
                  />
                ))}
              </div>
              {event.sponsors?.length > 0 && (
                <div className="admin-card-tags">
                  {event.sponsors.map((sponsor) => (
                    <Tag
                      category="sponsor"
                      key={sponsor.id || sponsor.name}
                      text={sponsor.name}
                    />
                  ))}
                </div>
              )}
              <div className="admin-card-actions">
                <Button onClick={() => handleApproveEvent(event.id)}>
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleRejectEvent(event.id)}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admin;
