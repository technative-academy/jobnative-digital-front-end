import "./Home.css";
import Company from "../Company/Company";
import { Link } from "react-router-dom";
import { useState } from "react";
import { companies } from "../../data/companies";
import Filters from "../../components/Filters/Filters";
import CompanyCard from "../../components/CompanyCard/CompanyCard";

function Home() {
  const [filters, setFilters] = useState({
    location: [],
    industry: [],
    technology: [],
    role: [],
  });

  const filteredCompanies = companies.filter((company) => {
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
    <div style={{ padding: "2rem" }}>
      <h1>JobNative Digital</h1>
      <h2>Find the company of your dreams.</h2>
      <p>Explore job opportunities that match your skills and interests.</p>

      <Filters filters={filters} setFilters={setFilters} />

      {filteredCompanies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <div className="company-grid">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link to="/add-company" className="btn-primary">
          Add a Company
        </Link>
      </div>
    </div>
  );
}

export default Home;
