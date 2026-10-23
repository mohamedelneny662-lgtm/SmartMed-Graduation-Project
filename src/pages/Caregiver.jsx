import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  FlaskConical,
  LockKeyhole,
  Pill,
  ShieldCheck,
  Users,
  XCircle,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { recentLabs, todayDoses, weeklyAdherence } from '../data/today';

const Caregiver = () => {
  const [selectedPatient, setSelectedPatient] = useState('Ahmed Mohamed');

  const doses = todayDoses;
  const total = doses.length;
  const confirmed = doses.filter((dose) => dose.status === 'Confirmed').length;
  const skipped = doses.filter((dose) => dose.status === 'Skipped').length;
  const unknown = doses.filter((dose) => dose.status === 'Unknown').length;
  const adherence = Math.round((confirmed / total) * 100);

  const missedDoses = doses.filter((dose) => dose.status === 'Unknown');
  const averageAdherence = Math.round(
    weeklyAdherence.reduce((sum, day) => sum + day.adherence, 0) / weeklyAdherence.length,
  );

  return (
    <div>
      <PageHeader
        eyebrow="Read-only access"
        eyebrowIcon={Eye}
        title="Caregiver view"
        subtitle="Monitor medication adherence and recent results. Caregiver access is view-only and cannot change medications or confirm doses."
        actions={
          <span className="badge badge--blue badge--lg">
            <Eye aria-hidden="true" />
            View only
          </span>
        }
      />

      <div className="stack-lg">
        <div className="card patient-card">
          <div className="patient-id">
            <span className="avatar avatar--xl" aria-hidden="true">
              AM
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="patient-name">{selectedPatient}</p>
                <span className="badge badge--green">
                  <ShieldCheck aria-hidden="true" />
                  Consent active
                </span>
              </div>
              <p className="patient-meta">
                <span>Patient ID SMAP-001</span>
                <span className="meta-dot" />
                <span>Type 2 diabetes</span>
                <span className="meta-dot" />
                <span>Last synced today, 09:15</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="patient-select" className="hint" style={{ marginTop: 0 }}>
              Viewing patient
            </label>
            <select
              id="patient-select"
              className="patient-select"
              value={selectedPatient}
              onChange={(event) => setSelectedPatient(event.target.value)}
            >
              <option value="Ahmed Mohamed">Ahmed Mohamed</option>
              <option value="Fatima Hassan">Fatima Hassan</option>
            </select>
          </div>
        </div>

        <div className="notice notice--info">
          <LockKeyhole aria-hidden="true" />
          <div className="notice__body">
            <p className="notice__title">Privacy & consent</p>
            <p className="notice__text">
              Caregiver access is enabled only with patient permission. This view is read-only:
              medication editing, dose confirmation, and report changes are disabled by design.
            </p>
          </div>
        </div>

        <div className="stat-grid">
          <StatCard
            title="Total doses today"
            value={total}
            subtitle="Scheduled across the day"
            icon={Pill}
            color="blue"
          />
          <StatCard
            title="Confirmed"
            value={confirmed}
            subtitle="Taken as prescribed"
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Skipped"
            value={skipped}
            subtitle="Marked as skipped"
            icon={XCircle}
            color="yellow"
          />
          <StatCard
            title="Unknown"
            value={unknown}
            subtitle="Awaiting confirmation"
            icon={Clock3}
            color="red"
          />
        </div>

        <div className="two-col">
          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Today's medication status</h3>
                <p className="card-subtitle">
                  {confirmed} of {total} doses confirmed · {adherence}% adherence
                </p>
              </div>
              <span className="badge badge--slate">
                <Eye aria-hidden="true" />
                Read-only
              </span>
            </div>

            <div className="progress progress--sm mb-4">
              <div
                className="progress__bar progress__bar--green"
                style={{ width: `${adherence}%` }}
              />
            </div>

            <div>
              {doses.map((dose) => (
                <div className="dose-status-row" key={dose.id}>
                  <div className="dose-status-row__main">
                    <span className="icon-tile icon-tile--sm icon-tile--slate" aria-hidden="true">
                      <Pill />
                    </span>
                    <div>
                      <p className="dose-status-row__name">{dose.medicineName}</p>
                      <p className="dose-status-row__meta">
                        {dose.dosage} · scheduled for {dose.scheduledTime}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={dose.status} />
                </div>
              ))}
            </div>

            <p className="hint">
              Caregivers can follow status here but cannot confirm or skip a dose.
            </p>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">
                  <span className="flex items-center gap-2">
                    <AlertTriangle aria-hidden="true" style={{ width: 17, height: 17, color: 'var(--amber-600)' }} />
                    Missed-dose alerts
                  </span>
                </h3>
                <p className="card-subtitle">Doses still awaiting confirmation today</p>
              </div>
              <span className="badge badge--amber">{missedDoses.length} pending</span>
            </div>

            {missedDoses.length > 0 ? (
              <div>
                {missedDoses.map((dose) => (
                  <div className="alert-card" key={dose.id}>
                    <div className="alert-card__main">
                      <span className="alert-card__icon" aria-hidden="true">
                        <AlertTriangle />
                      </span>
                      <div>
                        <p className="alert-card__title">
                          {dose.medicineName} {dose.dosage}
                        </p>
                        <p className="alert-card__meta">
                          Scheduled for {dose.scheduledTime} · not yet confirmed
                        </p>
                      </div>
                    </div>
                    <span className="badge badge--amber">Pending</span>
                  </div>
                ))}
                <p className="hint">
                  These are pending doses, not confirmed missed doses. The patient may still record
                  them.
                </p>
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '26px 16px' }}>
                <span className="empty-state__icon">
                  <CheckCircle2 aria-hidden="true" />
                </span>
                <p className="empty-state__title">No missed doses</p>
                <p className="empty-state__text">Every dose today has been handled.</p>
              </div>
            )}
          </div>
        </div>

        <div className="two-col">
          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Recent adherence (7 days)</h3>
                <p className="card-subtitle">Daily confirmed doses as a percentage</p>
              </div>
              <span className="badge badge--green">{averageAdherence}% avg</span>
            </div>

            <div>
              {weeklyAdherence.map((day) => (
                <div className="adherence-row" key={day.day}>
                  <span className="adherence-row__day">{day.day}</span>
                  <div className="progress progress--sm">
                    <div
                      className={`progress__bar ${
                        day.adherence >= 90
                          ? 'progress__bar--green'
                          : day.adherence >= 70
                            ? 'progress__bar--amber'
                            : 'progress__bar--rose'
                      }`}
                      style={{ width: `${day.adherence}%` }}
                    />
                  </div>
                  <span className="adherence-row__value">{day.adherence}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <div>
                <h3 className="card-title">Recent labs summary</h3>
                <p className="card-subtitle">Latest confirmed results</p>
              </div>
              <span className="badge badge--slate">
                <FlaskConical aria-hidden="true" />
                Labs
              </span>
            </div>

            <div className="list">
              {recentLabs.map((lab) => (
                <div className="list-item" key={lab.id}>
                  <span className="icon-tile icon-tile--sm icon-tile--cyan" aria-hidden="true">
                    <FlaskConical />
                  </span>
                  <div className="list-item__main">
                    <p className="list-item__title">{lab.testName}</p>
                    <p className="list-item__meta">
                      {format(new Date(`${lab.date}T00:00:00`), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="list-item__end">
                    <span className="strong text-sm">{lab.result}</span>
                    <StatusBadge status={lab.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="notice notice--neutral">
          <Users aria-hidden="true" />
          <div className="notice__body">
            <p className="notice__text">
              <strong>Shared with consent.</strong> This caregiver dashboard is a demonstration of
              read-only access. In a real deployment, permissions, audit logs, and revocation would
              be managed by the patient.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caregiver;
