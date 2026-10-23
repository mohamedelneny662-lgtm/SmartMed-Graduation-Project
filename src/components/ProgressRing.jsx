import React, { useEffect, useId, useState } from 'react';

const ProgressRing = ({
  value = 0,
  size = 84,
  stroke = 8,
  label,
  tone = 'primary',
  showValue = true,
}) => {
  const gradientId = useId().replace(/:/g, '');
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const offset = circumference - (clamped / 100) * circumference;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const gradients = {
    primary: ['#2563eb', '#06b6d4'],
    green: ['#079455', '#34d399'],
    amber: ['#dc6803', '#fbbf24'],
  };
  const [from, to] = gradients[tone] || gradients.primary;

  return (
    <div
      className="ring"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label || 'Progress'}: ${clamped}%`}
    >
      <svg width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id={`ring-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          className="ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="ring__fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#ring-${gradientId})`}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          style={{ strokeDashoffset: isMounted ? offset : circumference }}
        />
      </svg>
      <div className="ring__center">
        {showValue && <span className="ring__value">{clamped}%</span>}
        {label && <span className="ring__label">{label}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
