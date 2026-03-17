import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  MapPin,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../../hooks/useAuth';
import { useCompanies } from '../../hooks/useCompanies';
import { companiesService } from '../../services/companies.service';
import { eventsService } from '../../services/events.service';
import { userCompanyStatesService } from '../../services/userCompanyStates.service';
import {
  DASHBOARD_COLUMNS,
  DEFAULT_DASHBOARD_COLUMN,
  normalizeDashboardNotes,
} from '../../utils/dashboardState';
import './Dashboard.css';

function formatDate(dateValue) {
  if (!dateValue) {
    return 'Recently';
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateValue));
}

function sortStates(states) {
  return [...states].sort((a, b) => {
    const left = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
    const right = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
    return right - left;
  });
}

function isMeaningfulValue(value) {
  if (typeof value !== 'string') {
    return Boolean(value);
  }

  const normalizedValue = value.trim();

  return (
    normalizedValue !== '' && normalizedValue.toLowerCase() !== 'not specified'
  );
}

function getCompanyMeta(company) {
  const parts = [company?.location, company?.industry].filter(
    isMeaningfulValue,
  );

  if (parts.length === 0) {
    return null;
  }

  return parts.join(' • ');
}

function ActionCard({ description, title, to }) {
  return (
    <Link className="dashboard-action" to={to}>
      <span className="dashboard-action__text">
        <span className="dashboard-action__title">{title}</span>
        <span className="dashboard-action__description">{description}</span>
      </span>
      <ArrowRight
        className="dashboard-action__arrow"
        size={16}
        strokeWidth={2.2}
      />
    </Link>
  );
}

