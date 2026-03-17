import { useRef, useState } from 'react';
import { getBadgeTone } from '../../utils/colorSystem';
import './TagInput.css';

const TECHNOLOGY_OPTIONS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Python',
  'Java',
  'SQL',
  'PostgreSQL',
  'MongoDB',
  'Redis',
  'Docker',
  'Kubernetes',
  'AWS',
  'Azure',
  'Google Cloud',
  'Terraform',
  'GraphQL',
  'CI/CD',
  'CSS',
  'HTML',
  'AI',
  'React Native',
  'Rust',
  'Cybersecurity',
];

export default function TagInput({
  value = [],
  onChange,
  options = TECHNOLOGY_OPTIONS,
  placeholder = 'Add technology...',
}) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (!trimmed) return;

      const match = options.find(
        (o) => o.toLowerCase() === trimmed.toLowerCase(),
      );
      const tag = match || trimmed;

      if (!value.includes(tag)) {
        onChange([...value, tag]);
      }
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <>
      <div
        className="tag-input-wrapper"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => {
          const tone = getBadgeTone(tag, 'technology');
          return (
            <span key={tag} className={`tag-chip tag-chip--${tone}`}>
              {tag}
              <button
                type="button"
                className="tag-chip__remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                aria-label={`Remove ${tag}`}
              >
                &times;
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
        />
      </div>
      <p className="tag-input__hint">Press Enter to add</p>
    </>
  );
}
