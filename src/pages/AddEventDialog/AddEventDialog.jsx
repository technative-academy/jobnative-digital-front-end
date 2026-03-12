import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import "./AddEventDialog.css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePicker } from "../../components/DatePicker/DatePicker.jsx";
import { Field } from "../../components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCompanies } from "../../hooks/useCompanies.js";
import { useCreateEvent } from "../../hooks/useCreateEvent.js";


const buildDateTime = (date, time) => {
  if (!date) return null;
  const [hours, minutes, seconds] = (time || "00:00:00").split(":");
  const combined = new Date(date);
  combined.setHours(Number(hours || 0), Number(minutes || 0), Number(seconds || 0), 0);
  return combined.toISOString();
};

const TECHNOLOGY_OPTIONS = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "Java",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Terraform",
  "GraphQL",
  "CI/CD",
  "CSS",
  "HTML",
  "AI",
  "React Native",
  "Rust",
  "Cybersecurity",
];

const LOCATION_OPTIONS = [
  "London",
  "Manchester",
  "Birmingham",
  "Leeds",
  "Liverpool",
  "Sheffield",
  "Bristol",
  "Newcastle upon Tyne",
  "Nottingham",
  "Leicester",
  "Cambridge",
  "Oxford",
  "Brighton",
  "Edinburgh",
  "Glasgow",
  "Cardiff",
  "Belfast",
  "Bath",
  "York",
  "Southampton",
  "Portsmouth",
];
function AddEventDialog({ open, onOpenChange }) {
  // const { data, isLoading, error } = useEvent(eventId);
  const { data: companies, isLoading, error } = useCompanies();
  const { createEvent, loading: isCreating, error: createError } = useCreateEvent();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [startDate, setStartDate] = useState(undefined);
  const [startTime, setStartTime] = useState("10:30:00");
  const [endDate, setEndDate] = useState(undefined);
  const [endTime, setEndTime] = useState("10:30:00");
  const [submitError, setSubmitError] = useState(null);
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedSponsors, setSelectedSponsors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const sponsorOptions = useMemo(() => {
    if (!companies) return [];
    return [...companies]
      .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
      .slice(0, 50);
  }, [companies]);

  const toggleTech = (value) => {
    setSelectedTech((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSponsors = (value) => {
    setSelectedSponsors((prev) => {
      const exists = prev.some((item) => item.id === value.id);
      return exists ? prev.filter((item) => item.id !== value.id) : [...prev, value];
    });
  };

  const toggleLocation = (value) => {
    setSelectedLocation((prev) => (prev === value ? "" : value));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setWebsite("");
    setStartDate(undefined);
    setStartTime("10:30:00");
    setEndDate(undefined);
    setEndTime("10:30:00");
    setSelectedTech([]);
    setSelectedSponsors([]);
  setSelectedLocation("");
    setSubmitError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    if (!name.trim()) {
      setSubmitError(new Error("Event name is required."));
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      website: website.trim(),
  location: selectedLocation || null,
      technologyStack: selectedTech,
      sponsorCompanyIds: selectedSponsors.map((company) => (company.id)),
      start_time: buildDateTime(startDate, startTime),
      end_time: buildDateTime(endDate, endTime)
    };

    try {
      await createEvent(payload);
      resetForm();
      onOpenChange(false);
    } catch (err) {
      setSubmitError(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="event-dialog">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="event-dialog__header">
            <div className="event-dialog__title-block">
              <DialogTitle className="event-dialog__title">
                Add Event
              </DialogTitle>
            </div>
          </DialogHeader>

        <div className="event-dialog__body">
          <div className="event-dialog__meta-item">
            <Field>
              <span className="event-dialog__meta-label">Event Name</span>
              <Input
                id="input-field-name"
                type="text"
                placeholder="Enter event name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>
          </div>

            <div className="event-dialog__meta">
              <div className="event-dialog__meta-item event-dialog__meta-item--picker">
                <span className="event-dialog__meta-label">Starts</span>
                <DatePicker
                  idPrefix="event-start"
                  date={startDate}
                  time={startTime}
                  onChange={({ date, time }) => {
                    setStartDate(date);
                    setStartTime(time);
                  }}
                />
              </div>

              <div className="event-dialog__meta-item event-dialog__meta-item--picker">
                <span className="event-dialog__meta-label">Ends</span>
                <DatePicker
                  idPrefix="event-end"
                  date={endDate}
                  time={endTime}
                  onChange={({ date, time }) => {
                    setEndDate(date);
                    setEndTime(time);
                  }}
                />
              </div>
            </div>

            <section className="event-dialog__section">
              <span className="event-dialog__meta-label">Website</span>
              <Input
                className="mt-2"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
              />
            </section>

            <section className="event-dialog__section">
              <span className="event-dialog__meta-label">Event Description</span>
              <Textarea
                className="mt-2 h-25"
                placeholder="Enter a description for this event"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </section>

            <section className="event-dialog__section">
              <span className="event-dialog__meta-label">Technologies</span>
              <div className="event-dialog__checkboxes">
                {TECHNOLOGY_OPTIONS.map((tech) => (
                  <label key={tech} className="event-dialog__checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTech.includes(tech)}
                      onChange={() => toggleTech(tech)}
                    />
                    <span>{tech}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="event-dialog__section">
              <span className="event-dialog__meta-label">Location</span>
              <div className="event-dialog__checkboxes">
                {LOCATION_OPTIONS.map((location) => (
                  <label key={location} className="event-dialog__checkbox">
                    <input
                      type="radio"
                      name="event-location"
                      checked={selectedLocation === location}
                      onChange={() => toggleLocation(location)}
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="event-dialog__section">
              <span className="event-dialog__meta-label">Sponsors</span>
              {isLoading && (
                <div className="event-dialog__state">Loading sponsors…</div>
              )}
              {error && !isLoading && (
                <div className="event-dialog__state event-dialog__state--error">
                  We couldn&apos;t load sponsors right now.
                </div>
              )}
              {!isLoading && !error && (
                <div className="event-dialog__checkboxes">
                  {sponsorOptions.map((company) => (
                    <label key={company.id} className="event-dialog__checkbox">
                      <input
                        type="checkbox"
                        checked={selectedSponsors.some(
                          (item) => item.id === company.id,
                        )}
                        onChange={() => toggleSponsors(company)}
                      />
                      <span>{company.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </section>
          </div>

          {(submitError || createError) && (
            <div className="event-dialog__state event-dialog__state--error">
              {(submitError || createError)?.message || "We couldn’t create this event."}
            </div>
          )}

          <DialogFooter className="event-dialog__footer">
            <DialogClose asChild>
              <Button variant="outline" type="button">Close</Button>
            </DialogClose>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating…" : "Create Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEventDialog;
