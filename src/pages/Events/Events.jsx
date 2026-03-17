import './Events.css';
import { useState } from 'react';
import { Trash2 } from 'lucide-react';
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
import { useAuth } from '../../hooks/useAuth';
import { useDeleteEvent } from '../../hooks/useDeleteEvent';
import Filters from '../../components/Filters/Filters';
import EventDialog from '../EventDialog/EventDialog';
import { useEvents } from '../../hooks/useEvents';
import { isPendingEvent } from '../../lib/eventData';
import EventCard from '../../components/EventCard/EventCard';
import EventCardSkeleton from '../../components/EventCard/EventCardSkeleton';
import AddEventDialog from '../AddEventDialog/AddEventDialog';

const successToastStyle = {
  background: '#f7f5ff',
  border: '1px solid #ddd2ff',
  color: '#221b3c',
};

const errorToastStyle = {
  background: '#fff5f5',
  border: '1px solid #fecaca',
  color: '#7f1d1d',
};

function showMutationSuccess(title, description) {
  toast.success(title, {
    description,
    style: successToastStyle,
  });
}

function showMutationError(title, description) {
  toast.error(title, {
    description,
    style: errorToastStyle,
  });
}

function Events() {
  const { data: events, isLoading, error } = useEvents();
  const { isAuthenticated, user } = useAuth();
  const { deleteEvent } = useDeleteEvent();
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [addEventDialogOpen, setAddEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventPendingDelete, setEventPendingDelete] = useState(null);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);

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

  const totalCount = filteredEvents?.length ?? 0;

  async function handleDeleteEvent() {
    if (!eventPendingDelete) {
      return;
    }

    try {
      setIsDeletingEvent(true);
      await deleteEvent(eventPendingDelete.id);
      showMutationSuccess(
        'Event deleted',
        `${eventPendingDelete.name} has been removed.`,
      );
      setEventPendingDelete(null);
    } catch (deleteError) {
      showMutationError(
        'Could not delete event',
        deleteError?.message || 'Please try again.',
      );
    } finally {
      setIsDeletingEvent(false);
    }
  }

  return (
    <div className="events-page page-transition">
      <EventDialog
        open={eventDialogOpen}
        onOpenChange={setEventDialogOpen}
        eventId={selectedEventId}
      />

      <AddEventDialog
        open={addEventDialogOpen}
        onOpenChange={(open) => {
          setAddEventDialogOpen(open);
          if (!open) setEditingEvent(null);
        }}
        event={editingEvent}
      />

      <AlertDialog
        open={Boolean(eventPendingDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeletingEvent) {
            setEventPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent className="border-[#e8e2ff] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-[#fff3f2] text-[#dc2626]">
              <Trash2 className="size-7" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              {eventPendingDelete
                ? `${eventPendingDelete.name} will be removed from the events list. This action cannot be undone.`
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingEvent}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeletingEvent}
              className="bg-[#dc2626] hover:bg-[#b91c1c] focus-visible:ring-[#fecaca]"
              onClick={async (event) => {
                event.preventDefault();
                await handleDeleteEvent();
              }}
            >
              {isDeletingEvent ? 'Deleting...' : 'Delete event'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="events-hero">
        <div className="events-hero__brand">
          <span className="events-hero__brand--primary">Job</span>
          <span className="events-hero__brand--dark">Native</span>
        </div>
        <h1 className="events-hero__title">Tech events near you</h1>
        <p className="events-hero__subtitle">
          Find tech events going on near you.
        </p>
        {totalCount > 0 && (
          <span className="events-hero__badge">
            {totalCount} event{totalCount !== 1 ? 's' : ''}
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
          {filteredEvents?.map((event) => {
            const canManage =
              user &&
              (user.id === event.createdByUserId || user.role === 'admin');

            return (
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
                onEdit={
                  canManage
                    ? () => {
                        setEditingEvent(event);
                        setAddEventDialogOpen(true);
                      }
                    : undefined
                }
                onDelete={
                  canManage
                    ? () => {
                        setEventPendingDelete(event);
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Events;
