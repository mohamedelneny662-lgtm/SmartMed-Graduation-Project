import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BellRing,
  Eye,
  EyeOff,
  FlaskConical,
  HeartPulse,
  Info,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [demoNotice, setDemoNotice] = useState('');

  useEffect(() => {
    document.title = 'Sign in · SmartMed';
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/dashboard');
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
            Every dose, lab, and visit in <span>one calm place.</span>
          </h1>
          <p className="auth-copy">
            SmartMed brings medication schedules, lab reviews, and simple health trends together so
            you and your care team can stay on the same page.
          </p>

          <div className="auth-points">
            <div className="auth-point">
              <span className="auth-point__icon" aria-hidden="true">
                <BellRing />
              </span>
              <div>
                <strong>Dose reminders that fit your day</strong>
                <span>Confirm, skip, or review each scheduled dose.</span>
              </div>
            </div>
            <div className="auth-point">
              <span className="auth-point__icon" aria-hidden="true">
                <FlaskConical />
              </span>
              <div>
                <strong>Lab results without the paperwork</strong>
                <span>Review extracted values before anything is saved.</span>
              </div>
            </div>
            <div className="auth-point">
              <span className="auth-point__icon" aria-hidden="true">
                <ShieldCheck />
              </span>
              <div>
                <strong>Share only what you choose</strong>
                <span>Caregiver access is view-only and consent-based.</span>
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

          <h2 className="auth-card__title">Welcome back</h2>
          <p className="auth-card__sub">
            Sign in to review today&apos;s doses, lab results, and your health timeline.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="label" htmlFor="login-email">
                Email address
              </label>
              <div className="input-wrap">
                <Mail className="input-wrap__icon" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="login-password">
                Password
              </label>
              <div className="input-wrap">
                <Lock className="input-wrap__icon" aria-hidden="true" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="input input--has-action"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
            </div>

            <div className="auth-row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                />
                Remember me
              </label>
              <button
                type="button"
                className="auth-link"
                style={{ background: 'none', border: 0, padding: 0 }}
                onClick={() =>
                  setDemoNotice('Password recovery is not connected in this demo prototype.')
                }
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="btn btn--primary btn--block">
              Sign in
              <ArrowRight />
            </button>
          </form>

          <div className="auth-divider">Or continue with</div>

          <div className="social-row">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() =>
                setDemoNotice('Social sign-in is not connected in this demo prototype.')
              }
            >
              Google
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() =>
                setDemoNotice('Social sign-in is not connected in this demo prototype.')
              }
            >
              Microsoft
            </button>
          </div>

          <p className="auth-foot">
            New to SmartMed? <Link to="/register">Create an account</Link>
          </p>

          <div className="demo-note">
            <Info aria-hidden="true" />
            <span>
              Demo authentication is enabled. Any email and password will open the dashboard — no
              real account or medical data is created.
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

export default Login;
