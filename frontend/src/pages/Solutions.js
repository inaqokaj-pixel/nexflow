import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const solutions = [
  {
    id: 'shippers',
    icon: '📦',
    tag: 'For Shippers',
    title: 'Ship smarter, pay less',
    subtitle: 'From single parcels to full truckloads — NexFlow finds you the best carrier at the best price, every time.',
    color: '#6c63ff',
    light: '#ede9ff',
    features: [
      { icon: '⚡', title: 'Instant quotes', desc: 'Compare rates across 40+ carriers in under a second. No phone calls, no waiting.' },
      { icon: '📍', title: 'Real-time tracking', desc: 'Live GPS tracking on every shipment. Automated notifications at every milestone.' },
      { icon: '📋', title: 'Booking management', desc: 'Manage all your shipments from a single dashboard. Export reports, filter by status, date, or carrier.' },
      { icon: '💳', title: 'Consolidated billing', desc: 'One invoice for all carriers. Multiple payment methods. Full audit trail.' },
    ],
    cta: 'Start shipping',
    link: '/register',
    stats: [{ v: '40+', l: 'Carriers' }, { v: '<1s', l: 'Quote time' }, { v: '30%', l: 'Avg savings' }],
  },
  {
    id: 'carriers',
    icon: '🚛',
    tag: 'For Carriers',
    title: 'Fill your trucks. Grow your fleet.',
    subtitle: 'List your capacity, accept jobs with one click, and get paid faster — all from the NexFlow carrier portal.',
    color: '#f97316',
    light: '#fff7ed',
    features: [
      { icon: '📡', title: 'Live job feed', desc: 'Real-time shipment requests matched to your routes and capacity. Accept or decline instantly.' },
      { icon: '🚚', title: 'Fleet management', desc: 'Track all your vehicles, assign drivers, and monitor utilization from one screen.' },
      { icon: '💰', title: 'Fast payments', desc: 'Get paid within 48 hours of confirmed delivery. No invoice chasing.' },
      { icon: '📈', title: 'Revenue analytics', desc: 'Understand your earnings, best routes, and peak demand periods with built-in analytics.' },
    ],
    cta: 'Join as carrier',
    link: '/register',
    stats: [{ v: '2x', l: 'More loads' }, { v: '48h', l: 'Payment' }, { v: '0%', l: 'Commission' }],
  },
  {
    id: 'enterprise',
    icon: '🏢',
    tag: 'Enterprise',
    title: 'Logistics at scale',
    subtitle: 'Custom integrations, dedicated account management, SLA guarantees, and volume pricing for high-growth businesses.',
    color: '#0d9488',
    light: '#f0fdf4',
    features: [
      { icon: '🔌', title: 'API-first integration', desc: 'REST API and webhooks to integrate NexFlow directly into your WMS, ERP, or e-commerce platform.' },
      { icon: '🛡️', title: 'SLA guarantees', desc: '99.9% uptime. Dedicated support. Custom escalation paths for mission-critical logistics.' },
      { icon: '👥', title: 'Multi-user accounts', desc: 'Team roles, permissions, approval workflows, and cost center management.' },
      { icon: '📊', title: 'Custom reporting', desc: 'White-label reports, custom KPIs, and data exports in any format your team needs.' },
    ],
    cta: 'Contact sales',
    link: '/contact',
    stats: [{ v: '99.9%', l: 'Uptime' }, { v: 'REST', l: 'API' }, { v: '24/7', l: 'Support' }],
  },
];

