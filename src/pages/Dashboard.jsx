import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  FlaskConical,
  MessageSquare,
  MinusCircle,
  Pill,
  Plus,
  RotateCcw,
  Upload,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import ChartCard from '../components/ChartCard';
import ChartTooltip from '../components/ChartTooltip';
import ProgressRing from '../components/ProgressRing';
import SegmentedControl from '../components/SegmentedControl';
import { adherenceHistory, recentLabs, todayDoses, weeklyAdherence } from '../data/today';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const doseMeta = (status) => {
  if (status === 'Confirmed') return 'Recorded as taken';
  if (status === 'Skipped') return 'Marked as skipped';
  return 'Awaiting confirmation';
};

const Dashboard = () => {
  const [doses, setDoses] = useState(todayDoses);
  const [view, setView] = useState('today');

  const updateDoseStatus = (doseId, status) => {
    setDoses((current) => current.map((dose) => (dose.id === doseId ? { ...dose, status } : dose)));
  };

  const markAsDone = (doseId) => updateDoseStatus(doseId, 'Confirmed');

  const totalDoses = doses.length;
  const completedDoses = doses.filter((dose) => dose.status === 'Confirmed').length;
  const skippedDoses = doses.filter((dose) => dose.status === 'Skipped').length;
  const unknownDoses = doses.filter((dose) => dose.status === 'Unknown').length;
  const adherencePercentage =
    totalDoses > 0 ? Math.round((completedDoses / totalDoses) * 100) : 0;
  const needsAttention = skippedDoses + unknownDoses;
  const upcomingDose = doses.find((dose) => dose.status === 'Unknown');

  const averageWeeklyAdherence = Math.round(
    weeklyAdherence.reduce((total, day) => total + day.adherence, 0) / weeklyAdherence.length,
  );

  return (
    <div>
      <PageHeader
        eyebrow="Today's care"
        eyebrowIcon={CalendarDays}
        title={`${getGreeting()}, Ahmed`}
        subtitle={`${format(new Date(), 'EEEE, MMMM d, yyyy')} · Here is your medication and health overview for today.`}
        actions={
          <>
            <Link to="/labs" className="btn btn--secondary">
              <Upload />
              Upload lab
            </Link>
            <Link to="/medications" className="btn btn--primary">
              <Plus />
              Add medication
            </Link>
          </>
        }
      />

      <div className="stack-lg">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-card__top">
              <div>
                <p className="stat-card__label">Today's adherence</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10 }}>
                  <ProgressRing value={adherencePercentage} size={60} stroke={6} tone="green" />
                  <div>
                    <p className="stat-card__value" style={{ marginTop: 0, fontSize: 22 }}>
                      {completedDoses}
                      <small> / {totalDoses}</small>
                    </p>
                    <p className="stat-card__sub">doses confirmed</p>
                  </div>
                </div>
              </div>
              <span className="icon-tile icon-tile--green" aria-hidden="true">
                <Activity />
              </span>
            </div>
            <div className="progress progress--sm">
              <div className="progress__bar progress__bar--green" style={{ width: `${adherencePercentage}%` }} />
            </div>
          </div>

          <StatCard
            title="Doses scheduled"
            value={totalDoses}
            subtitle="Across your active medications"
            icon={Pill}
            color="blue"
          />
          <StatCard
            title="Confirmed"
            value={completedDoses}
            subtitle="Taken as prescribed"
            icon={CheckCircle2}
            color="green"
            delta={completedDoses > 0 ? 'On track' : undefined}
            deltaTone="up"
          />
          <StatCard
            title="Needs attention"
            value={needsAttention}
            subtitle={`${unknownDoses} pending · ${skippedDoses} skipped`}
            icon={Clock3}
            color="amber"
          />
        </div>

        <div className="dash-grid">
          <div className="dash-col">
            <div className="card">
              <div className="card-head">
                <div>
                  <h3 className="card-title">Today's medications</h3>
                  <p className="card-subtitle">Check off each dose as you take it</p>
                </div>
                <SegmentedControl
                  label="Medication view"
                  value={view}
                  onChange={setView}
                  options={[
                    { value: 'today', label: 'Today' },
                    { value: 'history', label: 'History' },
                  ]}
                />
              </div>

              {view === 'today' ? (
                <>
                  <div className="dose-progress">
                    <span>
                      {completedDoses} of {totalDoses} completed
                    </span>
                    <div className="progress progress--sm">
                      <div
                        className="progress__bar progress__bar--green"
                        style={{ width: `${adherencePercentage}%` }}
                      />
                    </div>
                    <span>{adherencePercentage}%</span>
                  </div>

                  <div className="dose-list">
                    {doses.map((dose) => (
                      <div
                        className={`dose-item${dose.status === 'Confirmed' ? ' dose-item--confirmed' : ''}`}
                        key={dose.id}
                      >
                        <div className="dose-time">
                          <strong>{dose.scheduledTime}</strong>
                          <span>{Number(dose.scheduledTime.slice(0, 2)) < 12 ? 'AM' : 'PM'}</span>
                        </div>
                        <span className="dose-icon" aria-hidden="true">
                          <Pill />
                        </span>
                        <div className="dose-main">
                          <p className="dose-name">{dose.medicineName}</p>
                          <p className="dose-meta">
                            <span>{dose.dosage}</span>
                            <span className="meta-dot" />
                            <span>{doseMeta(dose.status)}</span>
                          </p>
                        </div>
                        <div className="dose-actions">
                          <StatusBadge status={dose.status} />
                          {dose.status === 'Unknown' && (
                            <>
                              <button
                                type="button"
                                className="btn btn--success btn--sm"
                                onClick={() => markAsDone(dose.id)}
                              >
                                <CheckCircle2 />
                                Mark as done
                              </button>
                              <button
                                type="button"
                                className="btn btn--ghost btn--icon btn--sm"
                                onClick={() => updateDoseStatus(dose.id, 'Skipped')}
                                aria-label={`Skip ${dose.medicineName}`}
                                title="Skip this dose"
                              >
                                <MinusCircle />
                              </button>
                            </>
                          )}
                          {dose.status === 'Skipped' && (
                            <button
                              type="button"
                              className="btn btn--ghost btn--icon btn--sm"
                              onClick={() => updateDoseStatus(dose.id, 'Unknown')}
                              aria-label={`Undo skip for ${dose.medicineName}`}
                              title="Undo skip"
                            >
                              <RotateCcw />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div>
                  <div className="review-progress mb-4">
                    <span>Recent adherence</span>
                    <div className="progress progress--sm">
                      <div
                        className="progress__bar progress__bar--green"
                        style={{ width: `${averageWeeklyAdherence}%` }}
                      />
                    </div>
                    <span>{averageWeeklyAdherence}% weekly average</span>
                  </div>
                  <div className="history-list">
                    {adherenceHistory.map((day) => (
                      <div className="history-day" key={day.id}>
                        <div className="history-day__date">
                          <strong>{format(new Date(`${day.date}T00:00:00`), 'MMM d')}</strong>
                          <span>{day.label}</span>
                        </div>
                        <div className="history-day__bar">
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
                        </div>
                        <span className="history-day__pct">{day.adherence}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="hint">History is illustrative demo data for this prototype.</p>
                </div>
              )}
            </div>

            <ChartCard
              title="Weekly adherence"
              subtitle="Confirmed doses as a share of scheduled doses"
              action={<span className="badge badge--green">{averageWeeklyAdherence}% avg</span>}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyAdherence} margin={{ top: 6, right: 6, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="adherenceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} dy={6} />
                  <YAxis
                    domain={[60, 100]}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`}
                    width={42}
                  />
                  <Tooltip content={<ChartTooltip unit="%" />} cursor={{ stroke: '#cbd5e1', strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="adherence"
                    name="Adherence"
                    stroke="#2563eb"
                    strokeWidth={2.2}
                    fill="url(#adherenceFill)"
                    animationDuration={700}
                    animationEasing="ease-out"
                    dot={{ fill: '#fff', stroke: '#2563eb', strokeWidth: 2, r: 3.5 }}
                    activeDot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="dash-col dash-col--side">
            {upcomingDose ? (
              <div className="next-dose">
                <p className="next-dose__label">
                  <Clock3 aria-hidden="true" />
                  Next dose
                </p>
                <div className="next-dose__row">
                  <div>
                    <p className="next-dose__name">{upcomingDose.medicineName}</p>
                    <p className="next-dose__meta">
                      {upcomingDose.dosage} · Scheduled dose
                    </p>
                  </div>
                  <span className="next-dose__time">
                    <Clock3 aria-hidden="true" />
                    {upcomingDose.scheduledTime}
                  </span>
                </div>
                <div className="next-dose__actions">
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => markAsDone(upcomingDose.id)}
                  >
                    <CheckCircle2 />
                    Mark as done
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => updateDoseStatus(upcomingDose.id, 'Skipped')}
                  >
                    Skip
                  </button>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center gap-3">
                  <span className="icon-tile icon-tile--green" aria-hidden="true">
                    <CheckCircle2 />
                  </span>
                  <div>
                    <p className="card-title">All doses handled</p>
                    <p className="card-subtitle">Every scheduled dose has been recorded today.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <div className="card-head">
                <div>
                  <h3 className="card-title">Recent lab summary</h3>
                  <p className="card-subtitle">Latest confirmed results</p>
                </div>
                <Link to="/labs" className="btn btn--ghost btn--sm">
                  View all
                  <ArrowRight />
                </Link>
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

            <div className="card">
              <div className="card-head">
                <div>
                  <h3 className="card-title">Quick actions</h3>
                  <p className="card-subtitle">Common tasks in one place</p>
                </div>
              </div>
              <div className="quick-actions">
                <Link to="/medications" className="quick-action">
                  <span className="icon-tile icon-tile--sm" aria-hidden="true">
                    <Pill />
                  </span>
                  <span className="quick-action__label">
                    Medications
                    <ArrowUpRight />
                  </span>
                </Link>
                <Link to="/labs" className="quick-action">
                  <span className="icon-tile icon-tile--sm icon-tile--cyan" aria-hidden="true">
                    <Upload />
                  </span>
                  <span className="quick-action__label">
                    Upload lab
                    <ArrowUpRight />
                  </span>
                </Link>
                <Link to="/assistant" className="quick-action">
                  <span className="icon-tile icon-tile--sm icon-tile--violet" aria-hidden="true">
                    <MessageSquare />
                  </span>
                  <span className="quick-action__label">
                    Ask assistant
                    <ArrowUpRight />
                  </span>
                </Link>
                <Link to="/doctor-report" className="quick-action">
                  <span className="icon-tile icon-tile--sm icon-tile--slate" aria-hidden="true">
                    <FileText />
                  </span>
                  <span className="quick-action__label">
                    Doctor report
                    <ArrowUpRight />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
