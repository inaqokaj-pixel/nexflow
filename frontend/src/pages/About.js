import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const team = [
  { name: 'Erion Doci', role: 'CEO & Co-founder', avatar: 'E', gradient: 'linear-gradient(135deg, #6c63ff, #a78bfa)' },
  { name: 'Blerta Hoxha', role: 'CTO & Co-founder', avatar: 'B', gradient: 'linear-gradient(135deg, #00c896, #0d9488)' },
  { name: 'Dritan Sula', role: 'Head of Product', avatar: 'D', gradient: 'linear-gradient(135deg, #f97316, #f59e0b)' },
  { name: 'Mirela Koci', role: 'Head of Operations', avatar: 'M', gradient: 'linear-gradient(135deg, #3b82f6, #6c63ff)' },
  { name: 'Altin Rama', role: 'Lead Engineer', avatar: 'A', gradient: 'linear-gradient(135deg, #e11d48, #f97316)' },
  { name: 'Sara Gjoka', role: 'Head of Carrier Success', avatar: 'S', gradient: 'linear-gradient(135deg, #0d9488, #3b82f6)' },
];

const milestones = [
  { year: '2023', title: 'Company founded', desc: 'NexFlow started as a microservices thesis project, solving Albania\'s fragmented freight market.' },
  { year: '2024', title: 'First 10 carriers', desc: 'Signed our first 10 carrier partners and processed 500+ shipments in the first quarter.' },
  { year: '2025', title: 'European expansion', desc: 'Expanded to 12 countries, integrated 40+ carriers, and processed over $10M in freight.' },
  { year: '2026', title: 'Platform v2', desc: 'Launched real-time GPS tracking, advanced fleet analytics, and the Enterprise tier.' },
];

const values = [
  { icon: '⚡', title: 'Speed by default', desc: 'Every product decision optimizes for speed — of booking, of payment, of support response.' },
  { icon: '🔍', title: 'Radical transparency', desc: 'Clear pricing, honest estimates, and full visibility into where your shipment is at all times.' },
  { icon: '🤝', title: 'Carrier-first culture', desc: 'We believe a thriving carrier network benefits everyone. Carriers pay nothing and earn faster.' },
  { icon: '🏗️', title: 'Engineering excellence', desc: 'We build with microservices, write tests, and ship with confidence. Quality is non-negotiable.' },
];

export default function About() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-display)', overflowX: 'hidden', background: '#fff' }}>
      <PublicNav scrolled={scrolled} />

      {/* Hero */}
      <section style={{ background: '#00c896', padding: '140px 60px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.1)', borderRadius: 50, padding: '5px 18px', fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 24 }}>
            🏢 About NexFlow
          </div>
          <h1 style={{ fontSize: 64, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 22 }}>
            We're fixing<br />freight logistics
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(15,23,42,0.7)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
            NexFlow was born out of frustration with broken, fragmented freight processes. We built the platform we always wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ background: '#fff', padding: '90px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>OUR MISSION</div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
              Make freight logistics as easy as sending an email
            </h2>
            <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, fontFamily: 'var(--font-body)', marginBottom: 16 }}>
              The logistics industry runs on phone calls, spreadsheets, and outdated software. Shippers waste hours getting quotes. Carriers drive empty trucks. Everyone loses.
            </p>
            <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
              NexFlow connects shippers and carriers on a single intelligent platform — instant quotes, real-time tracking, and automated payments. No phone calls required.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { value: '40+', label: 'Carrier Partners', color: '#6c63ff' },
              { value: '12', label: 'Countries', color: '#00c896' },
              { value: '$10M+', label: 'Freight Processed', color: '#f97316' },
              { value: '99.9%', label: 'Uptime', color: '#0d9488' },
            ].map(s => (
              <div key={s.label} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: '#f8fafc', padding: '80px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>WHAT WE BELIEVE</div>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>Our values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {values.map(v => (
              <div key={v.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '28px 24px' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{v.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ background: '#fff', padding: '80px 60px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>OUR STORY</div>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>How we got here</h2>
          </div>
          {milestones.map((m, i) => (
            <div key={m.year} style={{ display: 'flex', gap: 28, marginBottom: i < milestones.length - 1 ? 0 : 0 }}>
              {/* Line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#00c896' }}>{m.year}</div>
                {i < milestones.length - 1 && <div style={{ width: 2, flex: 1, background: '#e2e8f0', minHeight: 40 }} />}
              </div>
              <div style={{ paddingBottom: 36 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{m.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ background: '#f8fafc', padding: '80px 60px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>THE TEAM</div>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>The people behind NexFlow</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {team.map(t => (
              <div key={t.name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '28px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 20, flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'var(--font-body)' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section style={{ background: '#0f172a', padding: '80px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
          <h2 style={{ fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 14 }}>We're hiring</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 32, lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
            We're a small, fast-moving team building the future of freight logistics. If that excites you, we'd love to hear from you.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button onClick={() => navigate('/contact')} style={{ background: '#00c896', color: '#0f172a', border: 'none', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
              View open roles →
            </button>
            <button onClick={() => navigate('/contact')} style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
              Contact us
            </button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
