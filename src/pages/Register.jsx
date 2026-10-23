import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BellRing,
  Eye,
  EyeOff,
  HeartPulse,
  Info,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [demoNotice, setDemoNotice] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  useEffect(() => {
    document.title = 'Create account · SmartMed';
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/dashboard');
  };

  const handleTermsLink = (event) => {
    event.preventDefault();
    setDemoNotice('Terms and privacy documents are not included in this demo prototype.');
  };

  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <img className="auth-brand__watermark" src="/smartmed-logo.png" alt="" aria-hidden="true" />
        <div className="auth-brand__top">
          <div className="auth-logo">
            <span className="brand-mark brand-mark--logo" aria-hidden="true">
              <img src="/smartmed-logo.png" alt="" />
            </span>
            <div>
              <p className="auth-logo__name">SmartMed</p>
              <p className="auth-logo__tag">Care platform</p>
            </div>
          </div>
        </div>

        <div className="auth-brand__body">
          <h1 className="auth-title">
            A clearer routine starts with <span>one account.</span>
          </h1>
          <p className="auth-copy">
            Set up a patient profile for yourself, or join as a caregiver to follow a loved
            one&apos;s progress with view-only access.
          </p>

          <div className="auth-points">
            <div className="auth-point">
              <span className="auth-point__icon" aria-hidden="true">
                <BellRing />
              </span>
              <div>
                <strong>Build your medication schedule</strong>
                <span>Add doses, reminders, and daily confirmations.</span>
              </div>
            </div>
            <div className="auth-point">
              <span className="auth-point__icon" aria-hidden="true">
                <Users />
              </span>
              <div>
                <strong>Invite a caregiver when you are ready</strong>
                <span>They can view progress but never change your data.</span>
              </div>
            </div>
            <div className="auth-point">
              <span className="auth-point__icon" aria-hidden="true">
                <ShieldCheck />
              </span>
              <div>
                <strong>You stay in control</strong>
                <span>Consent can be reviewed or withdrawn at any time.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-brand__foot">
          <Sparkles aria-hidden="true" />
          Graduation project prototype · demo data only
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <span className="brand-mark brand-mark--logo" aria-hidden="true">
              <img src="/smartmed-logo.png" alt="" />
            </span>
            <div>
              <p className="auth-logo__name">SmartMed</p>
              <p className="auth-logo__tag">Care platform</p>
            </div>
          </div>

          <h2 className="auth-card__title">Create your account</h2>
          <p className="auth-card__sub">
            Join as a patient or caregiver. You can update these details later.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="register-name">
                Full name
              </label>
              <div className="input-wrap">
                <UserRound className="input-wrap__icon" aria-hidden="true" />
                <input
                  id="register-name"
                  type="text"
                  className="input"
                  placeholder="Ahmed Mohamed"
                  autoComplete="name"
                  value={form.name}
                  onChange={updateField('name')}
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="register-email">
                Email address
              </label>
              <div className="input-wrap">
                <Mail className="input-wrap__icon" aria-hidden="true" />
                <input
                  id="register-email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField('email')}
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="register-password">
                Password
              </label>
              <div className="input-wrap">
                <Lock className="input-wrap__icon" aria-hidden="true" />
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input input--has-action"
                  placeholder="Create a password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={updateField('password')}
                />
                <button
                  type="button"
                  className="input-wrap__action"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              <p className="hint">Use at least 8 characters for a stronger password.</p>
            </div>

            <div className="field">
              <label className="label" htmlFor="register-confirm">
                Confirm password
              </label>
              <div className="input-wrap">
                <Lock className="input-wrap__icon" aria-hidden="true" />
                <input
                  id="register-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  className="input input--has-action"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={updateField('confirmPassword')}
                />
                <button
                  type="button"
                  className="input-wrap__action"
                  onClick={() => setShowConfirm((visible) => !visible)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  aria-pressed={showConfirm}
                >
                  {showConfirm ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <p className="hint hint--error">Passwords do not match yet.</p>
              )}
            </div>

            <div className="field">
              <span className="label">I am joining as</span>
              <div className="role-grid" role="group" aria-label="Account role">
                <button
                  type="button"
                  className={`role-card${role === 'patient' ? ' is-active' : ''}`}
                  aria-pressed={role === 'patient'}
                  onClick={() => setRole('patient')}
                >
                  <UserRound aria-hidden="true" />
                  Patient
                </button>
                <button
                  type="button"
                  className={`role-card${role === 'caregiver' ? ' is-active' : ''}`}
                  aria-pressed={role === 'caregiver'}
                  onClick={() => setRole('caregiver')}
                >
                  <Users aria-hidden="true" />
                  Caregiver
                </button>
              </div>
            </div>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              <span>
                I agree to the <a href="#" onClick={handleTermsLink}>Terms of Service</a> and{' '}
                <a href="#" onClick={handleTermsLink}>Privacy Policy</a>.
              </span>
            </label>

            <button type="submit" className="btn btn--primary btn--block">
              Create account
              <ArrowRight />
            </button>
          </form>

          <p className="auth-foot">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <div className="demo-note">
            <Info aria-hidden="true" />
            <span>
              This is a demo prototype. No account is created and no real personal data is stored.
            </span>
          </div>

          {demoNotice && (
            <div className="notice notice--info" style={{ marginTop: 14 }}>
              <Info />
              <div className="notice__body">
                <p className="notice__text">{demoNotice}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Register;
