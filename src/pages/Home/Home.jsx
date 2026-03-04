import Company from "../Company/Company";
import { Link } from "react-router-dom";
import { useState } from "react";
import { companies } from "../../data/companies";
import Filters from "../../components/Filters/Filters";
import CompanyCard from "../../components/CompanyCard/CompanyCard";

function Home() {
  const [filters, setFilters] = useState({
    location: "",
    industry: "",
    technology: "",
    role: "",
  });

  const filteredCompanies = companies.filter((company) => {
    return (
      (!filters.location || company.location === filters.location) &&
      (!filters.industry || company.industry === filters.industry) &&
      (!filters.technology || company.technology === filters.technology) &&
      (!filters.role || company.role === filters.role)
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
        filteredCompanies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))
      )}
      
      <Company/>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link to="/add-company">Add a Company</Link>
      </div>
    </div>
  );
}

export default Home;
