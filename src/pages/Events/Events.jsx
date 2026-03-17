import './Events.css';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Filters from '../../components/Filters/Filters';
import EventDialog from '../EventDialog/EventDialog';
import { useEvents } from '../../hooks/useEvents';
import { isPendingEvent } from '../../lib/eventData';
import EventCard from '../../components/EventCard/EventCard';
import EventCardSkeleton from '../../components/EventCard/EventCardSkeleton';
import AddEventDialog from '../AddEventDialog/AddEventDialog';

function Events() {
  const { data: events, isLoading, error } = useEvents();
  const { isAuthenticated } = useAuth();
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);

  const [filters, setFilters] = useState({
    location: [],
    industry: [],
    technology: [],
    role: [],
  });

  if (error) return <p className="events-status">Something went wrong.</p>;

  const filteredEvents = events?.filter((event) => {
    return (
      (filters.location.length === 0 ||
        filters.location.includes(event.location)) &&
      (filters.industry.length === 0 ||
        filters.industry.includes(event.industry)) &&
      (filters.technology.length === 0 ||
        event.technologyList?.some((tech) => filters.technology.includes(tech)))
    );
  });

  const upcomingCount =
    events?.filter((e) => {
      if (!e?.startTime) return false;
      return new Date(e.startTime) >= new Date();
    }).length ?? 0;

  return (
    <div className="events-page page-transition">
      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        eventId={selectedEventId}
      />
      <AddEventDialog
        open={addEventDialogOpen}
        onOpenChange={setAddEventDialogOpen}
      />

      <div className="events-hero">
        <div className="events-hero__brand">
          <span className="events-hero__brand--primary">Job</span>
          <span className="events-hero__brand--dark">Native</span>
        </div>
        <h1 className="events-hero__title">Tech events near you</h1>
        <p className="events-hero__subtitle">
          Find tech events going on near you.
        </p>
        {upcomingCount > 0 && (
          <span className="events-hero__badge">
            {upcomingCount} upcoming event{upcomingCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="filter-bar">
          <div
            className="skeleton"
            style={{ height: 44, width: 340, borderRadius: 12 }}
          />
        </div>
      ) : (
        <Filters
          filters={filters}
          setFilters={setFilters}
          addButton={
            isAuthenticated && (
              <button
                className="events-add-btn"
                onClick={() => setAddEventDialogOpen(true)}
                type="button"
              >
                + Add Event
              </button>
            )
          }
        />
      )}

      {isLoading ? (
        <div className="events-card-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents?.length === 0 ? (
        <p className="events-empty">No events match the current filters.</p>
      ) : (
        <div className="events-card-grid">
          {filteredEvents?.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={
                isPendingEvent(event)
                  ? undefined
                  : () => {
                      setSelectedEventId(event.id);
                      setEventDialogOpen(true);
                    }
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
