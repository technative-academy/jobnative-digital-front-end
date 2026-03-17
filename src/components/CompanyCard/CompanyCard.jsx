import { MapPin, Monitor } from "lucide-react";
import Badge from "../Badge/Badge";
import { isPendingCompany } from "../../lib/companyData";
import { getAvatarTone, getCompanyMonogram } from "../../utils/colorSystem";
import "./CompanyCard.css";

function isMeaningful(value) {
  if (!value) return false;
  if (typeof value === "string") {
    const trimmed = value.trim().toLowerCase();
    return trimmed !== "" && trimmed !== "not specified";
  }
  return true;
}

function CompanyCard({ company, onClick }) {
  const pending = isPendingCompany(company);
  const palette = getAvatarTone(company.name);
  const initials = getCompanyMonogram(company.name);
  const location = isMeaningful(company.location) ? company.location : null;
  const industry = isMeaningful(company.industry) ? company.industry : null;
  const technologies = Array.isArray(company.technologyList)
    ? company.technologyList.filter(isMeaningful).slice(0, 3)
    : [];

  return (
    <div
      className="company-card"
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
      <div className="company-card__header">
        <div className={`company-card__avatar company-card__avatar--${palette}`}>
          {initials}
        </div>
        <div className="company-card__header-text">
          <div className="company-card__title-row">
            <h3 className="company-card__name">{company.name}</h3>
            {pending ? (
              <Badge
                className="company-card__status"
                colour="rgba(217, 119, 6, 0.12)"
                text="Pending review"
                textColour="#b45309"
              />
            ) : null}
          </div>
          {industry && <p className="company-card__subtitle">{industry}</p>}
        </div>
      </div>

      {(location || industry) && (
        <div className="company-card__details">
          {location && (
            <div className="company-card__row">
              <MapPin className="company-card__icon" size={16} strokeWidth={2} />
              <span className="company-card__label">Location</span>
              <span className="company-card__value">{location}</span>
            </div>
          )}
          {industry && (
            <div className="company-card__row">
              <Monitor className="company-card__icon" size={16} strokeWidth={2} />
              <span className="company-card__label">Industry</span>
              <span className="company-card__value">{industry}</span>
            </div>
          )}
        </div>
      )}

      {technologies.length > 0 && (
        <div className="company-card__tags">
          {technologies.map((tech) => (
            <Badge
              category="technology"
              className="company-card__tag"
              key={tech}
              text={tech}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CompanyCard;
