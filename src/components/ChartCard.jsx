import React from 'react';

const ChartCard = ({ title, subtitle, action, children, legend, className = '', height = 'default' }) => {
  const heightClass =
    height === 'sm' ? 'chart-box--sm' : height === 'tall' ? 'chart-box--tall' : '';

  return (
    <div className={`card ${className}`.trim()}>
      <div className="card-head">
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {action && <div className="card-head__action">{action}</div>}
      </div>
      {legend && <div className="chart-legend mb-3">{legend}</div>}
      <div className={`chart-box ${heightClass}`.trim()}>{children}</div>
    </div>
  );
};

export default ChartCard;
