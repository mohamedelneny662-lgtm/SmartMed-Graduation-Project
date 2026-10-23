import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  CalendarDays,
  Eye,
  FileText,
  FileUp,
  FlaskConical,
  GitCompare,
  Info,
  Minus,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Upload,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { labResults, previousLabs } from '../data/labs';

const comparisonRows = [
  { testName: 'HbA1c', previous: '7.0', current: '6.8', unit: '%', direction: 'down', note: 'Improved' },
  { testName: 'Fasting Glucose', previous: '108', current: '105', unit: 'mg/dL', direction: 'down', note: 'Improved' },
  { testName: 'Total Cholesterol', previous: '198', current: '185', unit: 'mg/dL', direction: 'down', note: 'Improved' },
  { testName: 'LDL Cholesterol', previous: '118', current: '110', unit: 'mg/dL', direction: 'down', note: 'Improved' },
  { testName: 'HDL Cholesterol', previous: '44', current: '45', unit: 'mg/dL', direction: 'up', note: 'Improved' },
];

const getTrend = (trend) => {
  if (trend === 'up') {
    return {
      icon: TrendingUp,
      label: 'Rising',
      className: 'trend trend--up',
    };
  }
  if (trend === 'down') {
    return {
      icon: TrendingDown,
      label: 'Falling',
      className: 'trend trend--down',
    };
  }
  return {
    icon: Minus,
    label: 'Stable',
    className: 'trend trend--stable',
  };
};

