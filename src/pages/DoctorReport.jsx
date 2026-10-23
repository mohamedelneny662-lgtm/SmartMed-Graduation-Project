import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Download,
  FileText,
  HeartPulse,
  Info,
  Pill,
  ShieldCheck,
  TestTube,
} from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import ChartTooltip from '../components/ChartTooltip';
import { medications } from '../data/medications';
import { recentLabs } from '../data/today';
import { timelineData } from '../data/timeline';

const DoctorReport = () => {
  const [dateRange, setDateRange] = useState({ start: '2026-07-01', end: '2026-10-23' });
  const [exportNotice, setExportNotice] = useState(false);

  const confirmedDoses = 28; // mock
  const totalDoses = 30; // mock
  const missedDoses = totalDoses - confirmedDoses;
  const adherenceRate = Math.round((confirmedDoses / totalDoses) * 100);
  const activeMedications = medications.filter((med) => med.status === 'Active').length;

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const generatedOn = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const printTimestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleExport = () => {
    setExportNotice(true);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Care & sharing"
        eyebrowIcon={FileText}
        title="Doctor visit report"
        subtitle="A printable summary of medications, adherence, and recent labs for your next appointment."
        actions={
          <>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => window.print()}
            >
              <FileText />
              Print view
            </button>
            <button type="button" className="btn btn--primary" onClick={handleExport}>
              <Download />
              Export PDF
            </button>
          </>
        }
      />

      <div className="notice notice--info no-print" style={{ marginBottom: 18 }}>
        <ShieldCheck />
        <div className="notice__body">
          <p className="notice__title">Privacy & sharing notice</p>
          <p className="notice__text">
            This report contains sensitive health information. Only share it with authorized
            healthcare providers.
          </p>
        </div>
      </div>

      {exportNotice && (
        <div className="notice notice--warning no-print" style={{ marginBottom: 18 }}>
          <AlertTriangle />
          <div className="notice__body">
            <p className="notice__title">Demo export</p>
            <p className="notice__text">
              PDF export is not connected in this prototype. Use <strong>Print view</strong> to
              preview the report layout, or present the on-screen summary below.
            </p>
          </div>
        </div>
      )}

      <div className="report-doc">
        <header className="report-header">
          <div>
            <div className="report-brand">
              <span className="brand-mark brand-mark--logo" aria-hidden="true">
                <img src="/smartmed-logo.png" alt="" />
              </span>
              <div>
                <p className="report-brand__name">SmartMed</p>
                <p className="report-brand__tag">Medication adherence platform</p>
              </div>
            </div>
            <h2 className="report-title">Patient health report</h2>
            <p className="report-title-sub">
              Prepared for a healthcare provider appointment · demo data only
            </p>
          </div>

          <div className="report-meta">
            <div className="report-meta__block">
              <p className="report-meta__label">Report ID</p>
              <p className="report-meta__value">SMAP-RPT-001</p>
            </div>
            <div className="report-meta__block">
              <p className="report-meta__label">Generated</p>
              <p className="report-meta__value">{generatedOn}</p>
            </div>
            <div className="report-meta__block">
              <p className="report-meta__label">Period</p>
              <p className="report-meta__value">
                {formatDate(dateRange.start)} – {formatDate(dateRange.end)}
              </p>
            </div>
          </div>
        </header>

        <section className="report-section">
          <div className="report-info-grid">
            <div className="report-info">
              <p className="report-info__label">Patient</p>
              <p className="report-info__value">Ahmed Mohamed</p>
            </div>
            <div className="report-info">
              <p className="report-info__label">Date of birth</p>
              <p className="report-info__value">March 15, 1985</p>
            </div>
            <div className="report-info">
              <p className="report-info__label">Patient ID</p>
              <p className="report-info__value">SMAP-001</p>
            </div>
            <div className="report-info">
              <p className="report-info__label">Prepared by</p>
              <p className="report-info__value">SmartMed (self-reported)</p>
            </div>
          </div>

          <div
            className="report-info-grid report-info-grid--2"
            style={{ marginTop: 12 }}
          >
            <div className="report-info">
              <p className="report-info__label">Report period</p>
              <div className="report-date-range">
                <CalendarDays size={14} aria-hidden="true" />
                <input
                  type="date"
                  className="input"
                  aria-label="Report start date"
                  value={dateRange.start}
                  onChange={(event) =>
                    setDateRange({ ...dateRange, start: event.target.value })
                  }
                  style={{ height: 32, fontSize: 11.5 }}
                />
                <span style={{ fontSize: 10, color: 'var(--faint)' }}>to</span>
                <input
                  type="date"
                  className="input"
                  aria-label="Report end date"
                  value={dateRange.end}
                  onChange={(event) =>
                    setDateRange({ ...dateRange, end: event.target.value })
                  }
                  style={{ height: 32, fontSize: 11.5 }}
                />
              </div>
            </div>            <div className="report-info">
              <p className="report-info__label">Data confidence</p>
              <p className="report-info__value">
                Patient-reported adherence · {activeMedications} active medications
              </p>
            </div>
          </div>
        </section>

        <section className="report-section">
          <h3 className="report-section__title">
            <Pill />
            Current medications
          </h3>
          <div className="table-wrap">
            <table className="data-table data-table--compact">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dose</th>
                  <th>Frequency</th>
                  <th>Schedule</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med) => (
                  <tr key={med.id}>
                    <td>
                      <span className="cell-strong">{med.name}</span>
                      <div style={{ fontSize: 10, color: 'var(--faint)', marginTop: 1 }}>
                        {med.activeIngredient}
                      </div>
                    </td>
                    <td className="cell-nowrap">{med.dosage}</td>
                    <td className="cell-muted cell-nowrap">{med.frequency}</td>
                    <td className="cell-muted cell-nowrap">{med.schedule.join(', ')}</td>
                    <td>
                      <StatusBadge status={med.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="report-section">
          <h3 className="report-section__title">
            <Activity />
            Adherence summary
          </h3>
          <div className="adherence-tiles">
            <div className="adherence-tile adherence-tile--green">
              <p className="adherence-tile__value">{adherenceRate}%</p>
              <p className="adherence-tile__label">Overall adherence</p>
            </div>
            <div className="adherence-tile adherence-tile--blue">
              <p className="adherence-tile__value">{confirmedDoses}</p>
              <p className="adherence-tile__label">Confirmed doses</p>
            </div>
            <div className="adherence-tile adherence-tile--rose">
              <p className="adherence-tile__value">{missedDoses}</p>
              <p className="adherence-tile__label">Missed / skipped</p>
            </div>
          </div>

          <div style={{ marginTop: 12 }} className="notice notice--warning">
            <AlertTriangle />
            <div className="notice__body">
              <p className="notice__title">Missed doses in this period</p>
              <p className="notice__text">
                {missedDoses} doses were missed, both on weekends. Weekend reminders may need
                review.
              </p>
            </div>
          </div>
        </section>

        <section className="report-section">
          <h3 className="report-section__title">
            <TestTube />
            Recent lab results
          </h3>
          <div className="table-wrap">
            <table className="data-table data-table--compact">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Latest result</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLabs.map((lab) => (
                  <tr key={lab.id} className={lab.status === 'High' ? 'is-abnormal' : ''}>
                    <td className="cell-strong">{lab.testName}</td>
                    <td className="cell-nowrap">{lab.result}</td>
                    <td className="cell-muted cell-nowrap">{formatDate(lab.date)}</td>
                    <td>
                      <StatusBadge status={lab.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="report-section">
          <h3 className="report-section__title">
            <Activity />
            Adherence &amp; lab timeline
          </h3>

          <div className="chart-legend" style={{ marginBottom: 10 }}>
            <span className="chart-legend__item">
              <span className="chart-legend__swatch" style={{ background: '#2563eb' }} />
              Adherence %
            </span>
            <span className="chart-legend__item">
              <span className="chart-legend__swatch" style={{ background: '#e11d48' }} />
              HbA1c %
            </span>
          </div>

          <div style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top: 6, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef2f8" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="adherence"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3.5 }}
                  name="Adherence %"
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="hba1c"
                  stroke="#e11d48"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 3.5 }}
                  name="HbA1c %"
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p style={{ marginTop: 8, fontSize: 9.5, color: 'var(--faint)', lineHeight: 1.6 }}>
            <Info
              size={11}
              style={{ display: 'inline-block', verticalAlign: -2, marginRight: 4 }}
            />
            Trends are shown for discussion only. Correlation between adherence and lab values does
            not imply causation.
          </p>
        </section>

        <section className="report-section">
          <h3 className="report-section__title">
            <CheckCircle2 />
            Notes for the provider
          </h3>
          <div className="notice notice--neutral">
            <Info />
            <div className="notice__body">
              <p className="notice__title">Patient-reported summary</p>
              <p className="notice__text">
                Adherence data is self-reported through the SmartMed demo. No clinical
                interpretation has been applied. Please confirm medication and lab details during
                the visit.
              </p>
            </div>
          </div>
        </section>

        <footer className="report-foot">
          <div className="report-signature">
            <strong>SmartMed demo report</strong>
            Generated {generatedOn} at {printTimestamp} · Not a medical record
          </div>
          <div className="report-badge">
            <ShieldCheck />
            Confidential · share with authorized providers only
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DoctorReport;
