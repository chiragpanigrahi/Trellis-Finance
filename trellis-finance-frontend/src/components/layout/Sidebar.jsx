import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const NAV = [
  {
    section: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: IconDash }],
  },
  {
    section: 'Finance',
    items: [
      { to: '/ledger',   label: 'Ledger',   icon: IconLedger },
      { to: '/entities', label: 'Entities',  icon: IconEntities },
    ],
  },
  {
    section: 'Intelligence',
    items: [{ to: '/insights', label: 'AI Insights', icon: IconAI }],
  },
];

function IconDash() {
  return (
    <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2" y="2" width="7" height="7" rx="1.5"/>
      <rect x="11" y="2" width="7" height="7" rx="1.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5"/>
    </svg>
  );
}
function IconLedger() {
  return (
    <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 5h12M4 10h12M4 15h7"/>
      <circle cx="16" cy="15" r="2.5"/>
      <path d="M16 12.5v1"/>
    </svg>
  );
}
function IconEntities() {
  return (
    <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="5" r="2.5"/>
      <circle cx="4"  cy="15" r="2.5"/>
      <circle cx="16" cy="15" r="2.5"/>
      <path d="M10 7.5v4M10 11.5l-4 1.5M10 11.5l4 1.5"/>
    </svg>
  );
}
function IconAI() {
  return (
    <svg className="nav-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z"/>
      <path d="M7 10l2 2 4-4"/>
      <path d="M10 6v1M10 13v1M6 10H5M15 10h-1"/>
    </svg>
  );
}
function IconLogout() {
  return (
    <svg style={{width:14,height:14,opacity:.5}} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13 10H3M13 10l-3-3M13 10l-3 3"/>
      <path d="M9 4H5a1 1 0 00-1 1v10a1 1 0 001 1h4"/>
    </svg>
  );
}

export default function Sidebar() {
  const user     = useAuthStore(s => s.user);
  const logout   = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'TF';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">T</div>
        <div>
          <div className="logo-name">Trellis Finance</div>
          <div className="logo-tag">Treasury Intelligence</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV.map(({ section, items }) => (
          <div key={section}>
            <div className="nav-section">{section}</div>
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <Icon />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        <div className="user-pill" onClick={handleLogout} title="Log out">
          <div className="avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-name">{user?.fullName || 'User'}</div>
            <div className="user-role">{user?.role || 'ADMIN'}</div>
          </div>
          <IconLogout />
        </div>
      </div>
    </aside>
  );
}
