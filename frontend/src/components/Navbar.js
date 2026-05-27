import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const shipperLinks = [
  { path: '/dashboard',    label: 'Dashboard',     icon: '▣'  },
  { path: '/bookings',     label: 'My Shipments',  icon: '📦' },
  { path: '/tracking',     label: 'Live Tracking', icon: '📍' },
  { path: '/book',         label: 'Book Shipment', icon: '＋' },
  { path: '/notifications',label: 'Notifications', icon: '🔔' },
];

const carrierLinks = [
  { path: '/dashboard',     label: 'Dashboard',     icon: '▣'  },
  { path: '/carrier/bookings', label: 'Shipment Jobs', icon: '📋' },
  { path: '/tracking',      label: 'Live Tracking', icon: '📍' },
  { path: '/carrier/fleet', label: 'My Fleet',      icon: '🚛' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' },
];

const adminLinks = [
  { path: '/dashboard', label: 'Admin Dashboard', icon: '⚙️' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const links =
    user?.role === 'admin'   ? adminLinks :
    user?.role === 'carrier' ? carrierLinks : shipperLinks;

  return (
    <div className="sidebar">
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, #6c63ff, #ff6b35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: '#fff',
          }}>N</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: '#fff', letterSpacing: '-0.01em' }}>NexFlow</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Shipping Platform</div>
          </div>
        </div>
      </div>

      {/* User pill */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.06)', borderRadius: 10,
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: user?.role === 'carrier' ? 'linear-gradient(135deg,#ff6b35,#f59e0b)' : user?.role === 'admin' ? 'linear-gradient(135deg,#e11d48,#f59e0b)' : 'linear-gradient(135deg,#6c63ff,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email?.split('@')[0]}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '8px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 8px 6px' }}>
          Main Menu
        </div>
        {links.map(link => {
          const active = location.pathname === link.path;
          return (
            <button key={link.path} onClick={() => navigate(link.path)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 8, marginBottom: 2,
              background: active ? 'rgba(108,99,255,0.25)' : 'transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.5)',
              border: active ? '1px solid rgba(108,99,255,0.4)' : '1px solid transparent',
              fontSize: 13, fontWeight: active ? 600 : 400,
              transition: 'all 0.15s', textAlign: 'left',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: 'center' }}>{link.icon}</span>
              {link.label}
              {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#6c63ff' }} />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 12px 24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={() => { logout(); navigate('/login'); }} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px', borderRadius: 8,
          background: 'transparent', color: 'rgba(255,255,255,0.4)',
          border: 'none', fontSize: 13, transition: 'all 0.15s', textAlign: 'left',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
        >
          <span style={{ fontSize: 15 }}>→</span> Sign Out
        </button>
      </div>
    </div>
  );
}
