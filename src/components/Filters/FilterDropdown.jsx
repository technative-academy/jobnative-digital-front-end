function FilterDropdown({
  label,
  options,
  name,
  filters,
  setFilters,
  openDropdown,
  setOpenDropdown,
}) {
  const selectedValues = filters[name] || [];
  const isActive = selectedValues.length > 0;

  function toggleDropdown() {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  function handleCheckboxChange(value) {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    setFilters({
      ...filters,
      [name]: newValues,
    });
  }

  const buttonLabel = isActive ? `${label} (${selectedValues.length})` : label;

  return (
    <div className="filter-dropdown">
      <button
        className={`filter-button${isActive ? ' filter-button--active' : ''}`}
        onClick={toggleDropdown}
        type="button"
      >
        {buttonLabel}
      </button>

      {openDropdown === name && (
        <div className="filter-menu">
          {options.map((option) => (
            <label key={option} className="filter-option">
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
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
