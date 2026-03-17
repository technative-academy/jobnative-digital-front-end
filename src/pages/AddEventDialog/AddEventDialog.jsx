import { useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import TagInput from "../../components/TagInput/TagInput";
import { useCompanies } from "../../hooks/useCompanies.js";
import { useCreateEvent } from "../../hooks/useCreateEvent.js";
import { getAvatarTone, getCompanyMonogram } from "../../utils/colorSystem";
import "./AddEventDialog.css";

const LOCATION_OPTIONS = [
  "London", "Manchester", "Birmingham", "Leeds", "Liverpool",
  "Sheffield", "Bristol", "Newcastle upon Tyne", "Nottingham",
  "Leicester", "Cambridge", "Oxford", "Brighton", "Edinburgh",
  "Glasgow", "Cardiff", "Belfast", "Bath", "York",
  "Southampton", "Portsmouth",
];

function AddEventDialog({ open, onOpenChange }) {
  const { data: companies, isLoading, error } = useCompanies();
  const { createEvent, loading: isCreating, error: createError } = useCreateEvent();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  const sponsorOptions = useMemo(() => {
    if (!companies) return [];
    return [...companies]
      .sort((a, b) => (a?.name || "").localeCompare(b?.name || ""))
      .slice(0, 50);
  }, [companies]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setWebsite("");
    setStartDateTime("");
    setEndDateTime("");
    setSelectedTech([]);
    setSelectedSponsor(null);
    setSelectedLocation("");
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      sponsorCompanyIds: selectedSponsor ? [selectedSponsor.id] : [],
      start_time: startDateTime ? new Date(startDateTime).toISOString() : null,
      end_time: endDateTime ? new Date(endDateTime).toISOString() : null,
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
      <DialogContent className="add-ev" showCloseButton={false}>
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="add-ev__header">
            <h2 className="add-ev__title">Add Event</h2>
            <button
              type="button"
              className="add-ev__close-x"
              onClick={() => onOpenChange(false)}
            >
              <X size={16} />
            </button>
          </div>
          <p className="add-ev__subtitle">
            Submit a new tech event for the community.
          </p>

          <div className="add-ev__body">
            {/* Event Name */}
            <div className="add-ev__group">
              <label className="add-ev__label">
                Event Name <span className="add-ev__required">*</span>
              </label>
              <input
                type="text"
                className="add-ev__input"
                placeholder="e.g. Brighton React Meetup"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="add-ev__group">
              <label className="add-ev__label">
                Description <span className="add-ev__required">*</span>
              </label>
              <textarea
                className="add-ev__input add-ev__textarea"
                placeholder="What's this event about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Divider */}
            <div className="add-ev__divider">
              <span>Date &amp; Location</span>
            </div>

            {/* Start / End / Location row */}
            <div className="add-ev__row-3">
              <div className="add-ev__group">
                <label className="add-ev__label">
                  Start Date <span className="add-ev__required">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="add-ev__input"
                  value={startDateTime}
                  onChange={(e) => setStartDateTime(e.target.value)}
                />
              </div>
              <div className="add-ev__group">
                <label className="add-ev__label">End Date</label>
                <input
                  type="datetime-local"
                  className="add-ev__input"
                  value={endDateTime}
                  onChange={(e) => setEndDateTime(e.target.value)}
                />
              </div>
              <div className="add-ev__group">
                <label className="add-ev__label">
                  Location <span className="add-ev__required">*</span>
                </label>
                <select
                  className="add-ev__input add-ev__select"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  {LOCATION_OPTIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Website */}
            <div className="add-ev__group">
              <label className="add-ev__label">Event Website</label>
              <input
                type="url"
                className="add-ev__input"
                placeholder="https://..."
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            {/* Divider */}
            <div className="add-ev__divider">
              <span>Details</span>
            </div>

            {/* Tech Focus */}
            <div className="add-ev__group">
              <label className="add-ev__label">Tech Focus</label>
              <TagInput value={selectedTech} onChange={setSelectedTech} />
            </div>

            {/* Sponsor */}
            <div className="add-ev__group">
              <label className="add-ev__label">Sponsor</label>
              {selectedSponsor ? (
                <div className="add-ev__sponsor-selected">
                  <div
                    className={`add-ev__sponsor-avatar add-ev__sponsor-avatar--${getAvatarTone(selectedSponsor.name)}`}
                  >
                    {getCompanyMonogram(selectedSponsor.name)}
                  </div>
                  <span className="add-ev__sponsor-name">
                    {selectedSponsor.name}
                  </span>
                  <button
                    type="button"
                    className="add-ev__sponsor-remove"
                    onClick={() => setSelectedSponsor(null)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <select
                  className="add-ev__input add-ev__select"
                  value=""
                  onChange={(e) => {
                    const company = sponsorOptions.find(
                      (c) => c.id === Number(e.target.value)
                    );
                    if (company) setSelectedSponsor(company);
                  }}
                  disabled={isLoading}
                >
                  <option value="" disabled>
                    {isLoading ? "Loading..." : error ? "Could not load companies" : "Search for a company..."}
                  </option>
                  {sponsorOptions.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
              <p className="add-ev__hint">
                Search for a company to add as sponsor
              </p>
            </div>
          </div>

          {/* Error */}
          {(submitError || createError) && (
            <div className="add-ev__error">
              {(submitError || createError)?.message ||
                "We couldn't create this event."}
            </div>
          )}

          {/* Footer */}
          <div className="add-ev__footer">
            <button
              type="button"
              className="add-ev__btn-cancel"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="add-ev__btn-submit"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Submit for Review"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEventDialog;
