import { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import "./Filters.css";

function Filters({ filters, setFilters, addButton }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h2>Filter companies by:</h2>
        {addButton}
      </div>
      <div className="filters">
        <FilterDropdown
          label="Location"
          name="location"
          options={[
            "All",
            "London",
            "Remote",

            "Brighton",
            "Worthing",
            "Crawley",
            "Lewes",
            "Haywards Heath",
            "Burgess Hill",
            "East Sussex",
            "West Sussex",
          ]}
          filters={filters}
          setFilters={setFilters}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <FilterDropdown
          label="Industry"
          name="industry"
          options={[
            "Software & Digital Services",
            "Fintech & Financial Services",
            "Data, AI & Machine Learning",
            "Cybersecurity & IT Infrastructure",
            "Healthtech & Biotechnology",
            "E-commerce & Retail",
            "Game Development & Media",
            "Manufacturing & Engineering",
            "Logistics & Transportation",
            "Public Sector & Education",
          ]}
          filters={filters}
          setFilters={setFilters}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <FilterDropdown
          label="Technology"
          name="technology"
          options={[
            "React",
            "Node.js",
            "Python",
            "Django",
            "TypeScript",
            "JavaScript",
            "Java",

            "AWS",

            "Ruby",
            "PHP",
          ]}
          filters={filters}
          setFilters={setFilters}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <FilterDropdown
          label="Role"
          name="role"
          options={[
            "Frontend Developer",
            "Backend Developer",
            "Data Engineer",
            "Full Stack Developer",
            "Software engineer",
          ]}
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
