import { useMemo, useState } from 'react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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

function buildTimeOptions() {
  const options = [];

  for (let hour = 0; hour < 24; hour += 1) {
    for (let minute = 0; minute < 60; minute += 15) {
      const value = `${pad(hour)}:${pad(minute)}`;
      const label = new Date(2000, 0, 1, hour, minute).toLocaleTimeString(
        'en-GB',
        {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        },
      );

      options.push({ value, label: label.toUpperCase() });
    }
  }

  return options;
}

function resolveEndDateTime({ endDate, endTime, startDate, startTime }) {
  if (!endDate && !endTime) {
    return null;
  }

  return combineDateAndTime(
    endDate ?? startDate,
    endTime ?? startTime ?? '18:00',
  );
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

const TIME_OPTIONS = buildTimeOptions();

function getInitialFormState(event) {
  const start = parseEventDateTime(event?.startTime);
  const end = parseEventDateTime(event?.endTime);
  const techs = (event?.technologies || event?.technologyStack || [])
    .map((item) => (typeof item === 'string' ? item : item?.name))
    .filter(Boolean);

  return {
    name: event?.name || '',
    description: event?.description || '',
    website: event?.website || '',
    selectedLocation: event?.location || '',
    selectedTech: techs,
    selectedSponsor: event?.sponsors?.[0] || null,
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time,
    fieldErrors: {},
  };
}

function EventDateTimeField({
  canClear = false,
  date,
  error,
  idPrefix,
  label,
  minDate,
  onClear,
  onDateChange,
  onTimeChange,
  required = false,
  time,
}) {
  const dateId = `${idPrefix}-date`;
  const timeId = `${idPrefix}-time`;
  const minDateValue = getDateOnlyValue(minDate);
  const selectKey = `${idPrefix}-${time || 'empty-time'}`;

  return (
    <div className="add-ev__group">
      <div className="add-ev__label-row">
        <label className="add-ev__label" htmlFor={timeId}>
          {label}
          {required ? <span className="add-ev__required">*</span> : null}
        </label>
        {canClear ? (
          <button
            type="button"
            className="add-ev__inline-clear"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onClear?.();
            }}
          >
            Clear
          </button>
        ) : null}
      </div>
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
            <PopoverContent align="start" className="add-ev__calendar-popover">
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
          <Select
            key={selectKey}
            value={time || undefined}
            onValueChange={onTimeChange}
          >
            <SelectTrigger
              id={timeId}
              className={`add-ev__time-trigger ${error ? 'add-ev__control--invalid' : ''}`}
            >
              <Clock3 size={16} />
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="add-ev__time-content">
              {TIME_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {error ? <p className="add-ev__field-error">{error}</p> : null}
    </div>
  );
}

function EventFormContent({
  event,
  isCreating,
  isEditMode,
  isLoading,
  isSubmitting,
  isUpdating,
  onOpenChange,
  sponsorOptions,
  sponsorsError,
  createEvent,
  updateEvent,
}) {
  const initialFormState = getInitialFormState(event);
  const [name, setName] = useState(initialFormState.name);
  const [description, setDescription] = useState(initialFormState.description);
  const [website, setWebsite] = useState(initialFormState.website);
  const [selectedLocation, setSelectedLocation] = useState(
    initialFormState.selectedLocation,
  );
  const [selectedTech, setSelectedTech] = useState(
    initialFormState.selectedTech,
  );
  const [selectedSponsor, setSelectedSponsor] = useState(
    initialFormState.selectedSponsor,
  );
  const [startDate, setStartDate] = useState(initialFormState.startDate);
  const [startTime, setStartTime] = useState(initialFormState.startTime);
  const [endDate, setEndDate] = useState(initialFormState.endDate);
  const [endTime, setEndTime] = useState(initialFormState.endTime);
  const [fieldErrors, setFieldErrors] = useState(initialFormState.fieldErrors);

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
    const startIso = combineDateAndTime(startDate, startTime);
    const endIso = resolveEndDateTime({
      startDate,
      startTime,
      endDate,
      endTime,
    });

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

    if (startIso && endIso && new Date(endIso) < new Date(startIso)) {
      nextErrors.end = 'End time must be after the start time.';
    }

    return nextErrors;
  }

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
      end_time: resolveEndDateTime({
        startDate,
        startTime,
        endDate,
        endTime,
      }),
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
        submitError?.message || 'Check your details and try again.',
      );
    }
  }

  return (
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
              onChange={(inputEvent) => setDescription(inputEvent.target.value)}
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
          </div>

          <div className="add-ev__schedule-grid">
            <EventDateTimeField
              idPrefix="event-start"
              label="Start"
              required
              date={startDate}
              time={startTime}
              canClear={Boolean(startDate || startTime)}
              error={fieldErrors.start}
              onClear={() => {
                setStartDate(undefined);
                setStartTime('');
                setEndDate(undefined);
                setEndTime('');
                clearFieldError('start');
                clearFieldError('end');
              }}
              onDateChange={(value) => {
                setStartDate(value);
                if (!value) {
                  setStartTime('');
                  setEndDate(undefined);
                  setEndTime('');
                }
                clearFieldError('start');
                clearFieldError('end');
              }}
              onTimeChange={(value) => {
                setStartTime(value);
                if (!value) {
                  setEndTime('');
                }
                clearFieldError('start');
                clearFieldError('end');
              }}
            />

            <EventDateTimeField
              idPrefix="event-end"
              label="End"
              date={endDate}
              time={endTime}
              minDate={startDate}
              canClear={Boolean(endDate || endTime)}
              error={fieldErrors.end}
              onClear={() => {
                setEndDate(undefined);
                setEndTime('');
                clearFieldError('end');
              }}
              onDateChange={(value) => {
                setEndDate(value);
                if (value && !endTime) {
                  setEndTime(startTime || '18:00');
                }
                clearFieldError('end');
              }}
              onTimeChange={(value) => {
                setEndTime(value);
                if (value && !endDate && startDate) {
                  setEndDate(startDate);
                }
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
              disabled={isLoading || Boolean(sponsorsError)}
            >
              <SelectTrigger
                id="event-sponsor"
                className="add-ev__select-trigger"
              >
                <SelectValue
                  placeholder={
                    isLoading
                      ? 'Loading companies...'
                      : sponsorsError
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
              Sponsors are optional. Leave this blank if the event is
              independent.
            </p>
          </div>
        </section>
      </div>

      <div className="add-ev__footer">
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
  );
}

function AddEventDialog({ open, onOpenChange, event }) {
  const isEditMode = Boolean(event);
  const { data: companies, isLoading, error } = useCompanies();
  const { createEvent, loading: isCreating } = useCreateEvent();
  const { updateEvent, loading: isUpdating } = useUpdateEvent();

  const isSubmitting = isCreating || isUpdating;

  const sponsorOptions = useMemo(() => {
    if (!companies) return [];
    return [...companies]
      .sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))
      .slice(0, 50);
  }, [companies]);

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
      {open ? (
        <DialogContent className="add-ev" showCloseButton={false}>
          <EventFormContent
            key={event?.id ?? 'new-event'}
            event={event}
            isCreating={isCreating}
            isEditMode={isEditMode}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            isUpdating={isUpdating}
            onOpenChange={onOpenChange}
            sponsorOptions={sponsorOptions}
            sponsorsError={error}
            createEvent={createEvent}
            updateEvent={updateEvent}
          />
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

export default AddEventDialog;
