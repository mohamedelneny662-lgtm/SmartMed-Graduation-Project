import React from 'react';

const SegmentedControl = ({ options, value, onChange, label = 'View options' }) => {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`segmented__btn${value === option.value ? ' is-active' : ''}`}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
