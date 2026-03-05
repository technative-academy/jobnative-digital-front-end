function FilterDropdown({
  label,
  options,
  name,
  filters,
  setFilters,
  openDropdown,
  setOpenDropdown,
}) {
  function toggleDropdown() {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  function handleCheckboxChange(value) {
    const currentValues = filters[name] || [];

    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    setFilters({
      ...filters,
      [name]: newValues,
    });
  }

  return (
    <div className="filter-dropdown">
      <button className="filter-button" onClick={toggleDropdown} type="button">
        {label}
      </button>

      {openDropdown === name && (
        <div className="filter-menu">
          {options.map((option) => (
            <label key={option} className="filter-option">
              <input
                type="checkbox"
                checked={filters[name]?.includes(option) || false}
                onChange={() => handleCheckboxChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
