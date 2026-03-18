import { useEffect, useRef } from 'react';

function FilterDropdown({
  label,
  options,
  name,
  filters,
  setFilters,
  openDropdown,
  setOpenDropdown,
  variant,
}) {
  const selectedValues = filters[name] || [];
  const isActive = selectedValues.length > 0;
  const isOpen = openDropdown === name;
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setOpenDropdown]);

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
  const activeClass = isActive
    ? variant === 'green'
      ? ' filter-button--active-green'
      : ' filter-button--active'
    : '';
  const menuClass =
    variant === 'green' ? 'filter-menu filter-menu--green' : 'filter-menu';

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <button
        className={`filter-button${activeClass}`}
        onClick={toggleDropdown}
        type="button"
      >
        {buttonLabel}
      </button>

      {isOpen && (
        <div className={menuClass}>
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
