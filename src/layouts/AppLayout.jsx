import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  FileSearch,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Pill,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard / Today', short: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'Overview' },
  { name: 'Medications', short: 'Medications', href: '/medications', icon: Pill, section: 'Overview' },
  { name: 'Labs', short: 'Labs', href: '/labs', icon: FlaskConical, section: 'Overview' },
  { name: 'Health Timeline', short: 'Health Timeline', href: '/timeline', icon: CalendarDays, section: 'Overview' },
  {
    name: 'AI Health Assistant',
    short: 'AI Health Assistant',
    href: '/assistant',
    icon: MessageSquare,
    section: 'Care & sharing',
    badge: 'Demo',
  },
  { name: 'Caregiver View', short: 'Caregiver View', href: '/caregiver', icon: Users, section: 'Care & sharing' },
  { name: 'Doctor Visit Report', short: 'Doctor Visit Report', href: '/doctor-report', icon: FileText, section: 'Care & sharing' },
];

const reviewPage = {
  name: 'Review Lab Results',
  short: 'Review Lab Results',
  href: '/labs/review',
  icon: FileSearch,
  section: 'Overview',
};

const searchIndex = [...navigation, reviewPage];

const sections = [
  { label: 'Overview', items: navigation.filter((item) => item.section === 'Overview') },
  { label: 'Care & sharing', items: navigation.filter((item) => item.section === 'Care & sharing') },
];

const notifications = [
  {
    id: 1,
    icon: AlertTriangle,
    tone: 'amber',
    title: 'Missed-dose reminder',
    text: 'Atorvastatin 20 mg at 21:00 is still marked as unknown.',
    time: '12 minutes ago',
  },
  {
    id: 2,
    icon: CheckCircle2,
    tone: 'green',
    title: 'Dose confirmed',
    text: 'Lisinopril 10 mg was marked as taken at 09:04.',
    time: '2 hours ago',
  },
  {
    id: 3,
    icon: FileSearch,
    tone: '',
    title: 'Lab review needed',
    text: 'One extracted value from your October report is uncertain.',
    time: 'Yesterday',
  },
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const currentItem =
    searchIndex.find((item) => item.href === location.pathname) ||
    navigation.find((item) => location.pathname.startsWith(`${item.href}/`));

  const pageTitle = currentItem?.short || 'SmartMed';

  const searchResults = searchQuery.trim()
    ? searchIndex.filter((item) =>
        `${item.name} ${item.short}`.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
    : [];

  useEffect(() => {
    document.title = `${pageTitle} · SmartMed`;
  }, [pageTitle]);

  useEffect(() => {
    setSidebarOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    setNotifOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  useEffect(() => {
    if (!notifOpen) return undefined;

    const handleClick = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const goToResult = (href) => {
    navigate(href);
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar${sidebarOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar__brand">
          <span className="brand-mark brand-mark--logo" aria-hidden="true">
            <img src="/smartmed-logo.png" alt="" />
          </span>
          <div className="brand-text">
            <span className="brand-name">SmartMed</span>
            <span className="brand-sub">Care platform</span>
          </div>
          <button
            type="button"
            className="sidebar__close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X />
          </button>
        </div>

        <div className="sidebar__scroll">
          {sections.map((section) => (
            <div className="nav-section" key={section.label}>
              <p className="nav-section__label">{section.label}</p>
              <nav className="nav-list">
                {section.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon aria-hidden="true" />
                    <span>{item.name}</span>
                    {item.badge && <span className="nav-link__badge">{item.badge}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}

          <div className="sidebar-note">
            <div className="sidebar-note__head">
              <ShieldCheck aria-hidden="true" />
              <span>Prototype environment</span>
            </div>
            <p>Demo data only. No real medical records, OCR, AI, or authentication are connected.</p>
          </div>
        </div>

        <div className="sidebar__footer">
          <div className="sidebar-user">
            <span className="sidebar-user__avatar" aria-hidden="true">
              AM
            </span>
            <div>
              <p className="sidebar-user__name">
                Ahmed Mohamed
                <span className="live-dot" aria-hidden="true" />
              </p>
              <p className="sidebar-user__role">Patient · Demo profile</p>
            </div>
          </div>
          <p className="sidebar-version">
            <span>v1.0</span>
            Graduation project
          </p>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="topbar__left">
            <button
              type="button"
              className="menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu />
            </button>
            <div className="topbar__crumb" aria-label="Breadcrumb">
              <span>Workspace</span>
              <ChevronRight aria-hidden="true" />
              <span className="topbar__crumb-current">{pageTitle}</span>
            </div>
          </div>

          <div className="topbar__actions">
            <div className="topbar-search">
              <Search className="topbar-search__icon" aria-hidden="true" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search pages..."
                aria-label="Search pages"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)}
              />
              <span className="topbar-search__hint" aria-hidden="true">
                Ctrl K
              </span>

              {searchOpen && searchQuery.trim() && (
                <div className="search-results">
                  <p className="search-results__label">Pages</p>
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <button
                        key={item.href}
                        type="button"
                        className="search-result"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => goToResult(item.href)}
                      >
                        <item.icon aria-hidden="true" />
                        {item.short}
                      </button>
                    ))
                  ) : (
                    <p className="search-empty">No matching page found.</p>
                  )}
                </div>
              )}
            </div>

            <div className="popover-wrap" ref={notifRef}>
              <button
                type="button"
                className="icon-btn"
                aria-label={`Notifications${unread ? ', unread' : ''}`}
                aria-expanded={notifOpen}
                onClick={() => setNotifOpen((open) => !open)}
              >
                <Bell />
                {unread && <span className="icon-btn__dot" aria-hidden="true" />}
              </button>

              {notifOpen && (
                <div className="popover">
                  <div className="popover__head">
                    <p className="popover__title">Notifications</p>
                    {unread && (
                      <button
                        type="button"
                        className="popover__link"
                        onClick={() => setUnread(false)}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="notif-list">
                    {notifications.map((item) => (
                      <div className="notif-item" key={item.id}>
                        <span className={`notif-item__icon ${item.tone ? `notif-item__icon--${item.tone}` : ''}`}>
                          <item.icon aria-hidden="true" />
                        </span>
                        <div>
                          <p className="notif-item__title">
                            {item.title}
                          </p>
                          <p className="notif-item__text">{item.text}</p>
                          <p className="notif-item__time">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="popover__foot">
                    Demo notifications · nothing is sent
                  </div>
                </div>
              )}
            </div>

            <div className="user-chip">
              <span className="user-chip__avatar" aria-hidden="true">
                AM
              </span>
              <div className="user-chip__meta">
                <p className="user-chip__name">Ahmed Mohamed</p>
                <p className="user-chip__role">Patient</p>
              </div>
            </div>
          </div>
        </header>

        <main className="page" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
