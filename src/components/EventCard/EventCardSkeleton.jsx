import '../../App.css';
import './EventCard.css';

const PLACEHOLDER_COLOURS = [
  'card-colour-1',
  'card-colour-2',
  'card-colour-3',
  'card-colour-4',
  'card-colour-5',
];

function EventCardSkeleton({ colourClass }) {
  const cls = colourClass || PLACEHOLDER_COLOURS[0];
  return (
    <div className={`event-card ${cls}`} aria-hidden="true">
      <div className="event-card__title-row">
        <div
          className="skeleton"
          style={{ width: '70%', height: 26, borderRadius: 6 }}
        />
      </div>

      <div className="event-card__meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            className="skeleton"
            style={{ width: 15, height: 15, flexShrink: 0 }}
          />
          <div className="skeleton" style={{ width: '50%', height: 13 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            className="skeleton"
            style={{ width: 15, height: 15, flexShrink: 0 }}
          />
          <div className="skeleton" style={{ width: '40%', height: 13 }} />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          marginBottom: '0.9rem',
        }}
      >
        <div
          className="skeleton skeleton--pill"
          style={{ width: 64, height: 22 }}
        />
        <div
          className="skeleton skeleton--pill"
          style={{ width: 56, height: 22 }}
        />
      </div>
    </div>
  );
}

export default EventCardSkeleton;
