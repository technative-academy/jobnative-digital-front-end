import '../../App.css';
import './EventCard.css';

function EventCardSkeleton() {
  return (
    <div className="event-card" aria-hidden="true">
      <div className="event-card__date-strip">
        <div
          className="skeleton"
          style={{ width: 36, height: 32, borderRadius: 6, opacity: 0.3 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            className="skeleton"
            style={{ width: 90, height: 12, borderRadius: 4, opacity: 0.3 }}
          />
          <div
            className="skeleton"
            style={{ width: 60, height: 12, borderRadius: 4, opacity: 0.3 }}
          />
        </div>
      </div>

      <div className="event-card__body">
        <div
          className="skeleton"
          style={{
            width: '75%',
            height: 20,
            borderRadius: 6,
            marginBottom: 12,
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <div
            className="skeleton"
            style={{ width: 15, height: 15, flexShrink: 0 }}
          />
          <div className="skeleton" style={{ width: '50%', height: 13 }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <div
            className="skeleton skeleton--pill"
            style={{ width: 64, height: 24, borderRadius: 6 }}
          />
          <div
            className="skeleton skeleton--pill"
            style={{ width: 56, height: 24, borderRadius: 6 }}
          />
        </div>
      </div>
    </div>
  );
}

export default EventCardSkeleton;
