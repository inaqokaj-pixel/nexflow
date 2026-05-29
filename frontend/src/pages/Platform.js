import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const features = [
  {
    tag: 'Smart Booking',
    title: 'Compare 40+ carriers in one click',
    desc: 'Stop calling carriers one by one. Enter your shipment details and instantly see prices, transit times, and ratings from every carrier in our network — side by side.',
    bullets: ['Instant rate comparison', 'Filter by speed, price, or rating', 'One-click confirm & book', 'Automatic carrier notification'],
    color: '#6c63ff',
    visual: 'booking',
  },
  {
    tag: 'Live Tracking',
    title: 'Know exactly where your shipment is',
    desc: 'Real-time GPS updates every 30 seconds. Your customers get a live tracking link the moment a shipment is picked up — no login required.',
    bullets: ['Live GPS map updates', 'Automated SMS & email alerts', 'Shareable tracking link', 'Delivery confirmation photo'],
    color: '#00c896',
    visual: 'tracking',
  },
  {
    tag: 'Fleet Management',
    title: 'Carriers: run a tighter operation',
    desc: 'Every vehicle, every driver, every job — managed from one dashboard. Accept jobs, track your fleet, and get paid. No paperwork, no invoicing.',
    bullets: ['Live fleet map overview', 'Driver assignment & job dispatch', 'Load capacity management', '48-hour automatic payments'],
    color: '#f97316',
    visual: 'fleet',
  },
  {
    tag: 'Analytics',
    title: 'Data that actually helps you decide',
    desc: 'Understand where your money goes, which carriers perform best, and where to optimize. Built-in reports for shippers, carriers, and finance teams.',
    bullets: ['Cost breakdown by carrier & route', 'On-time delivery trends', 'Carrier performance scoring', 'Export to CSV or PDF'],
    color: '#0d9488',
    visual: 'analytics',
  },
];

const visuals = {
  booking: (
    <div style={{ background: '#0f172a', borderRadius: 14, padding: 24, fontFamily: 'var(--font-body)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>CARRIER COMPARISON</div>
      {[
        { name: 'DHL Express', price: '€34.20', time: 'Next day', rating: 4.9, best: true },
        { name: 'GLS Parcel', price: '€21.50', time: '2–3 days', rating: 4.7, best: false },
        { name: 'UPS Standard', price: '€28.80', time: '2 days', rating: 4.8, best: false },
      ].map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: c.best ? 'rgba(0,200,150,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${c.best ? 'rgba(0,200,150,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 9, marginBottom: 8 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🚛</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{c.name}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{c.time} · ⭐ {c.rating}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: c.best ? '#00c896' : '#fff' }}>{c.price}</div>
            {c.best && <div style={{ fontSize: 10, color: '#00c896', fontWeight: 700 }}>BEST PRICE</div>}
          </div>
        </div>
      ))}
      <button style={{ width: '100%', marginTop: 8, background: '#00c896', color: '#0f172a', border: 'none', borderRadius: 8, padding: '11px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Book DHL Express →</button>
    </div>
  ),
  tracking: (
    <div style={{ background: '#0f172a', borderRadius: 14, padding: 24, fontFamily: 'var(--font-body)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>LIVE TRACKING — NX-2847</div>
      <div style={{ background: 'rgba(0,200,150,0.08)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 10, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,200,150,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,150,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ fontSize: 28 }}>🚛</div>
          <div style={{ fontSize: 11, color: '#00c896', fontWeight: 700, marginTop: 4 }}>En route · 47 km away</div>
        </div>
      </div>
      {[
        { label: 'Picked up', time: '08:30', done: true },
        { label: 'Tirana hub scan', time: '10:15', done: true },
        { label: 'In transit', time: '11:00', done: true },
        { label: 'Out for delivery', time: 'ETA 14:20', done: false },
      ].map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: s.done ? '#00c896' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, flexShrink: 0 }}>{s.done ? '✓' : ''}</div>
          <div style={{ flex: 1, fontSize: 12, color: s.done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)', fontWeight: s.done ? 600 : 400 }}>{s.label}</div>
          <div style={{ fontSize: 11, color: s.done ? '#00c896' : 'rgba(255,255,255,0.3)' }}>{s.time}</div>
        </div>
      ))}
    </div>
  ),
  fleet: (
    <div style={{ background: '#0f172a', borderRadius: 14, padding: 24, fontFamily: 'var(--font-body)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>FLEET OVERVIEW — 8 VEHICLES</div>
      {[
        { id: 'TR-01', driver: 'A. Koci', status: 'On job', load: '85%', color: '#00c896' },
        { id: 'TR-02', driver: 'M. Hoxha', status: 'Available', load: '0%', color: '#22c55e' },
        { id: 'TR-03', driver: 'D. Basha', status: 'On job', load: '60%', color: '#00c896' },
        { id: 'TR-04', driver: 'E. Doci', status: 'Maintenance', load: '—', color: '#f59e0b' },
      ].map((v, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 8, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 18 }}>🚛</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{v.id} <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>· {v.driver}</span></div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>Load: {v.load}</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: v.color, background: v.color + '18', padding: '3px 9px', borderRadius: 5 }}>{v.status}</div>
        </div>
      ))}
      <div style={{ marginTop: 12, display: 'flex', gap: 12 }}>
        <div style={{ flex: 1, background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.2)', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#00c896' }}>6</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>ACTIVE</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b' }}>2</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>IDLE</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)', borderRadius: 8, padding: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#a78bfa' }}>€2.4k</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>THIS WEEK</div>
        </div>
      </div>
    </div>
  ),
  analytics: (
    <div style={{ background: '#0f172a', borderRadius: 14, padding: 24, fontFamily: 'var(--font-body)' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>SHIPPING ANALYTICS — MAY 2026</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { label: 'Total shipments', value: '347', delta: '+12%', good: true },
          { label: 'Avg cost/shipment', value: '€14.20', delta: '−8%', good: true },
          { label: 'On-time rate', value: '96.4%', delta: '+1.2%', good: true },
          { label: 'Avg transit time', value: '1.8 days', delta: '−0.3d', good: true },
        ].map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '12px' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#00c896', marginTop: 4, fontWeight: 700 }}>{s.delta}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>COST BY CARRIER (MAY)</div>
      {[
        { name: 'DHL Express', pct: 42, cost: '€2,180' },
        { name: 'GLS Parcel', pct: 31, cost: '€1,610' },
        { name: 'UPS', pct: 27, cost: '€1,400' },
      ].map((c, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}><span>{c.name}</span><span>{c.cost}</span></div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
            <div style={{ height: '100%', width: `${c.pct}%`, background: '#00c896', borderRadius: 3 }} />
          </div>
        </div>
      ))}
    </div>
  ),
};

