import React from 'react';
import { useNavigate } from 'react-router-dom';

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { label: 'Overview', path: '/platform' },
      { label: 'Tracking', path: '/platform' },
      { label: 'Fleet Management', path: '/platform' },
      { label: 'API', path: '/resources' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'For Shippers', path: '/solutions' },
      { label: 'For Carriers', path: '/carriers' },
      { label: 'Enterprise', path: '/solutions' },
      { label: 'Pricing', path: '/pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', path: '/resources' },
      { label: 'Guides', path: '/resources' },
      { label: 'Case Studies', path: '/resources' },
      { label: 'Changelog', path: '/resources' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', path: '/about' },
      { label: 'Carriers', path: '/carriers' },
      { label: 'Contact', path: '/contact' },
      { label: 'Newsroom', path: '/about' },
    ],
  },
];

export default function PublicFooter() {
  const navigate = useNavigate();

  return (
    <footer style={{ background: '#0f172a', padding: '64px 60px 36px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 48, marginBottom: 52 }}>
          {/* Brand */}
          <div>
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <div style={{ width: 30, height: 30, borderRadius: 6, background: '#00c896', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 900, fontSize: 14 }}>N</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: '#fff' }}>NexFlow</span>
            </button>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, fontFamily: 'var(--font-body)', marginBottom: 20 }}>
              Smart freight platform connecting shippers and carriers across Europe.
            </p>
            {/* Status badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 5, padding: '4px 10px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#22c55e' }}>All systems operational</span>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
              {col.links.map(l => (
                <button key={l.label} onClick={() => navigate(l.path)} style={{
                  display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.48)', marginBottom: 10,
                  cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'color 0.15s',
                  background: 'none', border: 'none', padding: 0, textAlign: 'left',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.48)'}>
                  {l.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-body)' }}>
            © 2026 NexFlow Technologies SH.P.K. All rights reserved.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Legal', 'Privacy Notice', 'Terms of Use', 'Cookies'].map(l => (
              <span key={l} style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
