import React from 'react';

const PageHeader = ({ eyebrow, eyebrowIcon: EyebrowIcon, title, subtitle, actions }) => {
  return (
    <div className="page-head">
      <div className="page-head__main">
        {eyebrow && (
          <span className="page-eyebrow">
            {EyebrowIcon && <EyebrowIcon aria-hidden="true" />}
            {eyebrow}
          </span>
        )}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
};

export default PageHeader;
