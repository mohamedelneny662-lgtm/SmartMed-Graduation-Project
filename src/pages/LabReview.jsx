import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCheck,
  CheckCircle2,
  Edit3,
  FileText,
  FlaskConical,
  Info,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { extractedLabValues } from '../data/labs';

const LabReview = () => {
  const [values, setValues] = useState(extractedLabValues);
  const [confirmed, setConfirmed] = useState({});

  const confirmedCount = values.filter((value) => confirmed[value.id]).length;
  const allConfirmed = confirmedCount === values.length;
  const progress = Math.round((confirmedCount / values.length) * 100);

  const toggleConfirm = (id) => {
    setConfirmed((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  const confirmAll = () => {
    const nextConfirmed = {};
    values.forEach((value) => {
      nextConfirmed[value.id] = true;
    });
    setConfirmed(nextConfirmed);
  };

  const resetConfirmations = () => setConfirmed({});

  const updateValue = (id, field, newValue) => {
    setValues((current) =>
      current.map((value) => (value.id === id ? { ...value, [field]: newValue } : value)),
    );
  };

  return (
    <div>
      <PageHeader
        eyebrow="Review before you trust"
        eyebrowIcon={ShieldCheck}
        title="Review lab results"
        subtitle="Check the extracted values against your original report, correct anything that looks off, then confirm what should feed your charts and assistant."
        actions={
          <Link to="/labs" className="btn btn--secondary">
            <ArrowLeft />
            Back to labs
          </Link>
        }
      />

      <div className="stack-lg">
        <div className="notice notice--warning">
          <AlertTriangle aria-hidden="true" />
          <div className="notice__body">
            <p className="notice__title">Only confirmed values should be trusted</p>
            <p className="notice__text">
              Values marked as uncertain may have been extracted incorrectly. Only values you
              explicitly confirm should be used in charts or assistant features. This is demo data
              with no real OCR processing.
            </p>
          </div>
        </div>

        <div className="review-grid">
          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Uploaded report preview</h3>
                <p className="card-subtitle">Reference document for manual verification</p>
              </div>
              <span className="badge badge--slate">
                <FileText aria-hidden="true" />
                Demo
              </span>
            </div>

            <div className="preview-sheet">
              <div className="preview-file">
                <span className="preview-file__icon" aria-hidden="true">
                  <FileText />
                </span>
                <div>
                  <p className="preview-file__name">Lab Report.pdf</p>
                  <p className="preview-file__meta">Uploaded Oct 15, 2026 · 1.2 MB</p>
                </div>
              </div>

              <div className="preview-mock">
                <span className="preview-mock__icon" aria-hidden="true">
                  <FlaskConical />
                </span>
                <h4>Preview unavailable in demo</h4>
                <p>
                  No actual file content is stored or rendered. In a production flow, the original
                  report would appear here for side-by-side verification.
                </p>
                <div className="preview-lines" aria-hidden="true">
                  <span className="preview-line" />
                  <span className="preview-line" />
                  <span className="preview-line" />
                  <span className="preview-line" />
                </div>
              </div>
            </div>

            <div className="notice notice--neutral mt-4">
              <Info aria-hidden="true" />
              <div className="notice__body">
                <p className="notice__text">
                  Tip: compare the test name, value, unit, and reference range against the original
                  document before confirming.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Extracted values</h3>
                <p className="card-subtitle">
                  {values.length} values found · {values.filter((value) => value.uncertain).length}{' '}
                  flagged as uncertain
                </p>
              </div>
              <div className="flex items-center gap-2">
                {confirmedCount > 0 && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={resetConfirmations}
                  >
                    <RotateCcw />
                    Reset
                  </button>
                )}
                <button type="button" className="btn btn--primary btn--sm" onClick={confirmAll}>
                  <CheckCheck />
                  Confirm all
                </button>
              </div>
            </div>

            <div className="review-progress mb-4">
              <span>
                {confirmedCount} of {values.length} confirmed
              </span>
              <div className="progress progress--sm">
                <div
                  className={`progress__bar ${allConfirmed ? 'progress__bar--green' : ''}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{progress}%</span>
            </div>

            <div className="value-list">
              {values.map((value) => {
                const isConfirmed = Boolean(confirmed[value.id]);
                const highConfidence = value.confidence >= 85;

                return (
                  <div
                    className={`value-card${value.uncertain ? ' is-uncertain' : ''}${
                      isConfirmed ? ' is-confirmed' : ''
                    }`}
                    key={value.id}
                  >
                    <div className="value-card__head">
                      <div className="value-card__title">
                        {value.testName}
                        {value.uncertain && (
                          <span className="badge badge--amber">
                            <AlertTriangle aria-hidden="true" />
                            Uncertain
                          </span>
                        )}
                        {isConfirmed && (
                          <span className="badge badge--green">
                            <CheckCircle2 aria-hidden="true" />
                            Confirmed
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className={`confirm-toggle${isConfirmed ? ' is-confirmed' : ''}`}
                        onClick={() => toggleConfirm(value.id)}
                        aria-pressed={isConfirmed}
                      >
                        <CheckCircle2 aria-hidden="true" />
                        {isConfirmed ? 'Confirmed' : 'Confirm'}
                      </button>
                    </div>

                    <div className="value-grid">
                      <div className="field">
                        <label className="label" htmlFor={`value-${value.id}`}>
                          Extracted value
                        </label>
                        <div className="input-wrap">
                          <input
                            id={`value-${value.id}`}
                            className="input"
                            type="text"
                            value={value.extractedValue}
                            onChange={(event) =>
                              updateValue(value.id, 'extractedValue', event.target.value)
                            }
                            style={{ paddingLeft: 10, paddingRight: 30 }}
                          />
                          <span className="input-wrap__icon" style={{ left: 'auto', right: 9 }}>
                            <Edit3 aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                      <div className="field">
                        <label className="label" htmlFor={`unit-${value.id}`}>
                          Unit
                        </label>
                        <input
                          id={`unit-${value.id}`}
                          className="input"
                          type="text"
                          value={value.unit}
                          onChange={(event) => updateValue(value.id, 'unit', event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="value-card__range field">
                      <label className="label" htmlFor={`range-${value.id}`}>
                        Reference range
                      </label>
                      <input
                        id={`range-${value.id}`}
                        className="input"
                        type="text"
                        value={value.referenceRange}
                        onChange={(event) =>
                          updateValue(value.id, 'referenceRange', event.target.value)
                        }
                      />
                    </div>

                    <div className="value-card__bottom">
                      <div className="confidence">
                        <span>Extraction confidence</span>
                        <div className="confidence__bar" aria-hidden="true">
                          <div
                            className={`confidence__fill${highConfidence ? ' confidence__fill--high' : ''}`}
                            style={{ width: `${value.confidence}%` }}
                          />
                        </div>
                        <strong style={{ color: highConfidence ? 'var(--green-700)' : 'var(--amber-700)' }}>
                          {value.confidence}%
                        </strong>
                      </div>
                      {value.uncertain && !isConfirmed && (
                        <span className="hint" style={{ marginTop: 0, color: 'var(--amber-700)' }}>
                          Double-check this value against the original report.
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="notice notice--info mt-4">
              <Info aria-hidden="true" />
              <div className="notice__body">
                <p className="notice__text">
                  <strong>What happens after confirmation?</strong> Confirmed values become the
                  source of truth for trend charts and assistant explanations in this demo. Editing
                  a value does not automatically confirm it.
                </p>
              </div>
            </div>

            <div className="form-actions form-actions--split">
              <span className="hint" style={{ marginTop: 0 }}>
                {allConfirmed
                  ? 'All values confirmed — ready for charts and assistant use.'
                  : `${values.length - confirmedCount} value${values.length - confirmedCount === 1 ? '' : 's'} still need review.`}
              </span>
              <button type="button" className="btn btn--primary" onClick={confirmAll}>
                <CheckCheck />
                Confirm all values
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReview;
