function CompanyCard({ company }) {
  return (
    <div style={cardStyle}>
      <h3>{company.name}</h3>
      <p>
        <strong>Location:</strong> {company.location}
      </p>
      <p>
        <strong>Industry:</strong> {company.industry}
      </p>
      <p>
        <strong>Technology:</strong> {company.technology}
      </p>
      <p>
        <strong>Role:</strong> {company.role}
      </p>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  padding: "1rem",
  borderRadius: "8px",
  marginBottom: "1rem",
};

export default CompanyCard;
