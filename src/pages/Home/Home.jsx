import './Home.css';
import { useState } from 'react';
import { useCompanies } from '../../hooks/useCompanies';
import { isPendingCompany } from '../../lib/companyData';
import Filters from '../../components/Filters/Filters';
import CompanyCard from '../../components/CompanyCard/CompanyCard';
import CompanyCardSkeleton from '../../components/CompanyCard/CompanyCardSkeleton';
import CompanyView from '../Company/CompanyView';
import AddCompanyDialog from '../../components/AddCompanyDialog/AddCompanyDialog';
import { useAuth } from '../../hooks/useAuth';

function Home() {
  const { data: companies, isLoading, error } = useCompanies();
  const { isAuthenticated } = useAuth();

  const [viewCompanyId, setViewCompanyId] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [filters, setFilters] = useState({
    location: [],
    industry: [],
    technology: [],
    role: [],
  });

  if (error) return <p className="home-status">Something went wrong.</p>;

  const filteredCompanies =
    companies?.filter((company) => {
      return (
        (filters.location.length === 0 ||
          filters.location.includes(company.location)) &&
        (filters.industry.length === 0 ||
          filters.industry.includes(company.industry)) &&
        (filters.technology.length === 0 ||
          company.technologyList?.some((tech) =>
            filters.technology.includes(tech),
          )) &&
        (filters.role.length === 0 ||
          company.roleList?.some((role) => filters.role.includes(role)))
      );
    }) || [];

  return (
    <div className="home-page page-transition">
      <CompanyView
        open={viewCompanyId !== null}
        onOpenChange={() => setViewCompanyId(null)}
        companyId={viewCompanyId}
      />
      <AddCompanyDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      <div className="home-hero">
        <div className="home-hero__brand">
          <span className="home-hero__brand--primary">Job</span>
          <span className="home-hero__brand--dark">Native</span>
        </div>
        <h1 className="home-hero__title">Find the company of your dreams</h1>
        <p className="home-hero__subtitle">
          Explore job opportunities that match your skills and interests.
        </p>
        {companies?.length > 0 && (
          <span className="home-hero__badge">
            {companies.length}+ companies listed
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="filter-bar">
          <div
            className="skeleton"
            style={{ height: 44, width: 340, borderRadius: 12 }}
          />
        </div>
      ) : (
        <Filters
          filters={filters}
          setFilters={setFilters}
          addButton={
            isAuthenticated && (
              <button
                className="home-add-btn"
                onClick={() => setAddDialogOpen(true)}
                type="button"
              >
                + Add Company
              </button>
            )
          }
        />
      )}

      {isLoading ? (
        <div className="home-card-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <p className="home-empty">No companies match the current filters.</p>
      ) : (
        <div className="home-card-grid">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onClick={
                isPendingCompany(company)
                  ? undefined
                  : () => setViewCompanyId(company.id)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
