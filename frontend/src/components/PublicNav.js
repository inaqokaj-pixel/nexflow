import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  {
    label: 'Platform',
    path: '/platform',
    dropdown: null,
  },
  {
    label: 'Carriers',
    path: '/carriers',
    dropdown: null,
  },
  {
    label: 'Solutions',
    path: '/solutions',
    dropdown: [
      { icon: '📦', label: 'For Shippers', desc: 'Book and track shipments', path: '/solutions' },
      { icon: '🚛', label: 'For Carriers', desc: 'List fleet and earn more', path: '/carriers' },
      { icon: '🏢', label: 'Enterprise', desc: 'Custom integrations & SLA', path: '/solutions' },
    ],
  },
  {
    label: 'Pricing',
    path: '/pricing',
    dropdown: null,
  },
  {
    label: 'Resources',
    path: '/resources',
    dropdown: [
      { icon: '📘', label: 'Guides', desc: 'Step-by-step tutorials', path: '/resources' },
      { icon: '🔌', label: 'API Docs', desc: 'REST API reference', path: '/resources' },
      { icon: '📊', label: 'Case Studies', desc: 'Real customer stories', path: '/resources' },
      { icon: '🆕', label: 'Changelog', desc: 'What\'s new in NexFlow', path: '/resources' },
    ],
  },
];

export default function PublicNav({ scrolled }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) setLoginOpen(false);
      if (navRef.current && !navRef.current.contains(e.target)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
    setLoginOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav ref={navRef} style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      padding: '0 48px', height: 68,
      display: 'flex', alignItems: 'center',
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : 'none',
      transition: 'all 0.25s',
    }}>
      {/* Logo */}
      <button onClick={() => navigate('/')} style={{
        display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
        background: 'none', border: 'none', marginRight: 36, padding: 0,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00c896', fontWeight: 900, fontSize: 15 }}>N</div>
        <span style={{ fontWeight: 900, fontSize: 17, color: '#0f172a', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>NexFlow</span>
      </button>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {navItems.map(item => (
          <div key={item.label} style={{ position: 'relative' }}
            onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
            onMouseLeave={() => setOpenDropdown(null)}>
            <button
              onClick={() => { if (!item.dropdown) navigate(item.path); else setOpenDropdown(o => o === item.label ? null : item.label); }}
              style={{
                fontSize: 14, fontWeight: 600,
                color: isActive(item.path) ? '#0f172a' : '#0f172a',
                cursor: 'pointer', opacity: isActive(item.path) ? 1 : 0.7,
                background: openDropdown === item.label ? 'rgba(0,0,0,0.05)' : 'transparent',
                border: 'none', borderRadius: 6, padding: '7px 12px',
                display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (openDropdown !== item.label) e.currentTarget.style.opacity = 1; }}
              onMouseLeave={e => { if (!isActive(item.path) && openDropdown !== item.label) e.currentTarget.style.opacity = 0.7; }}>
              {item.label}
              {item.dropdown && <span style={{ fontSize: 10, opacity: 0.5 }}>▾</span>}
            </button>

            {/* Dropdown */}
            {item.dropdown && openDropdown === item.label && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0,
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12,
                boxShadow: '0 16px 48px rgba(0,0,0,0.12)', padding: '8px',
                minWidth: 260, zIndex: 999, animation: 'fadeIn 0.15s',
              }}>
                {item.dropdown.map(d => (
                  <button key={d.label} onClick={() => { navigate(d.path); setOpenDropdown(null); }} style={{
                    width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '10px 12px', borderRadius: 8, border: 'none', background: 'transparent',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{d.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{d.label}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-body)' }}>{d.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right side */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* Login dropdown */}
        <div ref={loginRef} style={{ position: 'relative' }}>
          <button onClick={() => setLoginOpen(o => !o)} style={{
            fontSize: 14, fontWeight: 600, color: '#0f172a', cursor: 'pointer',
            padding: '7px 14px', borderRadius: 6, border: 'none',
            background: loginOpen ? 'rgba(0,0,0,0.06)' : 'transparent',
            textDecoration: 'underline', textUnderlineOffset: 3, transition: 'all 0.15s',
          }}>Login</button>
          {loginOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '6px 0',
              minWidth: 170, zIndex: 999, animation: 'fadeIn 0.15s',
            }}>
              <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '11px 18px', fontSize: 14, fontWeight: 600, color: '#0f172a', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span>📦</span> Shipping app
              </button>
              <button onClick={() => navigate('/login')} style={{ width: '100%', padding: '11px 18px', fontSize: 14, fontWeight: 600, color: '#0f172a', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span>🔌</span> API portal
              </button>
            </div>
          )}
        </div>

        <button onClick={() => navigate('/contact')} style={{
          background: 'transparent', color: '#0f172a', border: '1.5px solid rgba(15,23,42,0.2)',
          borderRadius: 7, padding: '7px 16px', fontSize: 14, fontWeight: 700,
          cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f172a'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(15,23,42,0.2)'; }}>
          Contact sales
        </button>

        <button onClick={() => navigate('/register')} style={{
          background: '#0f172a', color: '#fff', border: 'none',
          borderRadius: 7, padding: '8px 18px', fontSize: 14,
          fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
          onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}>
          Get started
        </button>
      </div>
    </nav>
  );
}