const useCases = [
  { icon: '🛒', title: 'E-commerce', desc: 'Connect your Shopify or WooCommerce store. Automated booking when orders are placed.' },
  { icon: '🏗️', title: 'Construction', desc: 'Move heavy equipment and materials with verified specialist carriers across Europe.' },
  { icon: '❄️', title: 'Cold chain', desc: 'Temperature-controlled shipments tracked end-to-end with compliance documentation.' },
  { icon: '🌿', title: 'Agriculture', desc: 'Seasonal capacity planning, bulk loads, and cross-border documentation made simple.' },
  { icon: '🏥', title: 'Healthcare', desc: 'Time-sensitive medical supplies with priority routing and full chain of custody.' },
  { icon: '⚙️', title: 'Manufacturing', desc: 'JIT delivery scheduling, supplier logistics, and return management at scale.' },
];

export default function Solutions() {
  const navigate = useNavigate();
  const [active, setActive] = useState('shippers');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const sol = solutions.find(s => s.id === active);

  return (
    <div style={{ fontFamily: 'var(--font-display)', overflowX: 'hidden', background: '#fff' }}>
      <PublicNav scrolled={scrolled} />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '140px 60px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,200,150,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,200,150,0.12)', border: '1px solid rgba(0,200,150,0.25)', borderRadius: 50, padding: '5px 18px', fontSize: 13, fontWeight: 700, color: '#00c896', marginBottom: 28 }}>
            ⚡ Solutions for every logistics need
          </div>
          <h1 style={{ fontSize: 62, fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 22 }}>
            One platform,<br />every shipment
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
            Whether you're moving parcels, pallets, or full truckloads — NexFlow has the tools and the carrier network to make it happen.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => navigate('/register')} style={{ background: '#00c896', color: '#0f172a', border: 'none', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
              Get started free →
            </button>
            <button onClick={() => navigate('/contact')} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Talk to sales
            </button>
          </div>
        </div>
      </section>

      {/* Solution Tabs */}
      <section style={{ background: '#f8fafc', padding: '80px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 8, background: '#e2e8f0', borderRadius: 12, padding: 6, marginBottom: 56, width: 'fit-content', margin: '0 auto 56px' }}>
            {solutions.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} style={{
                padding: '10px 24px', borderRadius: 8, border: 'none',
                background: active === s.id ? '#fff' : 'transparent',
                color: active === s.id ? '#0f172a' : '#64748b',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                boxShadow: active === s.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.2s',
              }}>
                {s.icon} {s.tag}
              </button>
            ))}
          </div>

          {/* Active solution */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', background: sol.light, color: sol.color, borderRadius: 6, padding: '4px 12px', fontSize: 12, fontWeight: 700, marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {sol.tag}
              </div>
              <h2 style={{ fontSize: 42, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 16, lineHeight: 1.1 }}>{sol.title}</h2>
              <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, marginBottom: 32, fontFamily: 'var(--font-body)' }}>{sol.subtitle}</p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 24, marginBottom: 36 }}>
                {sol.stats.map(s => (
                  <div key={s.l}>
                    <div style={{ fontSize: 30, fontWeight: 900, color: sol.color, lineHeight: 1 }}>{s.v}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.l}</div>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate(sol.link)} style={{ background: sol.color, color: '#fff', border: 'none', borderRadius: 9, padding: '13px 26px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                {sol.cta} →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {sol.features.map(f => (
                <div key={f.title} style={{ background: '#fff', borderRadius: 12, padding: '22px', border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section style={{ background: '#fff', padding: '90px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>INDUSTRIES</div>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>Built for your industry</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {useCases.map(u => (
              <div key={u.title} style={{ padding: '28px', border: '1px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#00c896'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{u.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{u.title}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>{u.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#00c896', padding: '90px 60px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 50, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 16 }}>Ready to get started?</h2>
          <p style={{ fontSize: 17, color: 'rgba(15,23,42,0.65)', marginBottom: 36, fontFamily: 'var(--font-body)' }}>Join thousands of businesses already using NexFlow.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <button onClick={() => navigate('/register')} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Get started free →</button>
            <button onClick={() => navigate('/contact')} style={{ background: 'rgba(0,0,0,0.1)', color: '#0f172a', border: 'none', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Contact sales</button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