const stats = [
  { value: '40+', label: 'Carrier partners', icon: '🚛' },
  { value: '<1s', label: 'Quote time', icon: '⚡' },
  { value: '99.9%', label: 'Uptime SLA', icon: '🛡️' },
  { value: '30s', label: 'GPS refresh', icon: '📍' },
  { value: '48h', label: 'Carrier payment', icon: '💰' },
  { value: '12', label: 'Countries', icon: '🌍' },
];

const integrations = [
  { name: 'Shopify', desc: 'Auto-book on order', icon: '🛒' },
  { name: 'WooCommerce', desc: 'Sync your store', icon: '📦' },
  { name: 'Zapier', desc: '1,000+ automations', icon: '⚡' },
  { name: 'Slack', desc: 'Shipment alerts', icon: '💬' },
  { name: 'QuickBooks', desc: 'Automated billing', icon: '📊' },
  { name: 'REST API', desc: 'Build anything', icon: '🔌' },
];

export default function Platform() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-display)', overflowX: 'hidden', background: '#fff' }}>
      <PublicNav scrolled={scrolled} />

      {/* Hero */}
      <section style={{ background: '#0f172a', padding: '140px 60px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,200,150,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -120, left: '50%', transform: 'translateX(-50%)', width: 800, height: 300, background: 'radial-gradient(ellipse, rgba(0,200,150,0.12), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,200,150,0.12)', border: '1px solid rgba(0,200,150,0.25)', borderRadius: 50, padding: '6px 20px', fontSize: 13, fontWeight: 700, color: '#00c896', marginBottom: 32 }}>
            ✦ The NexFlow Platform
          </div>
          <h1 style={{ fontSize: 68, fontWeight: 900, color: '#fff', lineHeight: 1.02, letterSpacing: '-0.045em', marginBottom: 24 }}>
            Freight that moves<br />at the speed of now
          </h1>
          <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>
            One platform to quote, book, track, and pay for every shipment. Built for shippers who can't afford to waste time.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => navigate('/register')} style={{ background: '#00c896', color: '#0f172a', border: 'none', borderRadius: 10, padding: '15px 30px', fontSize: 15, fontWeight: 800, cursor: 'pointer', transition: 'transform 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              Start for free →
            </button>
            <button onClick={() => navigate('/pricing')} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: 10, padding: '15px 30px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              See pricing
            </button>
          </div>

          {/* Trust bar */}
          <div style={{ marginTop: 64, display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature deep-dives */}
      <section style={{ background: '#fff', padding: '100px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>EVERYTHING YOU NEED</div>
            <h2 style={{ fontSize: 48, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.035em', lineHeight: 1.1 }}>
              One platform, built end-to-end
            </h2>
          </div>

          {/* Feature tabs */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 56, flexWrap: 'wrap' }}>
            {features.map((f, i) => (
              <button key={i} onClick={() => setActiveFeature(i)} style={{
                padding: '9px 20px', borderRadius: 8, border: '1.5px solid',
                borderColor: activeFeature === i ? features[i].color : '#e2e8f0',
                background: activeFeature === i ? features[i].color + '10' : '#fff',
                color: activeFeature === i ? features[i].color : '#64748b',
                fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {f.tag}
              </button>
            ))}
          </div>

          {/* Active feature */}
          {features.map((f, i) => i === activeFeature && (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center', animation: 'fadeIn 0.25s' }}>
              <div>
                <div style={{ display: 'inline-block', background: f.color + '15', color: f.color, borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700, marginBottom: 20, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {f.tag}
                </div>
                <h3 style={{ fontSize: 38, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 18 }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.75, fontFamily: 'var(--font-body)', marginBottom: 28 }}>{f.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
                  {f.bullets.map(b => (
                    <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: f.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: f.color, fontWeight: 900, flexShrink: 0 }}>✓</div>
                      <span style={{ fontSize: 14, color: '#475569', fontFamily: 'var(--font-body)' }}>{b}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/register')} style={{ background: f.color, color: '#fff', border: 'none', borderRadius: 9, padding: '13px 26px', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.88}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                  Try it free →
                </button>
              </div>
              <div>{visuals[f.visual]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#f8fafc', padding: '90px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>Ship in 3 steps</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, position: 'relative' }}>
            {[
              { n: '1', icon: '📦', title: 'Describe your shipment', desc: 'Enter pickup, delivery, weight, and dimensions. Takes 60 seconds.' },
              { n: '2', icon: '⚡', title: 'Pick your carrier', desc: 'Compare real-time prices and transit times. Choose and confirm with one click.' },
              { n: '3', icon: '📍', title: 'Track until delivered', desc: 'Live GPS updates from pickup to doorstep. Your customer gets a tracking link automatically.' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '32px 28px', position: 'relative' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0f172a', color: '#00c896', fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>{s.n}</div>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>{s.desc}</p>
                {i < 2 && <div style={{ position: 'absolute', top: '50%', right: -20, transform: 'translateY(-50%)', fontSize: 22, color: '#cbd5e1', zIndex: 2 }}>→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section style={{ background: '#fff', padding: '90px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>INTEGRATIONS</div>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 14 }}>Plugs into your stack</h2>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 48, fontFamily: 'var(--font-body)', maxWidth: 460, margin: '0 auto 48px' }}>NexFlow works with the tools you already use. Or use the API to build anything.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 36 }}>
            {integrations.map(int => (
              <div key={int.name} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 12px', textAlign: 'center', transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f172a'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{int.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 3 }}>{int.name}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-body)' }}>{int.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/resources')} style={{ background: 'transparent', color: '#0f172a', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f172a'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}>
            View API documentation →
          </button>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0f172a', padding: '100px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(0,200,150,0.1), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 18, lineHeight: 1.1 }}>See it in action</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 40, fontFamily: 'var(--font-body)', maxWidth: 440, margin: '0 auto 40px' }}>Free account. No credit card. Your first shipment booked in under 5 minutes.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button onClick={() => navigate('/register')} style={{ background: '#00c896', color: '#0f172a', border: 'none', borderRadius: 10, padding: '15px 32px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Create free account →</button>
            <button onClick={() => navigate('/contact')} style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '15px 32px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Book a demo</button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
