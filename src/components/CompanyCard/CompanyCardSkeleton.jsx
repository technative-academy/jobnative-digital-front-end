import '../../App.css';
import './CompanyCard.css';

function CompanyCardSkeleton() {
  return (
    <div className="company-card" aria-hidden="true">
      <div className="company-card__header">
        <div
          className="skeleton skeleton--rounded"
          style={{ width: 44, height: 44, flexShrink: 0 }}
        />
        <div
          className="company-card__header-text"
          style={{ flex: 1, minWidth: 0 }}
        >
          <div
            className="skeleton"
            style={{ width: '65%', height: 16, marginBottom: 6 }}
          />
          <div className="skeleton" style={{ width: '40%', height: 12 }} />
        </div>
      </div>

      <div className="company-card__details">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            className="skeleton"
            style={{ width: 16, height: 16, flexShrink: 0 }}
          />
          <div className="skeleton" style={{ width: '55%', height: 13 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            className="skeleton"
            style={{ width: 16, height: 16, flexShrink: 0 }}
          />
          <div className="skeleton" style={{ width: '45%', height: 13 }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
        <div
          className="skeleton skeleton--pill"
          style={{ width: 60, height: 24 }}
        />
        <div
          className="skeleton skeleton--pill"
          style={{ width: 72, height: 24 }}
        />
        <div
          className="skeleton skeleton--pill"
          style={{ width: 54, height: 24 }}
        />
      </div>
    </div>
  );
}

export default CompanyCardSkeleton;
