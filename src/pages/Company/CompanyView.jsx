import { useEffect, useState } from "react";
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Tag from "../../components/Tag/Tag";
import { useCompany } from "../../hooks/useCompany";
import { useComments } from "../../hooks/useComments";
import { useAuth } from "../../hooks/useAuth";
import { userCompanyStatesService } from "../../services/userCompanyStates.service";
import {
  DASHBOARD_COLUMNS,
  DEFAULT_DASHBOARD_COLUMN,
  getDashboardColumnMeta,
  normalizeDashboardNotes,
} from "../../utils/dashboardState";
import { getRandomColor } from "../../utils.js";
import "./Company.css";

function Comment({ comment, isOwner, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(comment.body);

  useEffect(() => {
    setValue(comment.body);
    setEditing(false);
  }, [comment.body]);

  async function handleSave() {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    await onEdit(comment.id, trimmedValue);
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
          <p>{comment.user?.name ?? "User"}</p>
        </div>
      </span>
      <span className="min-w-9/12 max-w-11/12 flex flex-col gap-1">
        <Textarea
          disabled={!editing}
          onChange={(event) => setValue(event.target.value)}
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
                    setValue(comment.body);
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
                  onClick={() => setEditing(true)}
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

function CompanyView({ companyId, onOpenChange, open }) {
  const { data, error, isLoading } = useCompany(companyId);
  const { isAuthenticated, user } = useAuth();
  const {
    comments,
    addComment,
    editComment,
    deleteComment,
    error: commentsError,
    isLoading: commentsLoading,
  } = useComments(companyId, { enabled: isAuthenticated });
  const [newComment, setNewComment] = useState("");
  const [trackerForm, setTrackerForm] = useState({
    dashboardColumn: DEFAULT_DASHBOARD_COLUMN,
    personalNotes: "",
  });
  const [savedTrackerState, setSavedTrackerState] = useState(null);
  const [isTrackerLoading, setIsTrackerLoading] = useState(false);
  const [isTrackerSaving, setIsTrackerSaving] = useState(false);
  const [trackerMessage, setTrackerMessage] = useState("");
  const [trackerError, setTrackerError] = useState("");

  useEffect(() => {
    if (!companyId || !isAuthenticated) {
      setSavedTrackerState(null);
      setTrackerForm({
        dashboardColumn: DEFAULT_DASHBOARD_COLUMN,
        personalNotes: "",
      });
      setIsTrackerLoading(false);
      setIsTrackerSaving(false);
      setTrackerMessage("");
      setTrackerError("");
      return;
    }

    let isActive = true;

    async function loadTrackerState() {
      try {
        setIsTrackerLoading(true);
        setTrackerError("");
        setTrackerMessage("");

        const trackerState = await userCompanyStatesService.getByCompanyId(companyId);

        if (isActive) {
          setSavedTrackerState(trackerState);
          setTrackerForm({
            dashboardColumn:
              trackerState.dashboardColumn || DEFAULT_DASHBOARD_COLUMN,
            personalNotes: trackerState.personalNotes ?? "",
          });
        }
      } catch (requestError) {
        if (!isActive) {
          return;
        }

        if (requestError?.status === 404) {
          setSavedTrackerState(null);
          setTrackerForm({
            dashboardColumn: DEFAULT_DASHBOARD_COLUMN,
            personalNotes: "",
          });
        } else {
          setTrackerError(
            requestError.message || "Unable to load dashboard state.",
          );
        }
      } finally {
        if (isActive) {
          setIsTrackerLoading(false);
        }
      }
    }

    loadTrackerState();

    return () => {
      isActive = false;
    };
  }, [companyId, isAuthenticated]);

  if (!companyId) {
    return null;
  }

  const normalizedTrackerNotes = normalizeDashboardNotes(trackerForm.personalNotes);
  const savedNotes = savedTrackerState?.personalNotes ?? "";
  const isTrackerDirty =
    trackerForm.dashboardColumn !==
      (savedTrackerState?.dashboardColumn || DEFAULT_DASHBOARD_COLUMN) ||
    normalizedTrackerNotes !== savedNotes;
  const canSaveTracker = !savedTrackerState || isTrackerDirty;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!newComment.trim()) {
      return;
    }

    try {
      await addComment(newComment.trim());
      setNewComment("");
    } catch {
      alert("You must be logged in to add a comment.");
    }
  }

  async function handleSaveTracker() {
    try {
      setIsTrackerSaving(true);
      setTrackerError("");
      setTrackerMessage("");

      const trackerState = await userCompanyStatesService.upsert(companyId, {
        dashboardColumn: trackerForm.dashboardColumn,
        personalNotes: normalizedTrackerNotes,
      });

      setSavedTrackerState(trackerState);
      setTrackerForm({
        dashboardColumn: trackerState.dashboardColumn,
        personalNotes: trackerState.personalNotes ?? "",
      });
      setTrackerMessage(
        savedTrackerState
          ? "Dashboard entry updated."
          : "Company saved to your dashboard.",
      );
    } catch (requestError) {
      setTrackerError(requestError.message || "Unable to save dashboard state.");
    } finally {
      setIsTrackerSaving(false);
    }
  }

  async function handleRemoveTracker() {
    try {
      setIsTrackerSaving(true);
      setTrackerError("");
      setTrackerMessage("");
      await userCompanyStatesService.delete(companyId);
      setSavedTrackerState(null);
      setTrackerForm({
        dashboardColumn: DEFAULT_DASHBOARD_COLUMN,
        personalNotes: "",
      });
      setTrackerMessage("Removed from your dashboard.");
    } catch (requestError) {
      setTrackerError(
        requestError.message || "Unable to remove this dashboard entry.",
      );
    } finally {
      setIsTrackerSaving(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[90vh] min-w-11/12 overflow-y-auto">
        {isLoading ? (
          <>
            <DialogHeader>
              <DialogTitle>Loading company...</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Please wait while the company details load.
            </p>
          </>
        ) : error ? (
          <>
            <DialogHeader>
              <DialogTitle>Unable to load company</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              {error.message || "Something went wrong while loading this company."}
            </p>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between gap-4">
                <DialogTitle>{data?.name}</DialogTitle>
                <div className="text-sm capitalize text-muted-foreground">
                  Status: {data?.status}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {data?.website ? (
                  <Button
                    asChild
                    className="text-muted-foreground inline-flex h-fit w-fit items-center gap-1 leading-none transition-transform duration-150 hover:scale-110"
                    size="sm"
                    variant="link"
                  >
                    <a href={data.website} rel="noreferrer" target="_blank">
                      Website <ArrowUpRightIcon />
                    </a>
                  </Button>
                ) : null}
                {data?.linkedin ? (
                  <a
                    aria-label="LinkedIn"
                    className="card__link card__link--linkedin"
                    href={data.linkedin}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <svg
                      aria-hidden="true"
                      className="card__link-icon"
                      viewBox="0 0 640 640"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M512 96L127.9 96C110.3 96 96 110.5 96 128.3L96 511.7C96 529.5 110.3 544 127.9 544L512 544C529.6 544 544 529.5 544 511.7L544 128.3C544 110.5 529.6 96 512 96zM231.4 480L165 480L165 266.2L231.5 266.2L231.5 480L231.4 480zM198.2 160C219.5 160 236.7 177.2 236.7 198.5C236.7 219.8 219.5 237 198.2 237C176.9 237 159.7 219.8 159.7 198.5C159.7 177.2 176.9 160 198.2 160zM480.3 480L413.9 480L413.9 376C413.9 351.2 413.4 319.3 379.4 319.3C344.8 319.3 339.5 346.3 339.5 374.2L339.5 480L273.1 480L273.1 266.2L336.8 266.2L336.8 295.4L337.7 295.4C346.6 278.6 368.3 260.9 400.6 260.9C467.8 260.9 480.3 305.2 480.3 362.8L480.3 480z" />
                    </svg>
                  </a>
                ) : null}
              </div>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <div>
                  Tech:
                  {data?.technologies?.map((tech) => (
                    <Tag
                      colour={getRandomColor()}
                      key={tech.name}
                      text={tech.name}
                    />
                  ))}
                </div>
              </Field>

              <Field>
                <div>
                  Industry:
                  <Tag colour="lightpink" text={data?.industry || "Not specified"} />
                </div>
              </Field>

              <Field>
                <div>
                  Job Roles:
                  {data?.jobRoles?.map((job) => (
                    <Tag colour={getRandomColor()} key={job} text={job} />
                  ))}
                </div>
              </Field>

              <Field>
                <div>Location: {data?.location || "Not specified"}</div>
              </Field>

              <Field>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  className="max-h-60 min-h-[7.5rem]"
                  defaultValue={data?.description || "No description provided yet."}
                  disabled
                  id="description"
                />
              </Field>

              <Field>
                <Label htmlFor="tracker-notes">Dashboard Tracker</Label>
                {isAuthenticated ? (
                  <div className="company-tracker">
                    <p className="company-tracker__intro">
                      Save this company to your dashboard, choose which column it
                      belongs in, and keep private notes for your own job search.
                    </p>

                    {savedTrackerState ? (
                      <p className="company-tracker__saved-state">
                        Currently in{" "}
                        <strong>
                          {getDashboardColumnMeta(savedTrackerState.dashboardColumn)
                            ?.label || "To Do"}
                        </strong>
                        .
                      </p>
                    ) : null}

                    <div className="company-tracker__columns">
                      {DASHBOARD_COLUMNS.map((column) => (
                        <button
                          className={`company-tracker__column-button ${
                            trackerForm.dashboardColumn === column.value
                              ? "company-tracker__column-button--active"
                              : ""
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

                    <Label className="company-tracker__notes-label" htmlFor="tracker-notes">
                      Private notes
                    </Label>
                    <Textarea
                      className="company-tracker__notes"
                      id="tracker-notes"
                      onChange={(event) =>
                        setTrackerForm((current) => ({
                          ...current,
                          personalNotes: event.target.value,
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
                        disabled={
                          isTrackerLoading ||
                          isTrackerSaving ||
                          !canSaveTracker
                        }
                        onClick={handleSaveTracker}
                        type="button"
                      >
                        {savedTrackerState ? "Save dashboard changes" : "Save to dashboard"}
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
                  <p className="text-sm text-muted-foreground">
                    Log in to save this company to your dashboard and keep private
                    notes.
                  </p>
                )}
              </Field>

              <Field>
                <Label htmlFor="comments">Comments</Label>
                {isAuthenticated ? (
                  <>
                    <div className="max-h-40 space-y-4 overflow-y-scroll rounded-md border-2 border-muted/70 pr-3">
                      {commentsLoading ? (
                        <p className="p-3 text-sm text-muted-foreground">
                          Loading comments...
                        </p>
                      ) : commentsError ? (
                        <p className="p-3 text-sm text-muted-foreground">
                          {commentsError.message || "Unable to load comments."}
                        </p>
                      ) : comments.length === 0 ? (
                        <p className="p-3 text-sm text-muted-foreground">
                          No comments yet.
                        </p>
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

                    <div className="mt-4 flex flex-col gap-2">
                      <Label className="mb-2" htmlFor="add-comment">
                        Add Comment
                      </Label>
                      <Textarea
                        className="mb-2"
                        id="add-comment"
                        onChange={(event) => setNewComment(event.target.value)}
                        placeholder="Type comment here"
                        value={newComment}
                      />
                      <Button
                        className="self-end"
                        onClick={handleSubmit}
                        type="button"
                      >
                        Submit
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Log in to read and leave comments.
                  </p>
                )}
              </Field>
            </FieldGroup>
          </>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CompanyView;