function DashboardCompanyRow({ isExpanded, item, onRemove, onSave, onToggle }) {
  const [notesDraft, setNotesDraft] = useState(item.personalNotes ?? '');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [pendingAction, setPendingAction] = useState('');

  useEffect(() => {
    setNotesDraft(item.personalNotes ?? '');
    setFeedback('');
    setError('');
    setPendingAction('');
  }, [
    item.companyId,
    item.dashboardColumn,
    item.personalNotes,
    item.updatedAt,
  ]);

  const normalizedDraft = normalizeDashboardNotes(notesDraft);
  const savedNotes = item.personalNotes ?? '';
  const hasNoteChanges = normalizedDraft !== savedNotes;
  const hasSavedNotes = Boolean(normalizeDashboardNotes(item.personalNotes));
  const company = item.company;
  const companyMeta = getCompanyMeta(company);
  const updatedLabel = formatDate(item.updatedAt || item.createdAt);
  const detailsId = `dashboard-details-${item.companyId}`;

  async function handleSaveNotes() {
    setPendingAction('notes');
    setFeedback('');
    setError('');

    try {
      await onSave(
        item.companyId,
        item.dashboardColumn,
        normalizedDraft,
        item.dashboardColumn,
      );
      setFeedback('Notes saved.');
    } catch (requestError) {
      setError(requestError.message || 'Unable to save notes.');
    } finally {
      setPendingAction('');
    }
  }

  async function handleMove(nextColumn) {
    if (nextColumn === item.dashboardColumn) {
      return;
    }

    setPendingAction(nextColumn);
    setFeedback('');
    setError('');

    try {
      await onSave(
        item.companyId,
        nextColumn,
        normalizedDraft,
        item.dashboardColumn,
      );
    } catch (requestError) {
      setError(requestError.message || 'Unable to update this company.');
      setPendingAction('');
    }
  }

  async function handleRemove() {
    setPendingAction('remove');
    setFeedback('');
    setError('');

    try {
      await onRemove(item.companyId, item.dashboardColumn);
    } catch (requestError) {
      setError(requestError.message || 'Unable to remove this company.');
      setPendingAction('');
    }
  }

  return (
    <article
      className={`dashboard-row${isExpanded ? ' dashboard-row--expanded' : ''}`}
    >
      <button
        aria-controls={detailsId}
        aria-expanded={isExpanded}
        className="dashboard-row__summary"
        onClick={onToggle}
        type="button"
      >
        <div className="dashboard-row__summary-main">
          <div className="dashboard-row__summary-top">
            <h4>{company?.name || `Company #${item.companyId}`}</h4>
            <div className="dashboard-row__summary-badges">
              {hasSavedNotes ? (
                <span
                  aria-label="Private notes saved"
                  className="dashboard-row__note-indicator"
                  title="Private notes saved"
                >
                  <FileText size={14} strokeWidth={2.2} />
                </span>
              ) : null}
              <span className="dashboard-row__updated">
                Updated {updatedLabel}
              </span>
            </div>
          </div>
          {companyMeta ? (
            <p className="dashboard-row__meta">{companyMeta}</p>
          ) : null}
        </div>
        <span className="dashboard-row__chevron">
          {isExpanded ? (
            <ChevronUp size={18} strokeWidth={2.2} />
          ) : (
            <ChevronDown size={18} strokeWidth={2.2} />
          )}
        </span>
      </button>

      <div
        aria-hidden={!isExpanded}
        className="dashboard-row__details"
        id={detailsId}
      >
        <div className="dashboard-row__detail-meta">
          {company?.location ? (
            <span>
              <MapPin size={14} strokeWidth={2} />
              {company.location}
            </span>
          ) : null}
          {company?.website ? (
            <a href={company.website} rel="noreferrer" target="_blank">
              <ExternalLink size={14} strokeWidth={2} />
              Website
            </a>
          ) : null}
        </div>

        {company?.technologyList?.length ? (
          <div className="dashboard-chip-row">
            {company.technologyList.slice(0, 4).map((technology) => (
              <span
                className="dashboard-chip"
                key={`${item.companyId}-${technology}`}
              >
                {technology}
              </span>
            ))}
          </div>
        ) : null}

        <label
          className="dashboard-row__notes-label"
          htmlFor={`dashboard-notes-${item.companyId}`}
        >
          Private notes
        </label>
        <Textarea
          className="dashboard-row__notes"
          id={`dashboard-notes-${item.companyId}`}
          onChange={(event) => setNotesDraft(event.target.value)}
          placeholder="Add reminders, outreach notes, or next steps."
          value={notesDraft}
        />

        <div className="dashboard-row__actions">
          <div className="dashboard-row__move-row">
            {DASHBOARD_COLUMNS.filter(
              (column) => column.value !== item.dashboardColumn,
            ).map((column) => (
              <button
                className="dashboard-move-button"
                disabled={Boolean(pendingAction)}
                key={`${item.companyId}-${column.value}`}
                onClick={() => handleMove(column.value)}
                type="button"
              >
                Move to {column.shortLabel}
              </button>
            ))}
          </div>

          <div className="dashboard-row__button-row">
            <button
              className="dashboard-row__control dashboard-row__control--primary"
              disabled={!hasNoteChanges || Boolean(pendingAction)}
              onClick={handleSaveNotes}
              type="button"
            >
              Save notes
            </button>
            <button
              className="dashboard-row__control dashboard-row__control--danger"
              disabled={Boolean(pendingAction)}
              onClick={handleRemove}
              type="button"
            >
              <Trash2 size={15} strokeWidth={2} />
              Remove
            </button>
          </div>
        </div>

        {feedback ? <p className="dashboard-feedback">{feedback}</p> : null}
        {error ? (
          <p className="dashboard-feedback dashboard-feedback--error">
            {error}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function Dashboard() {
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { user } = useAuth();
  const [dashboardStates, setDashboardStates] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeTab, setActiveTab] = useState(DEFAULT_DASHBOARD_COLUMN);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const [statesError, setStatesError] = useState(null);
  const [adminSummary, setAdminSummary] = useState({
    error: null,
    isLoading: false,
    pendingCompanies: 0,
    pendingEvents: 0,
  });

  useEffect(() => {
    let isActive = true;

    async function loadDashboardStates() {
      try {
        setIsLoadingStates(true);
        setStatesError(null);
        const states = await userCompanyStatesService.list();

        if (isActive) {
          setDashboardStates(sortStates(Array.isArray(states) ? states : []));
        }
      } catch (requestError) {
        if (isActive) {
          setStatesError(requestError);
          setDashboardStates([]);
        }
      } finally {
        if (isActive) {
          setIsLoadingStates(false);
        }
      }
    }

    loadDashboardStates();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (user?.role !== 'admin') {
      setAdminSummary({
        error: null,
        isLoading: false,
        pendingCompanies: 0,
        pendingEvents: 0,
      });
      return;
    }

    let isActive = true;

    async function loadAdminSummary() {
      try {
        setAdminSummary((current) => ({
          ...current,
          error: null,
          isLoading: true,
        }));

        const [pendingCompanies, pendingEvents] = await Promise.all([
          companiesService.getPending(),
          eventsService.getPending(),
        ]);

        if (isActive) {
          setAdminSummary({
            error: null,
            isLoading: false,
            pendingCompanies: Array.isArray(pendingCompanies)
              ? pendingCompanies.length
              : 0,
            pendingEvents: Array.isArray(pendingEvents)
              ? pendingEvents.length
              : 0,
          });
        }
      } catch (requestError) {
        if (isActive) {
          setAdminSummary({
            error: requestError,
            isLoading: false,
            pendingCompanies: 0,
            pendingEvents: 0,
          });
        }
      }
    }

    loadAdminSummary();

    return () => {
      isActive = false;
    };
  }, [user?.role]);

  async function handleSaveState(
    companyId,
    dashboardColumn,
    personalNotes,
    previousColumn = dashboardColumn,
  ) {
    const nextState = await userCompanyStatesService.upsert(companyId, {
      dashboardColumn,
      personalNotes,
    });

    setDashboardStates((currentStates) =>
      sortStates([
        nextState,
        ...currentStates.filter(
          (state) => state.companyId !== nextState.companyId,
        ),
      ]),
    );

    if (previousColumn !== dashboardColumn) {
      setExpandedRow((current) => (current === companyId ? null : current));
    }

    return nextState;
  }

  async function handleRemoveState(companyId) {
    await userCompanyStatesService.delete(companyId);
    setDashboardStates((currentStates) =>
      currentStates.filter((state) => state.companyId !== companyId),
    );
    setExpandedRow((current) => (current === companyId ? null : current));
  }

  function handleToggleRow(companyId) {
    setExpandedRow((current) => (current === companyId ? null : companyId));
  }

  function handleTabKeyDown(event, currentIndex) {
    const tabCount = columnSections.length;
    let newIndex = -1;

    if (event.key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % tabCount;
    } else if (event.key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + tabCount) % tabCount;
    } else if (event.key === 'Home') {
      newIndex = 0;
    } else if (event.key === 'End') {
      newIndex = tabCount - 1;
    }

    if (newIndex >= 0) {
      event.preventDefault();
      const nextColumn = columnSections[newIndex];
      setActiveTab(nextColumn.value);
      document.getElementById(`dashboard-tab-${nextColumn.value}`)?.focus();
    }
  }

  const companiesById = useMemo(
    () =>
      new Map(
        (companies || []).map((company) => [Number(company.id), company]),
      ),
    [companies],
  );

  const trackedCompanies = useMemo(
    () =>
      dashboardStates.map((state) => ({
        ...state,
        company: companiesById.get(Number(state.companyId)) || null,
      })),
    [dashboardStates, companiesById],
  );

  const columnSections = useMemo(
    () =>
      DASHBOARD_COLUMNS.map((column) => ({
        ...column,
        items: trackedCompanies.filter(
          (state) => state.dashboardColumn === column.value,
        ),
      })),
    [trackedCompanies],
  );

  const pendingReviewCount =
    adminSummary.pendingCompanies + adminSummary.pendingEvents;
  const browseDescription =
    companies?.length > 0
      ? `${companies.length} approved companies in the directory.`
      : 'Explore companies in the directory.';
  const moderationDescription = adminSummary.isLoading
    ? 'Checking the moderation queue.'
    : pendingReviewCount > 0
      ? `${pendingReviewCount} submissions waiting for approval.`
      : 'No submissions waiting right now.';
  const roleLabel = user?.role
    ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}`
    : 'User';

  return (
    <section className="dashboard-page">
      <div className="dashboard-banner">
        <div>
          <h1>Welcome back, {user?.name || 'there'}</h1>
          <p>
            Track your next targets, keep private notes, and keep your outreach
            organised in one place.
          </p>
        </div>
        <div className="dashboard-banner__aside">
          <span className="dashboard-banner__pill">
            {dashboardStates.length} saved companies
          </span>
          {user?.role === 'admin' ? (
            <span className="dashboard-banner__pill dashboard-banner__pill--light">
              {adminSummary.isLoading
                ? 'Checking moderation'
                : `${pendingReviewCount} pending approvals`}
            </span>
          ) : null}
        </div>
      </div>

      <div className="dashboard-summary-grid">
        <article className="dashboard-card">
          <h2>Account Snapshot</h2>
          <div className="dashboard-profile-field">
            <span className="dashboard-profile-field__label">Name</span>
            <span className="dashboard-profile-field__value">
              {user?.name || 'Unknown'}
            </span>
          </div>
          <div className="dashboard-profile-field">
            <span className="dashboard-profile-field__label">Email</span>
            <span className="dashboard-profile-field__value">
              {user?.email || 'Unknown'}
            </span>
          </div>
          <div className="dashboard-profile-field">
            <span className="dashboard-profile-field__label">Role</span>
            <span className="dashboard-role-badge">{roleLabel}</span>
          </div>
          <div className="dashboard-profile-field">
            <span className="dashboard-profile-field__label">Member since</span>
            <span className="dashboard-profile-field__value">
              {formatDate(user?.createdAt)}
            </span>
          </div>
        </article>

        <article className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="dashboard-actions">
            <ActionCard
              description={browseDescription}
              icon={Building2}
              title="Browse Companies"
              to="/"
              tone="purple"
            />
            <ActionCard
              description="Check approved events and community meetups."
              icon={CalendarDays}
              title="View Events"
              to="/events"
              tone="green"
            />
            {user?.role === 'admin' ? (
              <ActionCard
                description={moderationDescription}
                icon={ShieldCheck}
                title="Admin Panel"
                to="/admin"
                tone="amber"
              />
            ) : null}
          </div>
        </article>
      </div>

      <div className="dashboard-saved">
        <div className="dashboard-saved__header">
          <h2>Saved Companies</h2>
          <p>Track your target companies here</p>
        </div>

        <div className="dashboard-saved__tabs" role="tablist">
          {columnSections.map((column, index) => (
            <button
              aria-controls={`dashboard-tab-panel-${column.value}`}
              aria-selected={activeTab === column.value}
              className={`dashboard-saved__tab${activeTab === column.value ? ' dashboard-saved__tab--active' : ''}`}
              id={`dashboard-tab-${column.value}`}
              key={column.value}
              onClick={() => setActiveTab(column.value)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              role="tab"
              tabIndex={activeTab === column.value ? 0 : -1}
              type="button"
            >
              {column.label}
              <span className="dashboard-saved__tab-count">
                {column.items.length}
              </span>
            </button>
          ))}
        </div>

        {columnSections.map((column) => (
          <div
            aria-labelledby={`dashboard-tab-${column.value}`}
            className={`dashboard-saved__panel${activeTab === column.value ? ' dashboard-saved__panel--active' : ''}`}
            id={`dashboard-tab-panel-${column.value}`}
            key={column.value}
            role="tabpanel"
            tabIndex={0}
          >
            {isLoadingStates ? (
              <div className="dashboard-empty-card">
                Loading your saved companies…
              </div>
            ) : statesError ? (
              <div className="dashboard-empty-card dashboard-empty-card--error">
                {statesError.message ||
                  'Unable to load your dashboard right now.'}
              </div>
            ) : column.items.length === 0 ? (
              <div className="dashboard-empty-card">
                {column.emptyDescription}
              </div>
            ) : (
              <div className="dashboard-saved__list">
                {column.items.map((item) => (
                  <DashboardCompanyRow
                    isExpanded={expandedRow === item.companyId}
                    item={item}
                    key={item.companyId}
                    onRemove={handleRemoveState}
                    onSave={handleSaveState}
                    onToggle={() => handleToggleRow(item.companyId)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {user?.role === 'admin' && adminSummary.error ? (
        <p className="dashboard-admin-note">
          Unable to load moderation counts right now.
        </p>
      ) : null}

      {companiesLoading && dashboardStates.length > 0 ? (
        <p className="dashboard-admin-note">
          Loading company details for your saved list.
        </p>
      ) : null}
    </section>
  );
}

export default Dashboard;