const Labs = () => {
  const [dragActive, setDragActive] = useState(false);
  const [pickedFile, setPickedFile] = useState('');
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareSource, setCompareSource] = useState('Latest report');
  const fileInputRef = useRef(null);

  const abnormalCount = labResults.filter((result) => result.status !== 'Normal').length;
  const normalCount = labResults.length - abnormalCount;

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const droppedFile = event.dataTransfer?.files?.[0];
    if (droppedFile) setPickedFile(droppedFile.name);
  };

  const openCompare = (source) => {
    setCompareSource(source);
    setCompareOpen(true);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Lab reports"
        eyebrowIcon={FlaskConical}
        title="Labs"
        subtitle="Upload reports, review confirmed values, and track trends without connecting to a real laboratory system."
        actions={
          <Link to="/labs/review" className="btn btn--secondary">
            <Eye />
            Review extracted values
          </Link>
        }
      />

      <div className="stack-lg">
        <div className="two-col two-col--wide-left">
          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Upload lab report</h3>
                <p className="card-subtitle">The next step is reviewing extracted values before saving.</p>
              </div>
              <span className="badge badge--slate">
                <ShieldCheck aria-hidden="true" />
                Private
              </span>
            </div>

            <div
              className={`dropzone${dragActive ? ' is-active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onDragEnd={() => setDragActive(false)}
            >
              <span className="dropzone__icon" aria-hidden="true">
                <FileUp />
              </span>
              <p className="dropzone__title">
                {pickedFile ? 'File selected (demo)' : 'Drag and drop your lab report'}
              </p>
              <p className="dropzone__text">
                {pickedFile
                  ? pickedFile
                  : 'Choose a PDF or image to start the review workflow.'}
              </p>
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload />
                Browse files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept=".pdf,image/*"
                aria-label="Choose a lab report file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setPickedFile(file.name);
                }}
              />
              <p className="dropzone__meta">
                <ShieldCheck aria-hidden="true" />
                Demo only — no real upload, storage, or OCR processing
              </p>
            </div>

            {pickedFile && (
              <div className="notice notice--success mt-4">
                <Info aria-hidden="true" />
                <div className="notice__body">
                  <p className="notice__text">
                    <strong>{pickedFile}</strong> is selected for demonstration. No file contents
                    are read; open Review Lab Results to see the sample extraction flow.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Previous lab reports</h3>
                <p className="card-subtitle">{previousLabs.length} archived reports in this demo</p>
              </div>
              <span className="badge badge--slate">{previousLabs.length} reports</span>
            </div>

            <div className="report-list">
              {previousLabs.map((report) => (
                <div className="report-row" key={report.id}>
                  <div className="report-file">
                    <span className="report-file__icon" aria-hidden="true">
                      <FileText />
                    </span>
                    <div>
                      <p className="report-file__name">{report.reportName}</p>
                      <p className="report-file__meta">
                        <CalendarDays aria-hidden="true" style={{ width: 11, height: 11 }} />
                        {format(new Date(`${report.date}T00:00:00`), 'MMM d, yyyy')}
                        <span className="meta-dot" />
                        {report.tests} tests
                      </p>
                    </div>
                  </div>
                  <div className="report-actions">
                    <StatusBadge status={report.status} />
                    <Link to="/labs/review" className="btn btn--secondary btn--sm">
                      <Eye />
                      Review
                    </Link>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => openCompare(report.reportName)}
                    >
                      <GitCompare />
                      Compare
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <div>
              <h3 className="card-title">Latest lab results</h3>
              <p className="card-subtitle">
                Panel from {format(new Date('2026-10-15T00:00:00'), 'MMMM d, yyyy')} · 5 tests
              </p>
            </div>
            <div className="lab-summary">
              <span className="summary-chip">
                <FlaskConical aria-hidden="true" />
                <strong>{normalCount}</strong> within range
              </span>
              <span className="summary-chip summary-chip--amber">
                <TrendingUp aria-hidden="true" />
                <strong>{abnormalCount}</strong> outside range
              </span>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Test name</th>
                  <th>Result</th>
                  <th>Unit</th>
                  <th>Reference range</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {labResults.map((result) => {
                  const trend = getTrend(result.trend);
                  const TrendIcon = trend.icon;

                  return (
                    <tr key={result.id} className={result.status !== 'Normal' ? 'is-abnormal' : ''}>
                      <td className="cell-strong">{result.testName}</td>
                      <td>
                        <div className="lab-value">
                          <strong>{result.result}</strong>
                        </div>
                      </td>
                      <td className="cell-muted">{result.unit}</td>
                      <td className="cell-muted cell-nowrap">{result.referenceRange}</td>
                      <td className="cell-muted cell-nowrap">
                        {format(new Date(`${result.date}T00:00:00`), 'MMM d, yyyy')}
                      </td>
                      <td>
                        <StatusBadge status={result.status} />
                      </td>
                      <td>
                        <span className={trend.className}>
                          <TrendIcon aria-hidden="true" />
                          {trend.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="notice notice--warning mt-4">
            <Info aria-hidden="true" />
            <div className="notice__body">
              <p className="notice__text">
                Values outside the reference range are highlighted for attention, but they do not
                confirm a diagnosis. Discuss any abnormal result with a qualified clinician.
              </p>
            </div>
          </div>

          <div className="card-foot flex flex-wrap gap-2">
            <Link to="/labs/review" className="btn btn--primary btn--sm">
              <Eye />
              Review lab results
            </Link>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={() => openCompare('Latest report')}
            >
              <GitCompare />
              Compare results
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        title="Compare lab results"
        subtitle={`${compareSource} compared with the previous panel — demo data only.`}
        size="lg"
        footer={
          <button type="button" className="btn btn--secondary" onClick={() => setCompareOpen(false)}>
            Close
          </button>
        }
      >
        <div className="stack-md">
          <div className="notice notice--info">
            <Info aria-hidden="true" />
            <div className="notice__body">
              <p className="notice__text">
                This side-by-side view uses sample values to demonstrate the comparison layout.
                Always rely on values confirmed by your laboratory or clinician.
              </p>
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table data-table--compact">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Previous</th>
                  <th>Latest</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => {
                  const isDown = row.direction === 'down';
                  return (
                    <tr key={row.testName}>
                      <td className="cell-strong">{row.testName}</td>
                      <td className="cell-muted">
                        {row.previous} {row.unit}
                      </td>
                      <td className="cell-strong">
                        {row.current} {row.unit}
                      </td>
                      <td>
                        <span className={`trend ${isDown ? 'trend--down' : 'trend--up'}`}>
                          {isDown ? <TrendingDown aria-hidden="true" /> : <TrendingUp aria-hidden="true" />}
                          {row.note}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Labs;
