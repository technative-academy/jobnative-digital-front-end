import "./Home.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useCompanies } from "../../hooks/useCompanies";
import Filters from "../../components/Filters/Filters";
import CompanyCard from "../../components/CompanyCard/CompanyCard";
import Company from "../Company/Company";

function Home() {
  const { data: companies, isLoading, error } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const [filters, setFilters] = useState({
    location: [], industry: [], technology: [], role: [],
  });

  if (isLoading) return <p>Loading companies...</p>;
  if (error) return <p>Something went wrong.</p>;

  const filteredCompanies = companies?.filter((company) => {
    return (
      (filters.location.length === 0 || filters.location.includes(company.location)) &&
      (filters.industry.length === 0 || filters.industry.includes(company.industry)) &&
      (filters.technology.length === 0 || filters.technology.includes(company.technology)) &&
      (filters.role.length === 0 || filters.role.includes(company.role))
    );
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h1 className="hero-title">JobNative Digital</h1>
      <h2 className="hero-subtitle">Find the company of your dreams</h2>
      <p className="hero-text">Explore job opportunities that match your skills and interests.</p>

      <Filters filters={filters} setFilters={setFilters} />

      {filteredCompanies?.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <div className="company-grid">
          {filteredCompanies?.map((company) => (
            <CompanyCard key={company.id} company={company} onClick={setSelectedCompanyId} />
          ))}
        </div>
      )}

      <Company
        open={!!selectedCompanyId}
        onOpenChange={(open) => { if (!open) setSelectedCompanyId(null); }}
        companyId={selectedCompanyId}
      />

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <Link to="/add-company" className="btn-primary">Add a Company</Link>
      </div>
    </div>
  );
}

export default Home;