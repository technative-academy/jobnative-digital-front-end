import { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import "./Filters.css";

function Filters({ filters, setFilters }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h2>Filter companies by:</h2>
      </div>
      <div className="filters">
        <FilterDropdown
          label="Location"
          name="location"
          options={[
            "All",
            "London",
            "Remote",
            "Manchester",
            "Brighton",
            "Worthing",
          ]}
          filters={filters}
          setFilters={setFilters}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <FilterDropdown
          label="Industry"
          name="industry"
          options={["FinTech", "SaaS", "Charity", "HealthTech", "Travel"]}
          filters={filters}
          setFilters={setFilters}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <FilterDropdown
          label="Technology"
          name="technology"
          options={["React", "Node", "Python"]}
          filters={filters}
          setFilters={setFilters}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <FilterDropdown
          label="Role"
          name="role"
          options={["Frontend Developer", "Backend Developer", "Data Engineer"]}
          filters={filters}
          setFilters={setFilters}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />
      </div>
    </div>
  );
}

export default Filters;
