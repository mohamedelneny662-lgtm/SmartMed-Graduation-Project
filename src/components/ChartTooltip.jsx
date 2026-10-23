import React from 'react';

const ChartTooltip = ({ active, payload, label, unit = '' }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="chart-tip">
      {label && <p className="chart-tip__label">{label}</p>}
      {payload.map((entry) => (
        <div className="chart-tip__row" key={entry.dataKey || entry.name}>
          <span
            className="chart-tip__dot"
            style={{ background: entry.color || entry.stroke || '#38bdf8' }}
          />
          <span>{entry.name}</span>
          <span className="chart-tip__value">
            {entry.value}
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ChartTooltip;
