import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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

function Comment({ comment, isOwner, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(comment.body);
  const value = editing ? draftValue : comment.body;

  async function handleSave() {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;
    await onEdit(comment.id, trimmedValue);
    setDraftValue(trimmedValue);
    setEditing(false);
  }

  return (
    <div className="flex gap-10 p-3">
      <span>
        <div className="text-center">
          <img
            alt="Profile"
            className="h-14 w-14 rounded-full object-cover"
            src="/stock-profile-pic.jpg"
          />
          <p>{comment.user?.name ?? 'User'}</p>
        </div>
      </span>
      <span className="min-w-9/12 max-w-11/12 flex flex-col gap-1">
        <Textarea
          disabled={!editing}
          onChange={(e) => setDraftValue(e.target.value)}
          value={value}
        />
        {isOwner ? (
          <div className="flex justify-end gap-2">
            {editing ? (
              <>
                <Button onClick={handleSave} size="sm" type="button">
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setDraftValue(comment.body);
                    setEditing(false);
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setDraftValue(comment.body);
                    setEditing(true);
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => onDelete(comment.id)}
                  size="sm"
                  type="button"
                  variant="destructive"
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        ) : null}
      </span>
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
            <div className={`cd-hero__avatar`}>{initials}</div>
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
            <span className={`cd-hero__status ${pending ? 'cd-hero__status--pending' : 'cd-hero__status--approved'}`}>
              {pending ? 'Pending' : 'Approved'}
            </span>
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
            <h2 className="cd-card__title">Comments</h2>
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
                    <p className="cd-comments__empty">No comments yet.</p>
                  ) : (
                    comments.map((comment) => (
                      <Comment
                        comment={comment}
                        isOwner={comment.userId === user?.id}
                        key={comment.id}
                        onDelete={deleteComment}
                        onEdit={editComment}
                      />
                    ))
                  )}
                </div>
                <div className="cd-comments__add">
                  <label className="cd-comments__add-label" htmlFor="cd-add-comment">
                    Add Comment
                  </label>
                  <Textarea
                    id="cd-add-comment"
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type comment here"
                    value={newComment}
                  />
                  <button
                    type="button"
                    className="cd-comments__submit"
                    onClick={handleSubmitComment}
                  >
                    Submit
                  </button>
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
            <h2 className="cd-card__title">Dashboard Tracker</h2>
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
                  {DASHBOARD_COLUMNS.map((column) => (
                    <button
                      className={`company-tracker__column-button ${
                        trackerForm.dashboardColumn === column.value
                          ? 'company-tracker__column-button--active'
                          : ''
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
                      <span>{column.label}</span>
                      <small>{column.description}</small>
                    </button>
                  ))}
                </div>

                <label className="company-tracker__notes-label" htmlFor="cd-tracker-notes">
                  Private notes
                </label>
                <Textarea
                  className="company-tracker__notes"
                  id="cd-tracker-notes"
                  onChange={(e) =>
                    setTrackerForm((current) => ({
                      ...current,
                      personalNotes: e.target.value,
                    }))
                  }
                  placeholder="Add research notes, contacts, or follow-up ideas."
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
                  <Button
                    disabled={isTrackerLoading || isTrackerSaving || !canSaveTracker}
                    onClick={handleSaveTracker}
                    type="button"
                  >
                    {savedTrackerState ? 'Save dashboard changes' : 'Save to dashboard'}
                  </Button>
                  {savedTrackerState ? (
                    <Button
                      disabled={isTrackerSaving || isTrackerLoading}
                      onClick={handleRemoveTracker}
                      type="button"
                      variant="outline"
                    >
                      Remove from dashboard
                    </Button>
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
