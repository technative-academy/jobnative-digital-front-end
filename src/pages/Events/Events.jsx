import "./Events.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import Filters from "../../components/Filters/Filters";
import EventDialog from "../EventDialog/EventDialog";
import { useEvents } from "../../hooks/useEvents";
import EventCard from "../../components/EventCard/EventCard";
import AddEventDialog from "../AddEventDialog/AddEventDialog";
import { Button } from "../../components/ui/button";

function Events() {
  const { data: events, isLoading, error } = useEvents();
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);

  const [filters, setFilters] = useState({
    location: [],
    industry: [],
    technology: [],
    role: [],
  });

  const colourClasses = [
    "card-colour-1",
    "card-colour-2",
    "card-colour-3",
    "card-colour-4",
    "card-colour-5",
  ];

  function getDeterministicColourIndex(value) {
    const strValue = String(value ?? "");
    let hash = 0;

    for (let i = 0; i < strValue.length; i += 1) {
      hash = (hash * 31 + strValue.charCodeAt(i)) % 4294967296;
    }

    return hash;
  }

  if (error) return <p>Something went wrong.</p>;

  const filteredEvents = events?.filter((event) => {
    return (
      (filters.location.length === 0 ||
        filters.location.includes(event.location)) &&
      (filters.industry.length === 0 ||
        filters.industry.includes(event.industry)) &&
      (filters.technology.length === 0 ||
        filters.technology.includes(event.technology)) 
    //     &&
    //   (filters.role.length === 0 || filters.role.includes(company.role))
    );
  });

  let lastClass = null;
  const colourAssignments = filteredEvents?.map((event, index) => {
    const baseIndex =
      getDeterministicColourIndex(event.id ?? index) % colourClasses.length;
    let selectedClass = colourClasses[baseIndex];

    if (selectedClass === lastClass && colourClasses.length > 1) {
      selectedClass = colourClasses[(baseIndex + 1) % colourClasses.length];
    }

    lastClass = selectedClass;
    return selectedClass;
  });

  return (
    <div className="home-container">
      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        eventId={selectedEventId}
      />
      <AddEventDialog
        open={addEventDialogOpen}
        onOpenChange={setAddEventDialogOpen}
        // eventId={selectedEventId}
      />
      <h1 className="hero-title">
        <span className="brand-highlight">Job</span>Native
      </h1>
      <h2 className="hero-subtitle">Tech events going on near you.</h2>
      <p className="hero-text">Find tech events going on near you.</p>

      <Filters filters={filters} setFilters={setFilters} />
      {isLoading ? (
        <p>Loading events...</p>
      ) : (
        <>
          {filteredEvents?.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <div className="event-grid">
              {filteredEvents?.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  colourClass={colourAssignments?.[index]}
                  onClick={() => {
                    setSelectedEventId(event.id);
                    setEventDialogOpen(true);
                  }}
                />
              ))}
            </div>
          )}

          <div className="add-event-link">
            <Button
              onClick={() => {
                setAddEventDialogOpen(true);
              }}
              className="btn-primary"
            >
              Add an event
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Events;
