import { Button } from "@/components/ui/button";
import "./EventDialog.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Tag from "../../components/Tag/Tag";
import { useEvent } from "../../hooks/useEvent.js";
import { ArrowUpRightIcon } from "lucide-react";

const formatDateTime = (value) => {
  if (!value) return "TBD";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const renderTagList = (items, category, fallback) => {
  if (!items || items.length === 0) {
    return <span className="event-dialog__empty">{fallback}</span>;
  }

  return items.map((item) => {
    const label = item?.name ?? item?.title ?? item;
    return <Tag category={category} key={`${category}-${label}`} text={label} />;
  });
};

function EventDialog({ open, onOpenChange, eventId }) {
  const { data, isLoading, error } = useEvent(eventId);
  const techList = data?.technologies ?? [];
  const sponsorList = data?.sponsors ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="event-dialog">
        <DialogHeader className="event-dialog__header">
          <div className="event-dialog__title-block">
            <DialogTitle className="event-dialog__title">
              {data?.name ?? "Event details"}
            </DialogTitle>
            {/* <p className="event-dialog__subtitle">
              {data?.status ? `Status: ${data.status}` : "Live event"}
            </p> */}
          </div>
          {data?.website && (
            <Button
              variant="secondary"
              asChild
              className="event-dialog__website"
              size="sm"
            >
              <a href={data.website} target="_blank" rel="noreferrer">
                Visit website <ArrowUpRightIcon className="event-dialog__icon" />
              </a>
            </Button>
          )}
        </DialogHeader>

        {isLoading && (
          <div className="event-dialog__state">Loading event details…</div>
        )}
        {error && !isLoading && (
          <div className="event-dialog__state event-dialog__state--error">
            We couldn&apos;t load this event right now.
          </div>
        )}
        {!isLoading && !error && (
          <div className="event-dialog__body">
            <div className="event-dialog__meta">
              <div className="event-dialog__meta-item">
                <span className="event-dialog__meta-label">Starts</span>
                <span className="event-dialog__meta-value">
                  {formatDateTime(data?.startTime)}
                </span>
              </div>
              {data?.endTime ?
                <div className="event-dialog__meta-item">
                    <span className="event-dialog__meta-label">Ends</span>
                    <span className="event-dialog__meta-value">
                    {formatDateTime(data?.endTime)}
                    </span>
              </div> : <></>
                }
              <div className="event-dialog__meta-item">
                <span className="event-dialog__meta-label">Location</span>
                <span className="event-dialog__meta-value">
                  {data?.location ?? "TBD"}
                </span>
              </div>
            </div>

            <section className="event-dialog__section">
              <h3>About the event</h3>
              <p className="event-dialog__description">
                {data?.description ??
                  "A detailed description will be shared closer to the event."}
              </p>
            </section>

            <section className="event-dialog__section">
              <h3>Tech focus</h3>
              <div className="event-dialog__tags">
                {renderTagList(techList, "technology", "Tech stack coming soon.")}
              </div>
            </section>

            <section className="event-dialog__section">
              <h3>Sponsors</h3>
              <div className="event-dialog__tags">
                {renderTagList(sponsorList, "sponsor", "No sponsors listed yet.")}
              </div>
            </section>
          </div>
        )}

        <DialogFooter className="event-dialog__footer">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EventDialog;
