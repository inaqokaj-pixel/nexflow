import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const carriers = ['DHL Express', 'FedEx', 'Maersk', 'DB Cargo', 'Glovo', 'GLS', 'UPS', 'DSV', 'TNT', 'Rhenus'];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e) => { if (loginRef.current && !loginRef.current.contains(e.target)) setLoginOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-display)', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 48px', height: 68,
        display: 'flex', alignItems: 'center',
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : 'none',
        transition: 'all 0.25s',
      }}>
        {/* Logo */}
        <a onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', textDecoration: 'none', marginRight: 36 }}>
          <div style={{ width: 32, height: 32, borderRadius: 7, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00c896', fontWeight: 900, fontSize: 15 }}>N</div>
          <span style={{ fontWeight: 900, fontSize: 17, color: '#0f172a', letterSpacing: '-0.02em' }}>NexFlow</span>
        </a>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[
            { label: 'Platform', path: '/platform' },
            { label: 'Carriers', path: '/carriers' },
            { label: 'Solutions', path: '/solutions' },
            { label: 'Pricing', path: '/pricing' },
            { label: 'Resources', path: '/resources' },
          ].map(l => (
            <button key={l.label} onClick={() => navigate(l.path)} style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', cursor: 'pointer', opacity: 0.72, transition: 'opacity 0.15s', background: 'transparent', border: 'none', padding: '7px 12px', borderRadius: 6 }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.72}>{l.label}</button>
          ))}
        </div>

        {/* Right side */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Login dropdown */}
          <div ref={loginRef} style={{ position: 'relative' }}>
            <div onClick={() => setLoginOpen(o => !o)} style={{
              fontSize: 14, fontWeight: 600, color: '#0f172a', cursor: 'pointer',
              padding: '7px 14px', borderRadius: 6,
              background: loginOpen ? 'rgba(0,0,0,0.06)' : 'transparent',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}>Login</div>
            {loginOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', padding: '6px 0',
                minWidth: 160, zIndex: 999,
              }}>
                <div onClick={() => navigate('/login')} style={dropLinkStyle}>Shipping app</div>
                <div onClick={() => navigate('/login')} style={dropLinkStyle}>API portal</div>
              </div>
            )}
          </div>
          <button onClick={() => navigate('/register')} style={navBtnOutline}>Contact sales</button>
          <button onClick={() => navigate('/register')} style={navBtnPrimary}>Get started</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        background: '#00c896', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', paddingTop: 68,
      }}>
        {/* dot grid */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 60px 60px', display: 'flex', alignItems: 'center', gap: 60, position: 'relative', zIndex: 2, width: '100%' }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.10)', borderRadius: 50, padding: '5px 16px', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 28 }}>
              🚀 Now supporting 40+ carriers across Europe
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 900, color: '#0f172a', lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 22 }}>
              Your one-stop<br />solution for<br />freight logistics
            </h1>
            <p style={{ fontSize: 17, color: '#0f172a', opacity: 0.7, maxWidth: 440, lineHeight: 1.65, marginBottom: 36, fontFamily: 'var(--font-body)' }}>
              Whether you're a shipper moving goods or a carrier growing your fleet, NexFlow gives you scalable tools, the best rates, and real-time tracking.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} style={heroBtnPrimary}>Get started free →</button>
              <button onClick={() => navigate('/login')} style={heroBtnSecondary}>Contact an expert</button>
            </div>
          </div>

          {/* Right — dashboard preview */}
          <div style={{ flex: 1, minWidth: 0, maxWidth: 520 }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 32px 80px rgba(0,0,0,0.22)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
              {/* Browser bar */}
              <div style={{ background: '#f1f5f9', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #e2e8f0' }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
                <div style={{ flex: 1, background: '#fff', borderRadius: 4, margin: '0 10px', padding: '2px 10px', fontSize: 11, color: '#94a3b8', border: '1px solid #e2e8f0' }}>nexflow.app/dashboard</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px' }}>
                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 12 }}>
                  {[
                    { label: 'Total Shipments', value: '1,284', color: '#6c63ff', icon: '📦' },
                    { label: 'In Transit', value: '47', color: '#3b82f6', icon: '🚚' },
                    { label: 'Delivered', value: '1,201', color: '#22c55e', icon: '✅' },
                    { label: 'Revenue', value: '$94,200', color: '#f97316', icon: '💰' },
                  ].map(s => (
                    <div key={s.label} style={{ background: '#fff', borderRadius: 8, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 16, marginBottom: 4 }}>{s.icon}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* Map strip */}
                <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: 8, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(0,200,150,0.12) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, zIndex: 1 }}>🗺️ Live shipment tracking</span>
                  {[{top:'30%',left:'22%'},{top:'55%',left:'58%'},{top:'28%',left:'73%'}].map((p, i) => (
                    <div key={i} style={{ position: 'absolute', top: p.top, left: p.left, width: 9, height: 9, borderRadius: '50%', background: '#00c896', boxShadow: '0 0 0 4px rgba(0,200,150,0.3)', animation: 'pulse 2s ease-in-out infinite', animationDelay: `${i * 0.5}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARRIER MARQUEE ── */}
      <div style={{ background: '#0f172a', padding: '16px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 56, animation: 'marquee 20s linear infinite', width: 'max-content' }}>
          {[...carriers, ...carriers].map((c, i) => (
            <span key={i} style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>● {c}</span>
          ))}
        </div>
      </div>

      {/* ── AUDIENCE CARDS ── */}
      <section style={{ background: '#00c896', padding: '80px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 12 }}>Built for every type of shipper</h2>
            <p style={{ fontSize: 16, color: '#0f172a', opacity: 0.65 }}>From solo businesses to enterprise fleets</p>
          </header>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { title: 'Small businesses', icon: '🏪', desc: 'Connect with verified carriers, get the best rates, and track every shipment from pickup to delivery.', cta: 'Get started', link: '/register' },
              { title: 'High volume shippers', icon: '🏭', desc: 'Handle shipping at scale. Book multiple shipments, manage routes, and get volume discounts automatically.', cta: 'Learn more', link: '/login' },
              { title: 'Carrier partners', icon: '🚛', desc: 'List your fleet, manage bookings, and grow your revenue. Accept jobs with one click from the dashboard.', cta: 'Join as carrier', link: '/register' },
            ].map(card => (
              <div key={card.title} style={{ background: '#fff', borderRadius: 14, padding: '36px 30px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{card.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, fontFamily: 'var(--font-body)', flex: 1, marginBottom: 24 }}>{card.desc}</p>
                <button onClick={() => navigate(card.link)} style={cardBtn}>{card.cta}</button>
                <div style={{ marginTop: 14, textAlign: 'center' }}>
                  <span onClick={() => navigate('/login')} style={{ fontSize: 13, color: '#0f172a', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 2 }}>Learn more</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#0d9488', padding: '72px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <header style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10 }}>A platform built to scale</h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>Our infrastructure powers thousands of shipments every day</p>
          </header>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, textAlign: 'center' }}>
            {[
              { value: '40+', label: 'Global Carriers' },
              { value: '6', label: 'Microservices' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '<1s', label: 'Booking Speed' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#fff', padding: '100px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>HOW IT WORKS</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', maxWidth: 480 }}>Ship in 3 simple steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 48 }}>
            {[
              { n: '01', title: 'Register & choose role', desc: 'Sign up as a shipper or carrier. Set up your profile in under 2 minutes.', icon: '👤' },
              { n: '02', title: 'Book or list vehicles', desc: 'Shippers book from available fleet. Carriers list their vehicles with capacity and route.', icon: '📋' },
              { n: '03', title: 'Track in real-time', desc: 'Follow your shipment on a live map. Get notifications at every milestone.', icon: '📍' },
            ].map(s => (
              <div key={s.n}>
                <div style={{ fontSize: 42, marginBottom: 14 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, color: '#f1f5f9', lineHeight: 1, marginBottom: 6 }}>{s.n}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: '#00c896', padding: '90px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 54, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 16 }}>
            Get started today
          </h2>
          <p style={{ fontSize: 17, color: '#0f172a', opacity: 0.65, marginBottom: 36, fontFamily: 'var(--font-body)' }}>
            Everything you need for professional-grade freight logistics.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button onClick={() => navigate('/register')} style={heroBtnPrimary}>Get started free →</button>
            <button onClick={() => navigate('/login')} style={heroBtnSecondary}>Sign in</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0f172a', padding: '64px 60px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 1fr', gap: 48, marginBottom: 52 }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: 6, background: '#00c896', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 900, fontSize: 14 }}>N</div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: '#fff' }}>NexFlow</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>
                Smart freight platform connecting shippers and carriers across Europe.
              </p>
            </div>
            {/* Columns */}
            {[
              { title: 'Platform', links: [{ l: 'Overview', p: '/platform' }, { l: 'Tracking', p: '/platform' }, { l: 'Fleet Management', p: '/platform' }, { l: 'API', p: '/resources' }] },
              { title: 'Solutions', links: [{ l: 'For Shippers', p: '/solutions' }, { l: 'For Carriers', p: '/carriers' }, { l: 'Enterprise', p: '/solutions' }, { l: 'Pricing', p: '/pricing' }] },
              { title: 'Resources', links: [{ l: 'Guides', p: '/resources' }, { l: 'API Docs', p: '/resources' }, { l: 'Changelog', p: '/resources' }, { l: 'Case Studies', p: '/resources' }] },
              { title: 'Company', links: [{ l: 'About', p: '/about' }, { l: 'Carriers', p: '/carriers' }, { l: 'Contact', p: '/contact' }, { l: 'Newsroom', p: '/about' }] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
                {col.links.map(item => (
                  <div key={item.l} onClick={() => navigate(item.p)} style={{ fontSize: 13, color: 'rgba(255,255,255,0.48)', marginBottom: 10, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.48)'}>{item.l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'rgba(255,255,255,0.22)', fontFamily: 'var(--font-body)' }}>
            <span>© 2026 NexFlow. All rights reserved.</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <span style={{ cursor: 'pointer' }}>Legal</span>
              <span style={{ cursor: 'pointer' }}>Privacy Notice</span>
              <span style={{ cursor: 'pointer' }}>Terms of Use</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Shared style objects ── */
const dropLinkStyle = {
  padding: '9px 18px', fontSize: 14, fontWeight: 500, color: '#0f172a',
  cursor: 'pointer', transition: 'background 0.12s',
  onMouseEnter: undefined,
};

const navBtnPrimary = {
  background: '#0f172a', color: '#fff', border: 'none',
  borderRadius: 7, padding: '8px 18px', fontSize: 14,
  fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)',
};

const navBtnOutline = {
  background: 'transparent', color: '#0f172a',
  border: '2px solid rgba(15,23,42,0.25)',
  borderRadius: 7, padding: '6px 16px', fontSize: 14,
  fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)',
};

const heroBtnPrimary = {
  background: '#0f172a', color: '#fff', border: 'none',
  borderRadius: 9, padding: '14px 26px', fontSize: 15,
  fontWeight: 800, cursor: 'pointer', fontFamily: 'var(--font-display)',
};

const heroBtnSecondary = {
  background: 'rgba(0,0,0,0.11)', color: '#0f172a', border: 'none',
  borderRadius: 9, padding: '14px 26px', fontSize: 15,
  fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)',
};

const cardBtn = {
  width: '100%', background: '#0f172a', color: '#fff', border: 'none',
  borderRadius: 8, padding: '11px', fontSize: 14,
  fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-display)',
};