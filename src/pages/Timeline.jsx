import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  CalendarDays,
  FileText,
  FlaskConical,
  Info,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import ChartTooltip from '../components/ChartTooltip';
import SegmentedControl from '../components/SegmentedControl';
import { timelineData } from '../data/timeline';

const RANGE_OPTIONS = [
  { value: '3m', label: '3 months', months: 3 },
  { value: '6m', label: '6 months', months: 6 },
  { value: '10m', label: '10 months', months: 10 },
];

const Timeline = () => {
  const [dateRange, setDateRange] = useState('10m');

  const rangeMonths = RANGE_OPTIONS.find((option) => option.value === dateRange)?.months ?? 10;
  const visibleData = timelineData.slice(-rangeMonths);

  const averageAdherence = Math.round(
    visibleData.reduce((total, point) => total + point.adherence, 0) / visibleData.length,
  );

  const firstPoint = visibleData[0];
  const latestPoint = visibleData[visibleData.length - 1];
  const hba1cChange = Number((latestPoint.hba1c - firstPoint.hba1c).toFixed(1));
  const hba1cImproved = hba1cChange < 0;

  const legendAdherence = (
    <span className="chart-legend__item">
      <span className="chart-legend__swatch" style={{ background: '#2563eb' }} />
      Adherence %
    </span>
  );

  const legendHbA1c = (
    <span className="chart-legend__item">
      <span className="chart-legend__swatch" style={{ background: '#e11d48' }} />
      HbA1c %
    </span>
  );

  return (
    <div>
      <PageHeader
        eyebrow="Long-term view"
        eyebrowIcon={CalendarDays}
        title="Health timeline"
        subtitle="Compare medication adherence with lab trends over time. Correlation does not prove causation."
        actions={
          <Link to="/doctor-report" className="btn btn--secondary">
            <FileText />
            Open doctor report
          </Link>
        }
      />

      <div className="stack-lg">
        <div className="stat-grid stat-grid--3">
          <StatCard
            title="Average adherence"
            value={`${averageAdherence}%`}
            subtitle={`${visibleData.length} month${visibleData.length === 1 ? '' : 's'} in view`}
            icon={Activity}
            color="green"
            delta={averageAdherence >= 90 ? 'On target' : 'Below target'}
            deltaTone={averageAdherence >= 90 ? 'up' : 'down'}
          />
          <StatCard
            title="Latest HbA1c"
            value={`${latestPoint.hba1c}%`}
            subtitle={`${latestPoint.month} 2026 · target under 7%`}
            icon={FlaskConical}
            color="blue"
          />
          <StatCard
            title="HbA1c change"
            value={`${hba1cChange > 0 ? '+' : ''}${hba1cChange}%`}
            subtitle={`Since ${firstPoint.month} 2026`}
            icon={hba1cImproved ? TrendingDown : TrendingUp}
            color={hba1cImproved ? 'green' : 'yellow'}
            delta={hba1cImproved ? 'Improving' : 'Review'}
            deltaTone={hba1cImproved ? 'up' : 'down'}
          />
        </div>

        <div className="card timeline-controls">
          <div className="timeline-controls__label">
            <CalendarDays aria-hidden="true" />
            Time range
            <span className="badge badge--slate">
              {firstPoint.month} – {latestPoint.month} 2026
            </span>
          </div>
          <SegmentedControl
            label="Select timeline range"
            value={dateRange}
            onChange={setDateRange}
            options={RANGE_OPTIONS.map(({ value, label }) => ({ value, label }))}
          />
        </div>

        <div className="insight-strip">
          <span className="insight-strip__icon" aria-hidden="true">
            <Sparkles />
          </span>
          <p className="insight-strip__text">
            Over the selected {visibleData.length} months, adherence averaged{' '}
            <strong>{averageAdherence}%</strong> and HbA1c moved from{' '}
            <strong>{firstPoint.hba1c}%</strong> to <strong>{latestPoint.hba1c}%</strong>. This
            summary is descriptive only — many factors can influence lab results.
          </p>
        </div>

        <div className="chart-grid">
          <ChartCard
            title="Medication adherence over time"
            subtitle="Monthly confirmed doses"
            legend={legendAdherence}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visibleData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} dy={6} />
                <YAxis
                  domain={[80, 100]}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  width={42}
                />
                <ReferenceLine y={90} stroke="#cbd5e1" strokeDasharray="4 4" />
                <Tooltip
                  content={<ChartTooltip unit="%" />}
                  cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
                />
                <Line
                  type="monotone"
                  dataKey="adherence"
                  name="Adherence"
                  stroke="#2563eb"
                  strokeWidth={2.3}
                  animationDuration={700}
                  animationEasing="ease-out"
                  dot={{ fill: '#fff', stroke: '#2563eb', strokeWidth: 2, r: 3.2 }}
                  activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="HbA1c trend"
            subtitle="Lower is generally better — target set by your clinician"
            legend={legendHbA1c}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visibleData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} dy={6} />
                <YAxis
                  domain={[6.4, 7.4]}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                  width={42}
                />
                <ReferenceLine y={7} stroke="#fca5a5" strokeDasharray="4 4" />
                <Tooltip
                  content={<ChartTooltip unit="%" />}
                  cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
                />
                <Line
                  type="monotone"
                  dataKey="hba1c"
                  name="HbA1c"
                  stroke="#e11d48"
                  strokeWidth={2.3}
                  animationDuration={700}
                  animationEasing="ease-out"
                  dot={{ fill: '#fff', stroke: '#e11d48', strokeWidth: 2, r: 3.2 }}
                  activeDot={{ r: 5, fill: '#e11d48', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <ChartCard
          title="Adherence vs. lab trend"
          subtitle="Dual-axis comparison — use the legend to read each series"
          height="tall"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={visibleData} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} dy={6} />
              <YAxis
                yAxisId="left"
                domain={[80, 100]}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
                width={44}
                stroke="#2563eb"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[6.4, 7.4]}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${value}%`}
                width={44}
                stroke="#e11d48"
              />
              <Tooltip
                content={<ChartTooltip unit="%" />}
                cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }}
              />
              <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 12 }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="adherence"
                name="Adherence %"
                stroke="#2563eb"
                strokeWidth={2.2}
                dot={{ fill: '#fff', stroke: '#2563eb', strokeWidth: 2, r: 3 }}
                animationDuration={700}
                animationEasing="ease-out"
                activeDot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="hba1c"
                name="HbA1c %"
                stroke="#e11d48"
                strokeWidth={2.2}
                dot={{ fill: '#fff', stroke: '#e11d48', strokeWidth: 2, r: 3 }}
                animationDuration={700}
                animationEasing="ease-out"
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="notice notice--info">
          <AlertCircle aria-hidden="true" />
          <div className="notice__body">
            <p className="notice__title">Important: correlation is not causation</p>
            <p className="notice__text">
              Adherence and lab improvements may appear together, but this does not prove that one
              caused the other. Many factors — including diet, activity, other medications, and
              illness — can influence results. Always discuss trends with your healthcare provider
              before making medical decisions.
            </p>
          </div>
        </div>

        <div className="notice notice--neutral">
          <Info aria-hidden="true" />
          <div className="notice__body">
            <p className="notice__text">
              Only user-confirmed lab values should feed these charts. This timeline uses sample
              data for demonstration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
