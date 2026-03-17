import { MapPin, MessageSquare } from 'lucide-react';
import './CompanyCard.css';

const AVATAR_PALETTES = ['purple', 'green', 'blue', 'pink', 'orange', 'cyan'];

function getAvatarPalette(name) {
  if (!name) return 'purple';
  return AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

function isMeaningful(value) {
  if (!value) return false;
  if (typeof value === 'string') {
    const trimmed = value.trim().toLowerCase();
    return trimmed !== '' && trimmed !== 'not specified';
  }
  return true;
}

const TAG_COLORS = {
  react: 'purple',
  angular: 'purple',
  'vue.js': 'purple',
  vue: 'purple',
  svelte: 'purple',
  'node.js': 'green',
  node: 'green',
  python: 'green',
  django: 'green',
  ruby: 'green',
  rails: 'green',
  go: 'green',
  aws: 'blue',
  typescript: 'blue',
  javascript: 'blue',
  java: 'blue',
  php: 'blue',
  kotlin: 'blue',
  swift: 'blue',
  docker: 'blue',
  kubernetes: 'blue',
};

function getTagColor(tech) {
  return TAG_COLORS[tech.toLowerCase()] || 'purple';
}

function CompanyCard({ company, onClick }) {
  const palette = getAvatarPalette(company.name);
  const initials = getInitials(company.name);
  const location = isMeaningful(company.location) ? company.location : null;
  const industry = isMeaningful(company.industry) ? company.industry : null;
  const technologies = Array.isArray(company.technologyList)
    ? company.technologyList.slice(0, 3)
    : [];

  return (
    <div
      className="company-card"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
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
          <h3 className="company-card__name">{company.name}</h3>
          {industry && (
            <p className="company-card__subtitle">{industry}</p>
          )}
        </div>
      </div>

      {(location || industry) && (
        <div className="company-card__details">
          {location && (
            <div className="company-card__row">
              <MapPin className="company-card__icon" size={14} strokeWidth={2} />
              <span className="company-card__label">Location</span>
              <span className="company-card__value">{location}</span>
            </div>
          )}
          {industry && (
            <div className="company-card__row">
              <MessageSquare className="company-card__icon" size={14} strokeWidth={2} />
              <span className="company-card__label">Industry</span>
              <span className="company-card__value">{industry}</span>
            </div>
          )}
        </div>
      )}

      {technologies.length > 0 && (
        <div className="company-card__tags">
          {technologies.map((tech) => (
            <span
              key={tech}
              className={`company-card__tag company-card__tag--${getTagColor(tech)}`}
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompanyCard;
