import { MapPin } from "lucide-react";
import Badge from "../Badge/Badge";
import { isPendingEvent } from "../../lib/eventData";
import { formatDate } from "../../utils";
import "./EventCard.css";

function getTechnologyLabels(event) {
  if (Array.isArray(event?.technologies) && event.technologies.length > 0) {
    return event.technologies
      .map((item) => item?.name ?? item)
      .filter(Boolean);
  }

  if (Array.isArray(event?.technologyStack) && event.technologyStack.length > 0) {
    return event.technologyStack
      .map((item) => item?.name ?? item)
      .filter(Boolean);
  }

  if (typeof event?.technology === "string" && event.technology.trim() !== "") {
    return event.technology
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function getSponsorLabel(event) {
  if (Array.isArray(event?.sponsors) && event.sponsors.length > 0) {
    return event.sponsors.map((sponsor) => sponsor?.name ?? sponsor).join(", ");
  }

  if (Array.isArray(event?.sponsorNames) && event.sponsorNames.length > 0) {
    return event.sponsorNames.join(", ");
  }

  return event?.sponsorNames || "";
}

function EventCard({ event, colourClass, onClick }) {
  const pending = isPendingEvent(event);
  const startLabel = event?.startTime ? formatDate(event.startTime) : "Date TBC";
  const technologies = getTechnologyLabels(event);
  const sponsorLabel = getSponsorLabel(event);

  return (
    <div
      className={`event-card ${colourClass}`}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick(event);
              }
            }
          : undefined
      }
    >
      <div className="event-card__title-row">
        <h3 className="event-name">{event.name}</h3>
        {pending ? (
          <Badge
            className="event-card__status"
            colour="rgba(217, 119, 6, 0.12)"
            text="Pending review"
            textColour="#b45309"
          />
        ) : null}
      </div>
      <div className="event-card__meta">
        <div className="event-card__meta-row">
          <MapPin className="event-card__icon" size={15} strokeWidth={2} />
          <span className="event-card__value">{event.location || "Location TBC"}</span>
        </div>
        <div className="event-card__meta-row">
          <span className="event-card__value">{startLabel}</span>
        </div>
      </div>

      {technologies.length > 0 ? (
        <div className="event-card__badges">
          {technologies.map((technology) => (
            <Badge
              category="technology"
              key={`${event.id}-${technology}`}
              text={technology}
            />
          ))}
        </div>
      ) : null}

      {sponsorLabel ? (
        <p className="event-card__sponsor">
          Sponsored by <strong>{sponsorLabel}</strong>
        </p>
      ) : null}
    </div>
  );
}

/*

approvedAt
: 
"2026-03-11T11:11:21.817Z"
approvedByUserId
: 
2
createdAt
: 
"2026-03-11T11:11:21.817Z"
createdByUserId
: 
1
description
: 
"Monthly meetup focused on modern web development and cloud infrastructure."
endTime
: 
"2026-03-25T13:11:21.817Z"
id
: 
1
location
: 
"Brighton"
name
: 
"Brighton Tech Meetup"
sponsorNames
: 
['DabApps']
sponsors
: 
[{…}]
startTime
: 
"2026-03-25T11:11:21.817Z"
status
: 
"approved"
technologies
: 
(2) [{…}, {…}]
technologyStack
: 
(2) ['aws', 'react']
website
: 
"https://brighton-tech-meetup.example.com"

*/
export default EventCard;
