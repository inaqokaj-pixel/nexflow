import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const carriers = ['🚛 DHL Express', '✈️ FedEx', '🚢 Maersk', '🚂 DB Cargo', '🏍️ Glovo', '🚐 GLS', '📦 UPS', '🚛 DSV'];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-display)' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 60px', height: 68,
        display: 'flex', alignItems: 'center', gap: 40,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 20 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00c896', fontWeight: 900, fontSize: 16 }}>N</div>
          <span style={{ fontWeight: 900, fontSize: 18, color: '#0f172a', letterSpacing: '-0.02em' }}>NexFlow</span>
        </div>
        {['Platform', 'Carriers', 'Pricing', 'API'].map(l => (
          <span key={l} style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', cursor: 'pointer', opacity: 0.7 }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.7}>{l}</span>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: 14, color: '#0f172a', cursor: 'pointer' }}>Login</button>
          <button onClick={() => navigate('/login')} className="btn btn-green" style={{ borderRadius: 8, padding: '9px 22px', fontSize: 14 }}>Get started</button>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: '2px solid #0f172a', borderRadius: 8, fontWeight: 700, fontSize: 14, color: '#0f172a', padding: '7px 18px', cursor: 'pointer' }}>Contact sales</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: '#00c896', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', paddingTop: 68 }}>
        <div className="grid-bg" />
        {/* Floating carrier bubbles */}
        {[
          { label: 'UPS', color: '#4a2c0a', text: '#fff', top: '18%', left: '6%' },
          { label: 'FedEx', color: '#4d148c', text: '#fff', top: '50%', left: '4%' },
          { label: 'DHL', color: '#ffcc00', text: '#d40511', top: '75%', left: '8%' },
          { label: 'Woo', color: '#7f54b3', text: '#fff', top: '85%', left: '20%' },
          { label: 'GLS', color: '#00539f', text: '#fff', top: '15%', right: '8%' },
          { label: 'eBay', color: '#e53238', text: '#fff', top: '40%', right: '5%' },
          { label: 'Wix', color: '#f7931e', text: '#fff', top: '65%', right: '10%' },
          { label: 'DSV', color: '#cc0000', text: '#fff', top: '82%', right: '22%' },
        ].map(b => (
          <div key={b.label} style={{
            position: 'absolute', top: b.top, left: b.left, right: b.right,
            width: 68, height: 68, borderRadius: '50%',
            background: b.color, color: b.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 900, boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}>{b.label}</div>
        ))}

        <div style={{ textAlign: 'center', padding: '80px 20px 60px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,0,0,0.12)', borderRadius: 50,
            padding: '6px 18px', fontSize: 13, fontWeight: 700, color: '#0f172a',
            marginBottom: 28,
          }}>
            🚀 Now supporting 40+ carriers across Europe
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 72, fontWeight: 900,
            color: '#0f172a', lineHeight: 1.0, letterSpacing: '-0.04em',
            marginBottom: 24, maxWidth: 820, margin: '0 auto 24px',
          }}>
            Your one-stop<br />solution for<br />freight logistics
          </h1>
          <p style={{ fontSize: 18, color: '#0f172a', opacity: 0.7, maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
            Whether you're a shipper moving goods or a carrier growing your fleet, NexFlow gives you the tools to ship smarter.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} className="btn btn-green btn-lg" style={{ borderRadius: 10 }}>
              Get started free →
            </button>
            <button onClick={() => navigate('/login')} style={{ background: 'rgba(0,0,0,0.12)', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 16, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
              See how it works
            </button>
          </div>
        </div>

        {/* Dashboard preview card */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 40px 80px', position: 'relative', zIndex: 2 }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,0.2)', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
            {/* Fake browser bar */}
            <div style={{ background: '#f1f5f9', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #e2e8f0' }}>
              {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
              <div style={{ flex: 1, background: '#fff', borderRadius: 4, margin: '0 12px', padding: '3px 12px', fontSize: 11, color: '#94a3b8', border: '1px solid #e2e8f0' }}>
                localhost:3000/dashboard
              </div>
            </div>
            {/* Dashboard preview */}
            <div style={{ background: '#f8fafc', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
              {[
                { label: 'Total Shipments', value: '1,284', color: '#6c63ff', icon: '📦' },
                { label: 'In Transit', value: '47', color: '#3b82f6', icon: '🚚' },
                { label: 'Delivered', value: '1,201', color: '#22c55e', icon: '✅' },
                { label: 'Revenue', value: '$94,200', color: '#f97316', icon: '💰' },
              ].map(s => (
                <div key={s.label} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Mini map placeholder */}
            <div style={{ margin: '0 20px 20px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: 10, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(0,200,150,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, zIndex: 1 }}>🗺️ Live shipment tracking map</div>
              {[{top:'30%',left:'20%'},{top:'55%',left:'60%'},{top:'25%',left:'75%'}].map((p,i) => (
                <div key={i} style={{ position: 'absolute', top: p.top, left: p.left, width: 10, height: 10, borderRadius: '50%', background: '#00c896', boxShadow: '0 0 0 4px rgba(0,200,150,0.3)', animation: 'pulse 2s ease-in-out infinite', animationDelay: `${i*0.5}s` }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: '#0f172a', padding: '18px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 60, animation: 'marquee 18s linear infinite', width: 'max-content' }}>
          {[...carriers, ...carriers].map((c, i) => (
            <span key={i} style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{c}</span>
          ))}
        </div>
      </div>

      {/* FEATURES SECTION — Shippo style green cards */}
      <section style={{ background: '#00c896', padding: '100px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 16 }}>
            Built for every<br />type of shipper
          </h2>
          <p style={{ fontSize: 16, color: '#0f172a', opacity: 0.7, fontFamily: 'var(--font-body)' }}>From solo businesses to enterprise fleets</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, maxWidth: 1100, margin: '0 auto' }}>
          {[
            { title: 'Small businesses', icon: '🏪', desc: 'Connect with verified carriers, get the best rates, and track every shipment from pickup to delivery.' },
            { title: 'High volume shippers', icon: '🏭', desc: 'Handle shipping at scale. Book multiple shipments, manage routes, and get volume discounts.' },
            { title: 'Carrier partners', icon: '🚛', desc: 'List your fleet, manage bookings, and grow your revenue. Accept jobs with one click.' },
          ].map((f, i) => (
            <div key={f.title} style={{
              background: '#0f172a', padding: '48px 40px',
              borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : 0,
            }}>
              <div style={{ fontSize: 48, marginBottom: 24 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 14 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: '#fff', padding: '100px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', maxWidth: 500 }}>
              Ship in 3 simple steps
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40 }}>
            {[
              { n: '01', title: 'Register & choose role', desc: 'Sign up as a shipper or carrier. Set up your profile in under 2 minutes.', icon: '👤' },
              { n: '02', title: 'Book or list vehicles', desc: 'Shippers book from available fleet. Carriers list their vehicles with capacity and location.', icon: '📋' },
              { n: '03', title: 'Track in real-time', desc: 'Follow your shipment on a live map. Get email notifications at every milestone.', icon: '📍' },
            ].map(s => (
              <div key={s.n}>
                <div style={{ fontSize: 44, marginBottom: 16 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 900, color: '#f1f5f9', lineHeight: 1, marginBottom: 8 }}>{s.n}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section style={{ background: '#0f172a', padding: '80px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40, textAlign: 'center' }}>
          {[
            { value: '40+', label: 'Global Carriers' },
            { value: '6', label: 'Microservices' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '<1s', label: 'Booking Speed' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 900, color: '#00c896', lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#00c896', padding: '100px 60px', textAlign: 'center' }}>
        <div className="grid-bg" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 56, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 20 }}>
          Ready to ship smarter?
        </h2>
        <p style={{ fontSize: 18, color: '#0f172a', opacity: 0.7, marginBottom: 40, fontFamily: 'var(--font-body)' }}>
          Join NexFlow today. No credit card required.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button onClick={() => navigate('/login')} className="btn btn-green btn-lg" style={{ borderRadius: 10, fontSize: 16 }}>
            Start shipping free →
          </button>
          <button onClick={() => navigate('/login')} style={{ background: 'rgba(0,0,0,0.12)', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 16, fontWeight: 700, color: '#0f172a', cursor: 'pointer' }}>
            Sign in
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0f172a', padding: '60px 60px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 30, height: 30, borderRadius: 6, background: '#00c896', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 900, fontSize: 14 }}>N</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 16, color: '#fff' }}>NexFlow</span>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', maxWidth: 240, lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
              Smart freight platform connecting shippers and carriers across Europe.
            </p>
          </div>
          {[
            { title: 'Platform', links: ['Dashboard', 'Tracking', 'Payments', 'Fleet Management'] },
            { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Cookies'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 10, cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-body)' }}>
          <span>© 2026 NexFlow. All rights reserved.</span>
          <span>Built with microservices ❤️</span>
        </div>
      </footer>
    </div>
  );
}
