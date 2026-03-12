import React, { useState } from "react";
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
import Tag from "../../components/Tag/Tag";
import { useEvent } from "../../hooks/useEvent.js";
import { getRandomColor } from "../../utils.js";
import { ArrowUpRightIcon } from "lucide-react";
import { DatePicker } from "../../components/DatePicker/DatePicker.jsx";
import { Field, FieldLabel } from "../../components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCompanies } from "../../hooks/useCompanies.js";


const formatDateTime = (value) => {
  if (!value) return "TBD";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const renderTagList = (items, fallback) => {
  if (!items || items.length === 0) {
    return <span className="event-dialog__empty">{fallback}</span>;
  }
  return items.map((item) => {
    const label = item?.name ?? item?.title ?? item;
    return <Tag key={label} text={label} colour={getRandomColor()} />;
  });
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
function AddEventDialog({ open, onOpenChange }) {
  // const { data, isLoading, error } = useEvent(eventId);
  const {data: companies, isLoading, error } = useCompanies();
  console.log(companies?.companies)
  const data = {};
  const sponsorList = data?.sponsors ?? [];
  const [selectedTech, setSelectedTech] = useState([]);
  const [selectedSponsors, setSelectedSponsors] = useState([]);

  const toggleTech = (value) => {
    setSelectedTech((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSponsors = (value) => {
    setSelectedSponsors((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="event-dialog">
        <DialogHeader className="event-dialog__header">
          <div className="event-dialog__title-block">
            <DialogTitle className="event-dialog__title">
              Add Event
            </DialogTitle>
            {/* <p className="event-dialog__subtitle">
              {data?.status ? `Status: ${data.status}` : "Live event"}
            </p> */}
          </div>
          {/* {data?.website && (
            <Button
              variant="secondary"
              asChild
              className="event-dialog__website"
              size="sm"
            >
              <a href={data.website} target="_blank" rel="noreferrer">
                Visit website <ArrowUpRightIcon className="event-dialog__icon" />
              </a>
            </Button>
          )} */}
        </DialogHeader>

        <div className="event-dialog__meta-item">
          {/* <span className="event-dialog__meta-label">Name</span>
          <span className="event-dialog__meta-value">
            {data?.location ?? "TBD"}
          </span> */}
          <Field>
      <span className="event-dialog__meta-label">Event Name</span>
      <Input
        id="input-field-name"
        type="text"
        placeholder="Enter event name"
      />
    </Field>
        </div>

          <div className="event-dialog__body">
            <div className="event-dialog__meta">
              {/* <div className="event-dialog__meta-item">
                <span className="event-dialog__meta-label">Starts</span>
                <span className="event-dialog__meta-value">
                  {formatDateTime(data?.startTime)}
                </span>
              </div> */}
              <div className="event-dialog__meta-item event-dialog__meta-item--picker">
                <span className="event-dialog__meta-label">Starts</span>
                <DatePicker />
              </div>

              <div className="event-dialog__meta-item event-dialog__meta-item--picker">
                <span className="event-dialog__meta-label">Ends</span>
                <DatePicker />
              </div>
                
              {/* {data?.endTime ?
                <div className="event-dialog__meta-item">
                    <span className="event-dialog__meta-label">Ends</span>
                    <span className="event-dialog__meta-value">
                    {formatDateTime(data?.endTime)}
                    </span>
              </div> : <></>
                } */}
            </div>

            <section className="event-dialog__section">
              <span className="event-dialog__meta-label">Event Description</span>
              <Textarea className="mt-2 h-25" placeholder="Enter a description for this event"/>
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
              <span className="event-dialog__meta-label">Sponsors</span>
              <div className="event-dialog__checkboxes">
                {companies?.companies.map((company) => (
                  <label key={company.id} className="event-dialog__checkbox">
                    <input
                      type="checkbox"
                      checked={selectedSponsors.includes(company)}
                      onChange={() => toggleSponsors(company)}
                    />
                    <span>{company.name}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

        <DialogFooter className="event-dialog__footer">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddEventDialog;
