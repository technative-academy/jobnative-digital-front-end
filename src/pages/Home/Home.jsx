// import "./Home.css";
// import { useState } from "react";
// import { useCompanies } from "../../hooks/useCompanies";
// import Filters from "../../components/Filters/Filters";
// import CompanyCard from "../../components/CompanyCard/CompanyCard";
// import CompanyView from "../Company/CompanyView";
// import AddCompanyDialog from "../../components/AddCompanyDialog/AddCompanyDialog";

// function Home() {
//   const { data: companies, isLoading, error } = useCompanies();

//   // dialog state
//   const [viewCompanyId, setViewCompanyId] = useState(null);
//   const [addDialogOpen, setAddDialogOpen] = useState(false);
import './Home.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCompanies } from '../../hooks/useCompanies';
import Filters from '../../components/Filters/Filters';
import CompanyCard from '../../components/CompanyCard/CompanyCard';
import Company from '../Company/Company';

function Home() {
  const { data: companies, isLoading, error } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const [filters, setFilters] = useState({
    location: [],
    industry: [],
    technology: [],
    role: [],
  });

  const colourClasses = [
    'card-colour-1',
    'card-colour-2',
    'card-colour-3',
    'card-colour-4',
    'card-colour-5',
  ];

  function getColourClass(companyId) {
    const hash = String(companyId)
      .split('')
      .reduce((total, character) => total + character.charCodeAt(0), 0);

    return colourClasses[hash % colourClasses.length];
  }

  if (isLoading) return <p>Loading companies...</p>;
  if (error) return <p>Something went wrong.</p>;

  // const filteredCompanies =
  //   companies?.filter((company) => {
  //     return (
  //       (filters.location.length === 0 ||
  //         filters.location.includes(company.location)) &&
  //       (filters.industry.length === 0 ||
  //         filters.industry.includes(company.industry)) &&
  //       (filters.technology.length === 0 ||
  //         company.technologies?.some((tech) =>
  //           filters.technology.includes(tech.name),
  //         )) &&
  //       (filters.role.length === 0 || filters.role.includes(company.role))
  //     );
  //   }) || [];

  // return (
  //   <div className="home-container">
  //     {/* View Company Dialogue */}
  //     <CompanyView
  //       open={viewCompanyId !== null}
  //       onOpenChange={() => setViewCompanyId(null)}
  //       companyId={viewCompanyId}
  //     />

  //     {/* Add Company Dialogue */}
  //     <AddCompanyDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

  const filteredCompanies = companies?.filter((company) => {
    const matchesTechnology =
      filters.technology.length === 0 ||
      filters.technology.some((technology) =>
        company.technologyList?.includes(technology),
      );

    const matchesRole =
      filters.role.length === 0 ||
      filters.role.some((role) => company.roleList?.includes(role));

    return (
      (filters.location.length === 0 ||
        filters.location.includes(company.location)) &&
      (filters.industry.length === 0 ||
        filters.industry.includes(company.industry)) &&
      matchesTechnology &&
      matchesRole
    );
  });

  return (
    <div className="home-container">
      <Company
        open={selectedCompanyId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCompanyId(null);
          }
        }}
        companyId={selectedCompanyId}
      />

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
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              // colourClass={getRandomColourClass()}
              // onClick={() => setViewCompanyId(company.id)}
              colourClass={getColourClass(company.id)}
              onClick={() => {
                setSelectedCompanyId(company.id);
              }}
            />
          ))}
        </div>
      )}

      <div className="add-company-link">
        <button className="btn-primary" onClick={() => setAddDialogOpen(true)}>
          Add a Company
        </button>
      </div>
    </div>
  );
}

export default Home;
