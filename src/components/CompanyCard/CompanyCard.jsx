import "./CompanyCard.css";

<<<<<<< feature/comment
function CompanyCard({ company, onClick }) {
  return (
    <div className="company-card" onClick={() => onClick(company.id)} style={{ cursor: "pointer" }}>
=======
function CompanyCard({ company, colourClass, onClick }) {
  return (
    <div
      className={`company-card ${colourClass}`}
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
>>>>>>> main
      <h3 className="company-name">{company.name}</h3>
      <p><strong>Location:</strong> {company.location}</p>
      <p><strong>Industry:</strong> {company.industry}</p>
      <p><strong>Technology:</strong> {company.technology}</p>
      <p><strong>Role:</strong> {company.role}</p>
    </div>
  );
}

export default CompanyCard;