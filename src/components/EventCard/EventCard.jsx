import { formatDate, stringArrayToString } from "../../utils";
import "./EventCard.css";

function EventCard({ event, colourClass, onClick }) {
  console.log(event)
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
      <h3 className="event-name">{event.name}</h3>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Date:</strong> {formatDate(event.startTime)}
      </p>
      {/* {event.technology ? */}
        <p>
          <strong>Technologies:</strong> {stringArrayToString(event.technologies.map(item => item.name))}
        </p> 

      <p>
          <strong>Sponsor:</strong> {event.sponsorNames}
        </p> 
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
