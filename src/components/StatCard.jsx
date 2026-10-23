import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

const TONE_CLASS = {
  primary: '',
  blue: '',
  green: 'icon-tile--green',
  yellow: 'icon-tile--amber',
  amber: 'icon-tile--amber',
  red: 'icon-tile--rose',
  rose: 'icon-tile--rose',
  cyan: 'icon-tile--cyan',
  violet: 'icon-tile--violet',
  slate: 'icon-tile--slate',
};

const DELTA_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
};

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'primary', delta, deltaTone = 'neutral' }) => {
  const DeltaIcon = DELTA_ICON[deltaTone] || Minus;

  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <div>
          <p className="stat-card__label">{title}</p>
          <p className="stat-card__value">{value}</p>
        </div>
        {Icon && (
          <span className={`icon-tile ${TONE_CLASS[color] ?? ''}`} aria-hidden="true">
            <Icon />
          </span>
        )}
      </div>
      {(subtitle || delta) && (
        <div className="stat-card__foot">
          {subtitle ? <span className="stat-card__sub">{subtitle}</span> : <span />}
          {delta && (
            <span className={`stat-card__delta stat-card__delta--${deltaTone}`}>
              <DeltaIcon aria-hidden="true" />
              {delta}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatCard;
