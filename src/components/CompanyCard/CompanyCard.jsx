import "./CompanyCard.css";

function CompanyCard({ company, onClick }) {
  return (
    <div className="company-card" onClick={() => onClick(company.id)} style={{ cursor: "pointer" }}>
      <h3 className="company-name">{company.name}</h3>
      <p><strong>Location:</strong> {company.location}</p>
      <p><strong>Industry:</strong> {company.industry}</p>
      <p><strong>Technology:</strong> {company.technology}</p>
      <p><strong>Role:</strong> {company.role}</p>
    </div>
  );
}

export default CompanyCard;