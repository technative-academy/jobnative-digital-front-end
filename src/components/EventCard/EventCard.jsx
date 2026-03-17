import { MapPin, Pencil, Trash2 } from 'lucide-react';
import Badge from '../Badge/Badge';
import { isPendingEvent } from '../../lib/eventData';
import './EventCard.css';

function getTechnologyLabels(event) {
  if (Array.isArray(event?.technologies) && event.technologies.length > 0) {
    return event.technologies.map((item) => item?.name ?? item).filter(Boolean);
  }

  if (
    Array.isArray(event?.technologyStack) &&
    event.technologyStack.length > 0
  ) {
    return event.technologyStack
      .map((item) => item?.name ?? item)
      .filter(Boolean);
  }

  if (typeof event?.technology === 'string' && event.technology.trim() !== '') {
    return event.technology
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getSponsorLabel(event) {
  if (Array.isArray(event?.sponsors) && event.sponsors.length > 0) {
    return event.sponsors.map((sponsor) => sponsor?.name ?? sponsor).join(', ');
  }

  if (Array.isArray(event?.sponsorNames) && event.sponsorNames.length > 0) {
    return event.sponsorNames.join(', ');
  }

  return event?.sponsorNames || '';
}

function isUpcoming(startTime) {
  if (!startTime) return false;
  const start = new Date(startTime);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  return startDay.getTime() === today.getTime();
}

function formatDateStrip(startTime) {
  if (!startTime) return { day: '?', monthYear: 'Date TBC', time: '' };
  const d = new Date(startTime);
  const day = d.getDate();
  const monthYear = d.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
  const time = d
    .toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    .toUpperCase();
  return { day, monthYear, time };
}

function EventCard({ event, onClick, onEdit, onDelete }) {
  const pending = isPendingEvent(event);
  const technologies = getTechnologyLabels(event);
  const sponsorLabel = getSponsorLabel(event);
  const upcoming = isUpcoming(event?.startTime);
  const { day, monthYear, time } = formatDateStrip(event?.startTime);

  return (
    <div
      className="event-card"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
    >
      <div
        className={`event-card__date-strip ${upcoming ? 'event-card__date-strip--upcoming' : ''}`}
      >
        <span className="event-card__day">{day}</span>
        <div className="event-card__month-time">
          {monthYear}
          {time && <br />}
          {time}
        </div>
        {pending && (
          <Badge
            className="event-card__status"
            colour="rgba(217, 119, 6, 0.12)"
            text="Pending review"
            textColour="#b45309"
          />
        )}
      </div>

      <div className="event-card__body">
        <div className="event-card__header">
          <h3 className="event-card__title">{event.name}</h3>
          {(onEdit || onDelete) && (
            <div className="event-card__actions">
              {onEdit && (
                <button
                  type="button"
                  className="event-card__action-btn"
                  title="Edit event"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(event);
                  }}
                >
                  <Pencil size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="event-card__action-btn event-card__action-btn--delete"
                  title="Delete event"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(event);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="event-card__meta">
          <div className="event-card__meta-row">
            <MapPin className="event-card__icon" size={15} strokeWidth={2} />
            <span className="event-card__value">
              {event.location || 'Location TBC'}
            </span>
          </div>
        </div>

        {technologies.length > 0 && (
          <div className="event-card__tags">
            {technologies.map((technology) => (
              <Badge
                category="technology"
                key={`${event.id}-${technology}`}
                text={technology}
              />
            ))}
          </div>
        )}

        {sponsorLabel && (
          <p className="event-card__sponsor">
            Sponsored by <strong>{sponsorLabel}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default EventCard;
