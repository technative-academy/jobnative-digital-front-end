import './EventDialog.css';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Badge from '../../components/Badge/Badge';
import { useEvent } from '../../hooks/useEvent.js';
import { getCompanyMonogram, getAvatarTone } from '../../utils/colorSystem';
import { ExternalLinkIcon } from 'lucide-react';

const formatDateTime = (value) => {
  if (!value) return 'TBD';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

function EventDialog({ open, onOpenChange, eventId }) {
  const { data, isLoading, error } = useEvent(eventId);
  const techList = data?.technologies ?? [];
  const sponsorList = data?.sponsors ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ev-dialog" showCloseButton={false}>
        {isLoading && (
          <div className="ev-dialog__loading">Loading event details…</div>
        )}
        {error && !isLoading && (
          <div className="ev-dialog__error">
            We couldn&apos;t load this event right now.
          </div>
        )}
        {!isLoading && !error && data && (
          <>
            {/* Banner */}
            <div className="ev-dialog__banner">
              <h1 className="ev-dialog__name">{data.name}</h1>
              {data.website && (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noreferrer"
                  className="ev-dialog__visit"
                >
                  <ExternalLinkIcon size={12} />
                  Visit website
                </a>
              )}
            </div>

            {/* Meta row */}
            <div className="ev-dialog__meta-row">
              <div className="ev-dialog__meta-item">
                <div className="ev-dialog__meta-label">Starts</div>
                <div className="ev-dialog__meta-value">
                  {formatDateTime(data.startTime)}
                </div>
              </div>
              {data.endTime && (
                <div className="ev-dialog__meta-item">
                  <div className="ev-dialog__meta-label">Ends</div>
                  <div className="ev-dialog__meta-value">
                    {formatDateTime(data.endTime)}
                  </div>
                </div>
              )}
              <div className="ev-dialog__meta-item">
                <div className="ev-dialog__meta-label">Location</div>
                <div className="ev-dialog__meta-value">
                  {data.location ?? 'TBD'}
                </div>
              </div>
            </div>

            {/* About */}
            <div className="ev-dialog__section">
              <h3>About the event</h3>
              <p>
                {data.description ??
                  'A detailed description will be shared closer to the event.'}
              </p>
            </div>

            {/* Tech focus */}
            <div className="ev-dialog__section">
              <h3>Tech focus</h3>
              {techList.length > 0 ? (
                <div className="ev-dialog__tags">
                  {techList.map((tech) => {
                    const label = tech?.name ?? tech;
                    return (
                      <Badge category="technology" key={label} text={label} />
                    );
                  })}
                </div>
              ) : (
                <span className="ev-dialog__empty">
                  Tech stack coming soon.
                </span>
              )}
            </div>

            {/* Sponsors */}
            <div className="ev-dialog__section">
              <h3>Sponsors</h3>
              {sponsorList.length > 0 ? (
                <div className="ev-dialog__sponsors">
                  {sponsorList.map((sponsor) => {
                    const name = sponsor?.name ?? sponsor;
                    const monogram = getCompanyMonogram(name);
                    const tone = getAvatarTone(name);
                    return (
                      <div className="ev-dialog__sponsor-card" key={name}>
                        <div
                          className={`ev-dialog__sponsor-avatar ev-dialog__sponsor-avatar--${tone}`}
                        >
                          {monogram}
                        </div>
                        <div>
                          <div className="ev-dialog__sponsor-name">{name}</div>
                          <div className="ev-dialog__sponsor-label">
                            Event sponsor
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span className="ev-dialog__empty">
                  No sponsors listed yet.
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="ev-dialog__footer">
              <DialogClose asChild>
                <Button variant="outline" className="ev-dialog__close-btn">
                  Close
                </Button>
              </DialogClose>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EventDialog;
