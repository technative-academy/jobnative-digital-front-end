import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Pencil, Trash2, Star, CheckSquare, Mail } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Tag from '../../components/Tag/Tag';
import { useCompany } from '../../hooks/useCompany';
import { useComments } from '../../hooks/useComments';
import { useAuth } from '../../hooks/useAuth';
import { useDeleteCompany } from '../../hooks/useDeleteCompany';
import { userCompanyStatesService } from '../../services/userCompanyStates.service';
import {
  DASHBOARD_COLUMNS,
  DEFAULT_DASHBOARD_COLUMN,
  getDashboardColumnMeta,
  normalizeDashboardNotes,
} from '../../utils/dashboardState';
import { getAvatarTone, getCompanyMonogram } from '../../utils/colorSystem';
import { isPendingCompany } from '../../lib/companyData';
import AddCompanyDialog from '../../components/AddCompanyDialog/AddCompanyDialog';
import './CompanyDetail.css';

const successToastStyle = {
  background: '#f5f3fb',
  border: '2px solid #7e57e1',
  color: '#3d0fa8',
};

const errorToastStyle = {
  background: '#fff5f5',
  border: '1px solid #fecaca',
  color: '#7f1d1d',
};

const TRACKER_COLUMN_ICONS = {
  favourite: Star,
  todo: CheckSquare,
  contacted: Mail,
};

const TRACKER_COLUMN_COLORS = {
  favourite: 'purple',
  todo: 'green',
  contacted: 'blue',
};

function getUserInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatCommentDate(comment) {
  const raw = comment.createdAt || comment.created_at || comment.updatedAt || comment.updated_at;
  if (!raw) return null;
  const date = new Date(raw);
  if (isNaN(date)) return null;
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function Comment({ comment, isOwner, currentUserName, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(comment.body);
  const value = editing ? draftValue : comment.body;
  const userName = comment.user?.name || (isOwner ? currentUserName : null) || 'User';
  const tone = getAvatarTone(userName);
  const initials = getUserInitials(userName);
  const timeLabel = formatCommentDate(comment);

  async function handleSave() {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    await onEdit(comment.id, trimmedValue);
    setDraftValue(trimmedValue);
    setEditing(false);
  }

  return (
    <div className="cd-comment">
      <div className={`cd-comment__avatar cd-comment__avatar--${tone}`}>
        {initials}
      </div>
      <div className="cd-comment__content">
        <div className="cd-comment__top">
          <span className="cd-comment__author">{userName}</span>
          {timeLabel && <span className="cd-comment__time">{timeLabel}</span>}
        </div>
        {editing ? (
          <textarea
            className="cd-comment__edit-textarea"
            onChange={(e) => setDraftValue(e.target.value)}
            value={value}
          />
        ) : (
          <p className="cd-comment__text">{value}</p>
        )}
        {isOwner ? (
          <div className="cd-comment__actions">
            {editing ? (
              <>
                <button className="cd-comment__action-btn cd-comment__action-btn--save" onClick={handleSave} type="button">Save</button>
                <button className="cd-comment__action-btn" onClick={() => { setDraftValue(comment.body); setEditing(false); }} type="button">Cancel</button>
              </>
            ) : (
              <>
                <button className="cd-comment__action-btn" onClick={() => { setDraftValue(comment.body); setEditing(true); }} type="button">
                  <Pencil size={12} /> Edit
                </button>
                <button className="cd-comment__action-btn cd-comment__action-btn--delete" onClick={() => onDelete(comment.id)} type="button">
                  <Trash2 size={12} /> Delete
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useCompany(id);
  const { isAuthenticated, user } = useAuth();
  const { deleteCompany } = useDeleteCompany();
  const {
    comments,
    addComment,
    editComment,
    deleteComment,
    error: commentsError,
    isLoading: commentsLoading,
  } = useComments(id, { enabled: isAuthenticated });

  const [newComment, setNewComment] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Tracker state
  const [trackerForm, setTrackerForm] = useState({
    dashboardColumn: DEFAULT_DASHBOARD_COLUMN,
    personalNotes: '',
  });
  const [savedTrackerState, setSavedTrackerState] = useState(null);
  const [isTrackerLoading, setIsTrackerLoading] = useState(false);
  const [isTrackerSaving, setIsTrackerSaving] = useState(false);
  const [trackerMessage, setTrackerMessage] = useState('');
  const [trackerError, setTrackerError] = useState('');

  useEffect(() => {
    if (!id || !isAuthenticated) {
      setSavedTrackerState(null);
      setTrackerForm({ dashboardColumn: DEFAULT_DASHBOARD_COLUMN, personalNotes: '' });
      setIsTrackerLoading(false);
      setIsTrackerSaving(false);
      setTrackerMessage('');
      setTrackerError('');
      return;
    }

    let isActive = true;

    async function loadTrackerState() {
      try {
        setIsTrackerLoading(true);
        setTrackerError('');
        setTrackerMessage('');
        const trackerState = await userCompanyStatesService.getByCompanyId(id);
        if (isActive) {
          setSavedTrackerState(trackerState);
          setTrackerForm({
            dashboardColumn: trackerState.dashboardColumn || DEFAULT_DASHBOARD_COLUMN,
            personalNotes: trackerState.personalNotes ?? '',
          });
        }
      } catch (requestError) {
        if (!isActive) return;
        if (requestError?.status === 404) {
          setSavedTrackerState(null);
          setTrackerForm({ dashboardColumn: DEFAULT_DASHBOARD_COLUMN, personalNotes: '' });
        } else {
          setTrackerError(requestError.message || 'Unable to load dashboard state.');
        }
      } finally {
        if (isActive) setIsTrackerLoading(false);
      }
    }

    loadTrackerState();
    return () => { isActive = false; };
  }, [id, isAuthenticated]);

  if (isLoading) {
    return <div className="cd-page"><p className="cd-loading">Loading company...</p></div>;
  }

  if (error) {
    return (
      <div className="cd-page">
        <p className="cd-error">{error.message || 'Unable to load company.'}</p>
      </div>
    );
  }

  if (!data) {
    return <div className="cd-page"><p className="cd-error">Company not found.</p></div>;
  }

  const canManage =
    user && (user.id === data.createdByUserId || user.role === 'admin');
  const pending = isPendingCompany(data);
  const palette = getAvatarTone(data.name);
  const initials = getCompanyMonogram(data.name);

  const technologies = (data.technologies || []).map((t) => t?.name ?? t).filter(Boolean);
  const jobRoles = (data.jobRoles || data.jobRoleTags || []).map((r) => r?.name ?? r).filter(Boolean);

  const normalizedTrackerNotes = normalizeDashboardNotes(trackerForm.personalNotes);
  const savedNotes = savedTrackerState?.personalNotes ?? '';
  const isTrackerDirty =
    trackerForm.dashboardColumn !==
      (savedTrackerState?.dashboardColumn || DEFAULT_DASHBOARD_COLUMN) ||
    normalizedTrackerNotes !== savedNotes;
  const canSaveTracker = !savedTrackerState || isTrackerDirty;

  async function handleDeleteCompany() {
    try {
      setIsDeleting(true);
      await deleteCompany(data.id);
      toast.success('Company deleted', {
        description: `${data.name} has been removed.`,
        style: successToastStyle,
      });
      navigate('/');
    } catch (deleteError) {
      toast.error('Could not delete company', {
        description: deleteError?.message || 'Please try again.',
        style: errorToastStyle,
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleSubmitComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await addComment(newComment.trim());
      setNewComment('');
    } catch {
      alert('You must be logged in to add a comment.');
    }
  }

  async function handleSaveTracker() {
    try {
      setIsTrackerSaving(true);
      setTrackerError('');
      setTrackerMessage('');
      const trackerState = await userCompanyStatesService.upsert(id, {
        dashboardColumn: trackerForm.dashboardColumn,
        personalNotes: normalizedTrackerNotes,
      });
      setSavedTrackerState(trackerState);
      setTrackerForm({
        dashboardColumn: trackerState.dashboardColumn,
        personalNotes: trackerState.personalNotes ?? '',
      });
      setTrackerMessage(
        savedTrackerState
          ? 'Dashboard entry updated.'
          : 'Company saved to your dashboard.',
      );
    } catch (requestError) {
      setTrackerError(requestError.message || 'Unable to save dashboard state.');
    } finally {
      setIsTrackerSaving(false);
    }
  }

  async function handleRemoveTracker() {
    try {
      setIsTrackerSaving(true);
      setTrackerError('');
      setTrackerMessage('');
      await userCompanyStatesService.delete(id);
      setSavedTrackerState(null);
      setTrackerForm({ dashboardColumn: DEFAULT_DASHBOARD_COLUMN, personalNotes: '' });
      setTrackerMessage('Removed from your dashboard.');
    } catch (requestError) {
      setTrackerError(requestError.message || 'Unable to remove this dashboard entry.');
    } finally {
      setIsTrackerSaving(false);
    }
  }

  return (
    <div className="cd-page page-transition">
      <AddCompanyDialog
        open={editDialogOpen}
        onOpenChange={(open) => setEditDialogOpen(open)}
        company={editDialogOpen ? data : undefined}
      />

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteDialogOpen(false);
        }}
      >
        <AlertDialogContent className="border-[#ddd5f0] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-[#fff3f2] text-[#dc2626]">
              <Trash2 className="size-7" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this company?</AlertDialogTitle>
            <AlertDialogDescription>
              {data.name} will be removed from the companies list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              className="bg-[#dc2626] hover:bg-[#b91c1c] focus-visible:ring-[#fecaca]"
              onClick={async (e) => {
                e.preventDefault();
                await handleDeleteCompany();
              }}
            >
              {isDeleting ? 'Deleting...' : 'Delete company'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Breadcrumb */}
      <nav className="cd-breadcrumb">
        <Link to="/">Companies</Link>
        <span className="cd-breadcrumb__sep"><ChevronRight size={14} /></span>
        <span className="cd-breadcrumb__current">{data.name}</span>
      </nav>

      {/* Hero Card */}
      <div className="cd-hero">
        <div className="cd-hero__banner">
          <div className="cd-hero__info">
            <div className={`cd-hero__avatar cd-hero__avatar--${palette}`}>{initials}</div>
            <div className="cd-hero__text">
              <h1 className="cd-hero__name">{data.name}</h1>
              <div className="cd-hero__links">
                {data.website && (
                  <a href={data.website} target="_blank" rel="noreferrer" className="cd-hero__link">
                    Website <ArrowUpRight size={14} />
                  </a>
                )}
                {data.linkedin && (
                  <a href={data.linkedin} target="_blank" rel="noreferrer" className="cd-hero__link">
                    LinkedIn <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="cd-hero__right">
            {pending && (
              <span className="cd-hero__status cd-hero__status--pending">Pending</span>
            )}
            {canManage && (
              <>
                <button
                  type="button"
                  className="cd-hero__edit-btn"
                  onClick={() => setEditDialogOpen(true)}
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  type="button"
                  className="cd-hero__delete-btn"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Meta Strip */}
        <div className="cd-hero__meta">
          <div className="cd-meta-item">
            <span className="cd-meta-item__label">Location</span>
            <span className="cd-meta-item__value">{data.location || 'Not specified'}</span>
          </div>
          <div className="cd-meta-item">
            <span className="cd-meta-item__label">Industry</span>
            <span className="cd-meta-item__value">{data.industry || 'Not specified'}</span>
          </div>
          <div className="cd-meta-item">
            <span className="cd-meta-item__label">Tech Stack</span>
            {technologies.length > 0 ? (
              <div className="cd-meta-item__chips">
                {technologies.map((tech) => (
                  <Tag category="technology" key={tech} text={tech} />
                ))}
              </div>
            ) : (
              <span className="cd-meta-item__empty">Not specified</span>
            )}
          </div>
          <div className="cd-meta-item">
            <span className="cd-meta-item__label">Job Roles</span>
            {jobRoles.length > 0 ? (
              <div className="cd-meta-item__chips">
                {jobRoles.map((role) => (
                  <Tag category="role" key={role} text={role} />
                ))}
              </div>
            ) : (
              <span className="cd-meta-item__empty">Not specified</span>
            )}
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="cd-columns">
        <div>
          {/* Description */}
          <div className="cd-card">
            <h2 className="cd-card__title">Description</h2>
            {data.description ? (
              <p className="cd-card__description">{data.description}</p>
            ) : (
              <p className="cd-card__empty">No description provided yet.</p>
            )}
          </div>

          {/* Comments */}
          <div className="cd-card">
            <h2 className="cd-card__title">Community Comments</h2>
            {isAuthenticated ? (
              <>
                <div className="cd-comments__list">
                  {commentsLoading ? (
                    <p className="cd-comments__empty">Loading comments...</p>
                  ) : commentsError ? (
                    <p className="cd-comments__empty">
                      {commentsError.message || 'Unable to load comments.'}
                    </p>
                  ) : comments.length === 0 ? (
                    <p className="cd-comments__empty">No comments yet. Be the first to share your thoughts!</p>
                  ) : (
                    comments.map((comment) => (
                      <Comment
                        comment={comment}
                        currentUserName={user?.name}
                        isOwner={(comment.userId ?? comment.user_id) === user?.id}
                        key={comment.id}
                        onDelete={deleteComment}
                        onEdit={editComment}
                      />
                    ))
                  )}
                </div>
                <div className="cd-comments__add">
                  <div className={`cd-comment__avatar cd-comment__avatar--${getAvatarTone(user?.name)}`}>
                    {getUserInitials(user?.name)}
                  </div>
                  <div className="cd-comments__add-input">
                    <textarea
                      className="cd-comments__textarea"
                      id="cd-add-comment"
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your experience or ask a question..."
                      rows={3}
                      value={newComment}
                    />
                    <button
                      type="button"
                      className="cd-comments__submit"
                      disabled={!newComment.trim()}
                      onClick={handleSubmitComment}
                    >
                      Post comment
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <p className="cd-login-hint">
                Log in to read and leave comments.
              </p>
            )}
          </div>
        </div>

        {/* Right column — Tracker */}
        <div>
          <div className="cd-card">
            <h2 className="cd-card__title">My Job Tracker</h2>
            {isAuthenticated ? (
              <div className="company-tracker">
                <p className="company-tracker__intro">
                  Save this company to your dashboard, choose which column it
                  belongs in, and keep private notes for your own job search.
                </p>

                {savedTrackerState ? (
                  <p className="company-tracker__saved-state">
                    Currently in{' '}
                    <strong>
                      {getDashboardColumnMeta(savedTrackerState.dashboardColumn)?.label || 'To Do'}
                    </strong>
                    .
                  </p>
                ) : null}

                <div className="company-tracker__columns">
                  {DASHBOARD_COLUMNS.map((column) => {
                    const Icon = TRACKER_COLUMN_ICONS[column.value] || CheckSquare;
                    const color = TRACKER_COLUMN_COLORS[column.value] || 'green';
                    const isActive = trackerForm.dashboardColumn === column.value;
                    return (
                      <button
                        className={`company-tracker__column-card company-tracker__column-card--${color} ${
                          isActive ? 'company-tracker__column-card--active' : ''
                        }`}
                        disabled={isTrackerLoading || isTrackerSaving}
                        key={column.value}
                        onClick={() =>
                          setTrackerForm((current) => ({
                            ...current,
                            dashboardColumn: column.value,
                          }))
                        }
                        type="button"
                      >
                        <div className={`company-tracker__column-icon company-tracker__column-icon--${color}`}>
                          <Icon size={18} />
                        </div>
                        <span className="company-tracker__column-label">{column.label}</span>
                        <small className="company-tracker__column-desc">{column.description}</small>
                      </button>
                    );
                  })}
                </div>

                <label className="company-tracker__notes-label" htmlFor="cd-tracker-notes">
                  Private notes
                </label>
                <textarea
                  className="company-tracker__notes"
                  id="cd-tracker-notes"
                  onChange={(e) =>
                    setTrackerForm((current) => ({
                      ...current,
                      personalNotes: e.target.value,
                    }))
                  }
                  placeholder="Add research notes, contacts, or follow-up ideas."
                  rows={3}
                  value={trackerForm.personalNotes}
                />

                {trackerError ? (
                  <p className="company-tracker__message company-tracker__message--error">
                    {trackerError}
                  </p>
                ) : null}
                {trackerMessage ? (
                  <p className="company-tracker__message">{trackerMessage}</p>
                ) : null}
                {isTrackerLoading ? (
                  <p className="company-tracker__loading">
                    Loading your saved dashboard state...
                  </p>
                ) : null}

                <div className="company-tracker__actions">
                  <button
                    className="company-tracker__save-btn"
                    disabled={isTrackerLoading || isTrackerSaving || !canSaveTracker}
                    onClick={handleSaveTracker}
                    type="button"
                  >
                    {savedTrackerState ? 'Save dashboard changes' : 'Save to dashboard'}
                  </button>
                  {savedTrackerState ? (
                    <button
                      className="company-tracker__remove-btn"
                      disabled={isTrackerSaving || isTrackerLoading}
                      onClick={handleRemoveTracker}
                      type="button"
                    >
                      Remove from dashboard
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <p className="cd-login-hint">
                Log in to save this company to your dashboard and keep private notes.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetail;
