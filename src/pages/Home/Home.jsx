import "./Home.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCompanies } from "../../hooks/useCompanies";
import { useCompany } from "../../hooks/useCompany";
import Filters from "../../components/Filters/Filters";
import CompanyCard from "../../components/CompanyCard/CompanyCard";

function Home() {
  const { data: companies, isLoading, error } = useCompanies();

  const [filters, setFilters] = useState({
    location: [],
    industry: [],
    technology: [],
    role: [],
  });

  const colourClasses = [
    "card-colour-1",
    "card-colour-2",
    "card-colour-3",
    "card-colour-4",
    "card-colour-5",
  ];

  function getRandomColourClass() {
    return colourClasses[Math.floor(Math.random() * colourClasses.length)];
  }

  if (isLoading) return <p>Loading companies...</p>;
  if (error) return <p>Something went wrong.</p>;

  const filteredCompanies = companies?.filter((company) => {
    return (
      (filters.location.length === 0 ||
        filters.location.includes(company.location)) &&
      (filters.industry.length === 0 ||
        filters.industry.includes(company.industry)) &&
      (filters.technology.length === 0 ||
        filters.technology.includes(company.technology)) &&
      (filters.role.length === 0 || filters.role.includes(company.role))
    );
  });

  return (
    <div className="home-container">
      <h1 className="hero-title">
        <span className="brand-highlight">Job</span>Native
      </h1>
      <h2 className="hero-subtitle">Find the company of your dreams</h2>
      <p className="hero-text">
        Explore job opportunities that match your skills and interests.
      </p>

      <Filters filters={filters} setFilters={setFilters} />

      {filteredCompanies?.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <div className="company-grid">
          {filteredCompanies?.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              colourClass={getRandomColourClass()}
            />
          ))}
        </div>
      )}

      <div className="add-company-link">
        <Link to="/add-company" className="btn-primary">
          Add a Company
        </Link>
      </div>
    </div>
  );
}

export default Home;
