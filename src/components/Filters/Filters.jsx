function Filters({ filters, setFilters }) {
  function handleChange(e) {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <div style={filterContainer}>
      <select name="location" onChange={handleChange}>
        <option value="">All Locations</option>
        <option value="London">London</option>
        <option value="Remote">Remote</option>
        <option value="Manchester">Manchester</option>
        <option value="Brighton">Brighton</option>
        <option value="Worthing">Worthing</option>
      </select>

      <select name="industry" onChange={handleChange}>
        <option value="">All Industries</option>
        <option value="FinTech">FinTech</option>
        <option value="SaaS">SaaS</option>
        <option value="Charity">Charity</option>
        <option value="HealthTech">HealthTech</option>
        <option value="Travel">Travel</option>
      </select>

      <select name="technology" onChange={handleChange}>
        <option value="">All Technologies</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
        <option value="Python">Python</option>
      </select>

      <select name="role" onChange={handleChange}>
        <option value="">All Job Roles</option>
        <option value="Frontend Developer">Frontend Developer</option>
        <option value="Backend Developer">Backend Developer</option>
        <option value="Data Engineer">Data Engineer</option>
      </select>
    </div>
  );
}

const filterContainer = {
  display: "flex",
  gap: "1rem",
  marginBottom: "2rem",
};

export default Filters;
