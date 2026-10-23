import React from 'react';
import {
  BadgeCheck,
  CircleCheck,
  CircleHelp,
  CircleX,
  Clock3,
  FileCheck2,
  MinusCircle,
  PauseCircle,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

const STATUS_CONFIG = {
  confirmed: { icon: CircleCheck, variant: 'green' },
  done: { icon: CircleCheck, variant: 'green' },
  normal: { icon: CircleCheck, variant: 'green' },
  active: { icon: BadgeCheck, variant: 'green' },
  reviewed: { icon: FileCheck2, variant: 'blue' },
  skipped: { icon: MinusCircle, variant: 'amber' },
  pending: { icon: Clock3, variant: 'amber' },
  'on hold': { icon: PauseCircle, variant: 'amber' },
  unknown: { icon: CircleHelp, variant: 'slate' },
  discontinued: { icon: CircleX, variant: 'slate' },
  high: { icon: TrendingUp, variant: 'rose' },
  low: { icon: TrendingDown, variant: 'blue' },
};

const StatusBadge = ({ status = '', size = 'sm' }) => {
  const key = String(status).toLowerCase();
  const config = STATUS_CONFIG[key] || { icon: CircleHelp, variant: 'slate' };
  const Icon = config.icon;

  return (
    <span
      className={`badge badge--${config.variant}${size === 'lg' ? ' badge--lg' : ''}`}
      title={`Status: ${status}`}
    >
      <Icon aria-hidden="true" />
      {status}
    </span>
  );
};

export default StatusBadge;
