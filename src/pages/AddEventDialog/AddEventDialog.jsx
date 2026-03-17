import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays, Clock3, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import TagInput from '../../components/TagInput/TagInput';
import { useCompanies } from '../../hooks/useCompanies.js';
import { useCreateEvent } from '../../hooks/useCreateEvent.js';
import { useUpdateEvent } from '../../hooks/useUpdateEvent.js';
import { getAvatarTone, getCompanyMonogram } from '../../utils/colorSystem';
import './AddEventDialog.css';

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

function pad(value) {
  return String(value).padStart(2, '0');
}

function parseEventDateTime(isoValue) {
  if (!isoValue) {
    return { date: undefined, time: '' };
  }

  const value = new Date(isoValue);
  if (Number.isNaN(value.getTime())) {
    return { date: undefined, time: '' };
  }

  return {
    date: value,
    time: `${pad(value.getHours())}:${pad(value.getMinutes())}`,
  };
}

function combineDateAndTime(date, time) {
  if (!date || !time) {
    return null;
  }

  const [hours, minutes] = time.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const nextDate = new Date(date);
  nextDate.setHours(hours, minutes, 0, 0);
  return nextDate.toISOString();
}

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

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

function getDateOnlyValue(date) {
  if (!date) {
    return null;
  }

  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function EventDateTimeField({
  date,
  error,
  idPrefix,
  label,
  minDate,
  onDateChange,
  onTimeChange,
  required = false,
  time,
}) {
  const dateId = `${idPrefix}-date`;
  const timeId = `${idPrefix}-time`;
  const minDateValue = getDateOnlyValue(minDate);

  return (
    <div className="add-ev__group">
      <label className="add-ev__label" htmlFor={timeId}>
        {label}
        {required ? <span className="add-ev__required">*</span> : null}
      </label>
      <div className="add-ev__date-time-row">
        <div className="add-ev__control-group">
          <span className="add-ev__sub-label">Date</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                id={dateId}
                variant="outline"
                className={`add-ev__date-trigger ${error ? 'add-ev__control--invalid' : ''}`}
              >
                <CalendarDays size={16} />
                <span>
                  {date ? format(date, 'EEE, d MMM yyyy') : 'Pick a date'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="add-ev__calendar-popover"
            >
              <Calendar
                mode="single"
                selected={date}
                defaultMonth={date ?? minDate ?? new Date()}
                onSelect={onDateChange}
                disabled={
                  minDateValue
                    ? (candidate) => candidate < minDateValue
                    : undefined
                }
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="add-ev__control-group">
          <label className="add-ev__sub-label" htmlFor={timeId}>
            Time
          </label>
          <div
            className={`add-ev__time-wrap ${error ? 'add-ev__control--invalid' : ''}`}
          >
            <Clock3 size={16} />
            <Input
              id={timeId}
              type="time"
              step="60"
              value={time}
              onChange={(event) => onTimeChange(event.target.value)}
              className="add-ev__time-input"
            />
          </div>
        </div>
      </div>
      {error ? <p className="add-ev__field-error">{error}</p> : null}
    </div>
  );
}

function AddEventDialog({ open, onOpenChange, event }) {
  const isEditMode = Boolean(event);
  const { data: companies, isLoading, error } = useCompanies();
  const {
    createEvent,
    loading: isCreating,
  } = useCreateEvent();
  const {
    updateEvent,
    loading: isUpdating,
  } = useUpdateEvent();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [startDate, setStartDate] = useState(undefined);
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState(undefined);
  const [endTime, setEndTime] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const isSubmitting = isCreating || isUpdating;

  const sponsorOptions = useMemo(() => {
    if (!companies) return [];
    return [...companies]
      .sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))
      .slice(0, 50);
  }, [companies]);

  function resetForm() {
    setName('');
    setDescription('');
    setWebsite('');
    setSelectedLocation('');
    setSelectedTech([]);
    setSelectedSponsor(null);
    setStartDate(undefined);
    setStartTime('');
    setEndDate(undefined);
    setEndTime('');
    setFieldErrors({});
  }

  function clearFieldError(fieldName) {
    setFieldErrors((current) => {
      if (!current[fieldName]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[fieldName];
      return nextErrors;
    });
  }

  function validateForm() {
    const nextErrors = {};
    const trimmedName = name.trim();
    const trimmedWebsite = website.trim();
    const hasEndInput = Boolean(endDate || endTime);
    const startIso = combineDateAndTime(startDate, startTime);
    const endIso = hasEndInput ? combineDateAndTime(endDate, endTime) : null;

    if (!trimmedName) {
      nextErrors.name = 'Add an event name.';
    }

    if (!trimmedWebsite) {
      nextErrors.website = 'Add the event website.';
    } else if (!isValidHttpUrl(trimmedWebsite)) {
      nextErrors.website = 'Use a valid http or https URL.';
    }

    if (!startIso) {
      nextErrors.start = 'Choose a start date and time.';
    }

    if (hasEndInput && !endIso) {
      nextErrors.end = 'Add both an end date and time, or leave both blank.';
    }

    if (startIso && endIso && new Date(endIso) < new Date(startIso)) {
      nextErrors.end = 'End time must be after the start time.';
    }

    return nextErrors;
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!event) {
      resetForm();
      return;
    }

    const start = parseEventDateTime(event.startTime);
    const end = parseEventDateTime(event.endTime);
    const techs = (event.technologies || event.technologyStack || [])
      .map((item) => (typeof item === 'string' ? item : item?.name))
      .filter(Boolean);

    setName(event.name || '');
    setDescription(event.description || '');
    setWebsite(event.website || '');
    setSelectedLocation(event.location || '');
    setSelectedTech(techs);
    setSelectedSponsor(event.sponsors?.[0] || null);
    setStartDate(start.date);
    setStartTime(start.time);
    setEndDate(end.date);
    setEndTime(end.time);
    setFieldErrors({});
  }, [open, event]);

  async function handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      website: website.trim(),
      location: selectedLocation.trim() || null,
      technologyStack: selectedTech,
      sponsorCompanyIds: selectedSponsor ? [selectedSponsor.id] : [],
      start_time: combineDateAndTime(startDate, startTime),
      end_time:
        endDate || endTime ? combineDateAndTime(endDate, endTime) : null,
    };

    try {
      if (isEditMode) {
        await updateEvent({ id: event.id, payload });
        showMutationSuccess('Event updated', `${payload.name} has been saved.`);
      } else {
        await createEvent(payload);
        showMutationSuccess(
          'Event submitted',
          `${payload.name} is now awaiting review.`,
        );
      }

      resetForm();
      onOpenChange(false);
    } catch (submitError) {
      showMutationError(
        isEditMode ? 'Could not update event' : 'Could not create event',
        submitError?.message ||
          'Check your details and try again.',
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting) {
          return;
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="add-ev" showCloseButton={false}>
        <form onSubmit={handleSubmit} className="add-ev__form">
          <div className="add-ev__header">
            <div className="add-ev__header-copy">
              <span className="add-ev__eyebrow">
                {isEditMode ? 'Edit community event' : 'Add community event'}
              </span>
              <DialogTitle className="add-ev__title">
                {isEditMode ? 'Update event details' : 'Share a new event'}
              </DialogTitle>
              <DialogDescription className="add-ev__subtitle">
                {isEditMode
                  ? 'Keep the published details tidy and up to date.'
                  : 'Add the essentials first so people can decide at a glance whether to attend.'}
              </DialogDescription>
            </div>
            <button
              type="button"
              className="add-ev__close-x"
              onClick={() => {
                if (!isSubmitting) {
                  onOpenChange(false);
                }
              }}
              disabled={isSubmitting}
              aria-label="Close event form"
            >
              <X size={16} />
            </button>
          </div>

          <div className="add-ev__body">
            <section className="add-ev__section">
              <div className="add-ev__section-head">
                <h3 className="add-ev__section-title">Event details</h3>
                <p className="add-ev__section-copy">
                  Start with the public-facing summary.
                </p>
              </div>

              <div className="add-ev__group">
                <label className="add-ev__label" htmlFor="event-name">
                  Event name <span className="add-ev__required">*</span>
                </label>
                <Input
                  id="event-name"
                  value={name}
                  onChange={(inputEvent) => {
                    setName(inputEvent.target.value);
                    clearFieldError('name');
                  }}
                  className={fieldErrors.name ? 'add-ev__control--invalid' : ''}
                  placeholder="Brighton React Meetup"
                />
                {fieldErrors.name ? (
                  <p className="add-ev__field-error">{fieldErrors.name}</p>
                ) : null}
              </div>

              <div className="add-ev__group">
                <label className="add-ev__label" htmlFor="event-description">
                  Description
                </label>
                <Textarea
                  id="event-description"
                  value={description}
                  onChange={(inputEvent) =>
                    setDescription(inputEvent.target.value)
                  }
                  className="add-ev__textarea"
                  placeholder="What is happening, who it is for, and why it is worth showing up for."
                />
              </div>

              <div className="add-ev__group">
                <label className="add-ev__label" htmlFor="event-website">
                  Event website <span className="add-ev__required">*</span>
                </label>
                <Input
                  id="event-website"
                  type="url"
                  value={website}
                  onChange={(inputEvent) => {
                    setWebsite(inputEvent.target.value);
                    clearFieldError('website');
                  }}
                  className={fieldErrors.website ? 'add-ev__control--invalid' : ''}
                  placeholder="https://..."
                />
                {fieldErrors.website ? (
                  <p className="add-ev__field-error">{fieldErrors.website}</p>
                ) : (
                  <p className="add-ev__hint">
                    Use the registration page, meetup link, or event site.
                  </p>
                )}
              </div>
            </section>

            <section className="add-ev__section">
              <div className="add-ev__section-head">
                <h3 className="add-ev__section-title">Schedule</h3>
                <p className="add-ev__section-copy">
                  Start and end controls stay compact on desktop and stack on smaller screens.
                </p>
              </div>

              <div className="add-ev__schedule-grid">
                <EventDateTimeField
                  idPrefix="event-start"
                  label="Start"
                  required
                  date={startDate}
                  time={startTime}
                  error={fieldErrors.start}
                  onDateChange={(value) => {
                    setStartDate(value);
                    clearFieldError('start');
                  }}
                  onTimeChange={(value) => {
                    setStartTime(value);
                    clearFieldError('start');
                  }}
                />

                <EventDateTimeField
                  idPrefix="event-end"
                  label="End"
                  date={endDate}
                  time={endTime}
                  minDate={startDate}
                  error={fieldErrors.end}
                  onDateChange={(value) => {
                    setEndDate(value);
                    clearFieldError('end');
                  }}
                  onTimeChange={(value) => {
                    setEndTime(value);
                    clearFieldError('end');
                  }}
                />
              </div>

              <div className="add-ev__group">
                <label className="add-ev__label" htmlFor="event-location">
                  Location
                </label>
                <Input
                  id="event-location"
                  value={selectedLocation}
                  onChange={(inputEvent) =>
                    setSelectedLocation(inputEvent.target.value)
                  }
                  placeholder="Brighton, Bristol, Online, or a full venue name"
                />
                <p className="add-ev__hint">
                  Keep this human-readable. It is shown directly on the event card.
                </p>
              </div>
            </section>

            <section className="add-ev__section">
              <div className="add-ev__section-head">
                <h3 className="add-ev__section-title">Details</h3>
                <p className="add-ev__section-copy">
                  Add the technical focus and an optional sponsor.
                </p>
              </div>

              <div className="add-ev__group">
                <label className="add-ev__label">Tech focus</label>
                <TagInput
                  value={selectedTech}
                  onChange={setSelectedTech}
                  placeholder="Add a technology and press Enter"
                />
              </div>

              <div className="add-ev__group">
                <div className="add-ev__label-row">
                  <label className="add-ev__label" htmlFor="event-sponsor">
                    Sponsor
                  </label>
                  {selectedSponsor ? (
                    <button
                      type="button"
                      className="add-ev__sponsor-clear"
                      onClick={() => setSelectedSponsor(null)}
                    >
                      Clear sponsor
                    </button>
                  ) : null}
                </div>

                {selectedSponsor ? (
                  <div className="add-ev__sponsor-selected">
                    <div
                      className={`add-ev__sponsor-avatar add-ev__sponsor-avatar--${getAvatarTone(selectedSponsor.name)}`}
                    >
                      {getCompanyMonogram(selectedSponsor.name)}
                    </div>
                    <div className="add-ev__sponsor-copy">
                      <span className="add-ev__sponsor-name">
                        {selectedSponsor.name}
                      </span>
                      <span className="add-ev__sponsor-note">
                        This company will be shown as the event sponsor.
                      </span>
                    </div>
                  </div>
                ) : null}

                <Select
                  value={selectedSponsor ? String(selectedSponsor.id) : undefined}
                  onValueChange={(value) => {
                    const company = sponsorOptions.find(
                      (option) => String(option.id) === value,
                    );
                    setSelectedSponsor(company ?? null);
                  }}
                  disabled={isLoading || Boolean(error)}
                >
                  <SelectTrigger id="event-sponsor" className="add-ev__select-trigger">
                    <SelectValue
                      placeholder={
                        isLoading
                          ? 'Loading companies...'
                          : error
                            ? 'Could not load companies'
                            : 'Choose a sponsor'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="add-ev__select-content">
                    {sponsorOptions.map((company) => (
                      <SelectItem key={company.id} value={String(company.id)}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="add-ev__hint">
                  Sponsors are optional. Leave this blank if the event is independent.
                </p>
              </div>
            </section>
          </div>

          <div className="add-ev__footer">
            <p className="add-ev__footer-note">
              Events without an end time will be shown with just the start time.
            </p>
            <div className="add-ev__footer-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="add-ev__submit-btn"
              >
                {isEditMode
                  ? isUpdating
                    ? 'Saving changes...'
                    : 'Save changes'
                  : isCreating
                    ? 'Submitting...'
                    : 'Submit for review'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEventDialog;
