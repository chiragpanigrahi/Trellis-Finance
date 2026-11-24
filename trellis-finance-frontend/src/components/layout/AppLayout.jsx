import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar  from './Navbar';
import useAuthStore from '../../store/authStore';
import { useLocation } from 'react-router-dom';

const PAGE_META = {
  '/dashboard': { title: 'Dashboard',   subtitle: 'Global treasury overview' },
  '/ledger':    { title: 'Ledger',      subtitle: 'Transaction history & posting' },
  '/insights':  { title: 'AI Insights', subtitle: 'Spending analysis & investment intelligence' },
  '/entities':  { title: 'Entities',    subtitle: 'Organizations & account structure' },
};

export default function AppLayout() {
  const token    = useAuthStore(s => s.token);
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  const meta = PAGE_META[location.pathname] || { title: 'Trellis Finance' };

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title={meta.title} subtitle={meta.subtitle} />
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
