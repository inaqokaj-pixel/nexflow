import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

export default function NotFound() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-display)', background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNav scrolled={scrolled} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 40px 80px', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', maxWidth: 560 }}>
          {/* Big 404 */}
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 140, fontWeight: 900,
            color: '#e2e8f0', lineHeight: 1, marginBottom: 0, letterSpacing: '-0.06em',
            userSelect: 'none',
          }}>404</div>

          <div style={{ fontSize: 40, marginBottom: 16, marginTop: -16 }}>📦</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 14 }}>
            This shipment got lost
          </h1>
          <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7, fontFamily: 'var(--font-body)', marginBottom: 36 }}>
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/')} style={{
              background: '#0f172a', color: '#fff', border: 'none', borderRadius: 9,
              padding: '13px 26px', fontSize: 15, fontWeight: 800, cursor: 'pointer',
            }}>← Back to home</button>
            <button onClick={() => navigate('/contact')} style={{
              background: '#f8fafc', color: '#0f172a', border: '1.5px solid #e2e8f0', borderRadius: 9,
              padding: '13px 26px', fontSize: 15, fontWeight: 700, cursor: 'pointer',
            }}>Contact support</button>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: 48, borderTop: '1px solid #e2e8f0', paddingTop: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Helpful links</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'Solutions', path: '/solutions' },
                { label: 'Platform', path: '/platform' },
                { label: 'Pricing', path: '/pricing' },
                { label: 'Resources', path: '/resources' },
                { label: 'About', path: '/about' },
              ].map(l => (
                <button key={l.label} onClick={() => navigate(l.path)} style={{
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6,
                  padding: '7px 16px', fontSize: 13, fontWeight: 700, color: '#475569',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f172a'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
