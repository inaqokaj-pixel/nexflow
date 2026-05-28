import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const pillars = [
  {
    icon: '📡',
    title: 'Real-time tracking engine',
    desc: 'Every shipment is tracked live using GPS telemetry from carrier vehicles. Location updates every 30 seconds. Geofence alerts when shipments enter or leave defined zones.',
    details: ['GPS telemetry integration', 'Sub-minute location updates', 'Geofence notifications', 'Historical route playback'],
    color: '#6c63ff',
  },
  {
    icon: '🏗️',
    title: 'Microservices architecture',
    desc: 'NexFlow is built as 6 independent microservices: API Gateway, Customer Service, Booking Service, Carrier Service, Tracking Service, and Notification Service.',
    details: ['6 isolated services', 'RabbitMQ event bus', 'Docker & Kubernetes ready', 'Zero-downtime deploys'],
    color: '#00c896',
  },
  {
    icon: '🔌',
    title: 'API-first design',
    desc: 'Every feature is available via our REST API. Build custom integrations, automate workflows, or white-label the entire platform for your customers.',
    details: ['Full REST API', 'Webhook events', 'SDK for Node.js', 'OpenAPI spec'],
    color: '#f97316',
  },
  {
    icon: '🔐',
    title: 'Security & compliance',
    desc: 'Enterprise-grade security with JWT authentication, role-based access control, and full audit logging. GDPR-compliant data handling.',
    details: ['JWT + refresh tokens', 'RBAC with 3 roles', 'End-to-end encryption', 'GDPR compliant'],
    color: '#0d9488',
  },
];

const services = [
  { name: 'API Gateway', port: 3000, desc: 'Central entry point. Rate limiting, auth validation, request routing.', icon: '🔀', status: 'live' },
  { name: 'Customer Service', port: 3001, desc: 'User registration, authentication, profile management, JWT issuance.', icon: '👤', status: 'live' },
  { name: 'Booking Service', port: 3002, desc: 'Shipment bookings, status lifecycle, pricing engine, quote generation.', icon: '📋', status: 'live' },
  { name: 'Carrier Service', port: 3003, desc: 'Fleet management, vehicle tracking, availability, carrier onboarding.', icon: '🚛', status: 'live' },
  { name: 'Tracking Service', port: 3004, desc: 'Real-time GPS telemetry, route history, ETA calculation.', icon: '📍', status: 'live' },
  { name: 'Notification Service', port: 3005, desc: 'Push notifications, email alerts, webhook dispatching via RabbitMQ.', icon: '🔔', status: 'live' },
];

const integrations = [
  { name: 'RabbitMQ', type: 'Message Broker', icon: '🐇' },
  { name: 'MongoDB', type: 'Database', icon: '🍃' },
  { name: 'Redis', type: 'Cache / Sessions', icon: '⚡' },
  { name: 'Docker', type: 'Containerization', icon: '🐳' },
  { name: 'Nginx', type: 'Reverse Proxy', icon: '⚙️' },
  { name: 'Leaflet', type: 'Maps & Tracking', icon: '🗺️' },
];

export default function Platform() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState(null);

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
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,200,150,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        {/* Decorative gradient */}
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.12), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 50, padding: '5px 18px', fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 28 }}>
            🏗️ Platform Overview
          </div>
          <h1 style={{ fontSize: 62, fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 22, maxWidth: 720 }}>
            Built for the future of freight
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', maxWidth: 540, lineHeight: 1.7, marginBottom: 48, fontFamily: 'var(--font-body)' }}>
            A modern microservices platform that handles thousands of shipments a day with sub-second response times and 99.9% uptime.
          </p>
          {/* Service status pills */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {services.map(s => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '5px 12px', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                {s.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture diagram visual */}
      <section style={{ background: '#0f172a', paddingBottom: 80, paddingLeft: 60, paddingRight: 60 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '40px', fontFamily: 'var(--font-body)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 28 }}>SYSTEM ARCHITECTURE</div>
            {/* Client layer */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 8, padding: '10px 24px' }}>
                <span style={{ fontSize: 14 }}>🌐</span>
                <span style={{ color: '#00c896', fontWeight: 700, fontSize: 13 }}>React Frontend (Port 80)</span>
              </div>
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 18, marginBottom: 16 }}>↓</div>
            {/* Gateway */}
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 8, padding: '10px 24px' }}>
                <span style={{ fontSize: 14 }}>🔀</span>
                <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: 13 }}>API Gateway (Port 3000)</span>
              </div>
            </div>
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 18, marginBottom: 16 }}>↓</div>
            {/* Services grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
              {services.slice(1).map(s => (
                <div key={s.name} onClick={() => setActiveService(activeService === s.name ? null : s.name)} style={{
                  background: activeService === s.name ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${activeService === s.name ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 8, padding: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>:{s.port}</div>
                </div>
              ))}
            </div>
            {activeService && (() => {
              const svc = services.find(s => s.name === activeService);
              return svc ? (
                <div style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 8, padding: '14px 18px', fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)', animation: 'fadeIn 0.2s' }}>
                  <span style={{ color: '#fb923c', fontWeight: 700 }}>{svc.name}</span> — {svc.desc}
                </div>
              ) : null;
            })()}
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 18, marginTop: 16, marginBottom: 16 }}>↓</div>
            {/* Data layer */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              {['MongoDB 🍃', 'Redis ⚡', 'RabbitMQ 🐇'].map(t => (
                <div key={t} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 18px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{t}</div>
              ))}
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 12, fontFamily: 'var(--font-body)' }}>Click a service to see its role</p>
        </div>
      </section>

      {/* Pillars */}
      <section style={{ background: '#f8fafc', padding: '90px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>PLATFORM CAPABILITIES</div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>Four engineering pillars</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {pillars.map(p => (
              <div key={p.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '32px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor = p.color; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: p.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, fontFamily: 'var(--font-body)', marginBottom: 20 }}>{p.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {p.details.map(d => (
                    <span key={d} style={{ background: p.color + '12', color: p.color, borderRadius: 5, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{d}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section style={{ background: '#fff', padding: '80px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 12 }}>Powered by proven technology</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 48, fontFamily: 'var(--font-body)' }}>Battle-tested open-source infrastructure, containerized and ready to scale.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {integrations.map(i => (
              <div key={i.name} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14, background: '#f8fafc' }}>
                <div style={{ fontSize: 28 }}>{i.icon}</div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{i.name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{i.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0f172a', padding: '90px 60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 16 }}>Start building on NexFlow</h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 36, fontFamily: 'var(--font-body)' }}>Full API access. Comprehensive docs. Sandbox environment.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <button onClick={() => navigate('/register')} style={{ background: '#00c896', color: '#0f172a', border: 'none', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Get API access →</button>
          <button onClick={() => navigate('/resources')} style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>View documentation</button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
