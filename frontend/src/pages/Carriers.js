import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const partnerCarriers = [
  { name: 'DHL Express', type: 'Express & Parcel', coverage: 'Pan-European', icon: '🟡' },
  { name: 'FedEx', type: 'International Express', coverage: 'Global', icon: '🟣' },
  { name: 'Maersk', type: 'Container & Freight', coverage: 'Global', icon: '🔵' },
  { name: 'DB Cargo', type: 'Rail & Heavy Freight', coverage: 'Europe', icon: '🔴' },
  { name: 'GLS', type: 'Parcel & B2B', coverage: 'Europe', icon: '🟢' },
  { name: 'UPS', type: 'Express & Ground', coverage: 'Global', icon: '🟤' },
  { name: 'DSV', type: 'Road, Air & Sea', coverage: 'Global', icon: '⚫' },
  { name: 'TNT', type: 'Express Freight', coverage: 'Europe', icon: '🟠' },
  { name: 'Rhenus', type: 'Contract Logistics', coverage: 'Europe', icon: '🔷' },
  { name: 'Glovo', type: 'Last-Mile Delivery', coverage: 'Urban EU', icon: '🟡' },
];

const benefits = [
  { icon: '💰', title: 'Earn more, faster', desc: 'Access a steady stream of shipment requests matched to your routes. No cold calling, no empty runs.' },
  { icon: '📱', title: 'Simple carrier app', desc: 'Manage jobs, track your fleet, and communicate with shippers — all from one clean dashboard.' },
  { icon: '⚡', title: '48-hour payments', desc: 'Get paid automatically within 48 hours of confirmed delivery. No invoicing, no chasing.' },
  { icon: '🗺️', title: 'Route optimization', desc: 'Our matching engine finds jobs along your existing routes, maximizing load efficiency and reducing dead miles.' },
  { icon: '📈', title: 'Business analytics', desc: 'Track revenue, utilization rates, delivery performance, and customer ratings in real time.' },
  { icon: '🛡️', title: 'Insurance support', desc: 'Access cargo insurance options directly through the platform. Keep your customers protected.' },
];

const steps = [
  { n: '01', title: 'Create your carrier account', desc: 'Register as a carrier, verify your company, and add your transport licence details.' },
  { n: '02', title: 'Add your fleet', desc: 'List your vehicles with type, capacity, and available routes. You can add as many vehicles as you have.' },
  { n: '03', title: 'Receive shipment requests', desc: 'Get matched to shipments that fit your capacity and route. Accept or decline each job instantly.' },
  { n: '04', title: 'Deliver and get paid', desc: 'Complete the delivery, confirm in the app, and receive payment within 48 hours.' },
];

const testimonials = [
  { name: 'Arben Koci', company: 'AlbaTrans', role: 'Fleet Manager', quote: 'We doubled our monthly loads within 6 weeks of joining NexFlow. The route matching is genuinely accurate.', rating: 5 },
  { name: 'Mihai Popa', company: 'RoFreight SRL', role: 'Owner', quote: 'Getting paid in 48 hours changed our cash flow completely. No more waiting 30-60 days for invoices.', rating: 5 },
  { name: 'Ivan Petrović', company: 'Balkan Logistics', role: 'Operations Director', quote: 'The fleet dashboard is better than most enterprise TMS systems I have used. Highly recommend.', rating: 5 },
];

export default function Carriers() {
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
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d2040 100%)', padding: '140px 60px 100px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(249,115,22,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 50, padding: '5px 18px', fontSize: 13, fontWeight: 700, color: '#fb923c', marginBottom: 28 }}>
              🚛 For Carrier Partners
            </div>
            <h1 style={{ fontSize: 58, fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 22 }}>
              More loads.<br />Less admin.<br />Faster pay.
            </h1>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', maxWidth: 440, lineHeight: 1.7, marginBottom: 36, fontFamily: 'var(--font-body)' }}>
              Join 40+ carrier partners using NexFlow to find shipments, manage their fleet, and grow their business — completely free.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => navigate('/register')} style={{ background: '#f97316', color: '#fff', border: 'none', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                Join free →
              </button>
              <button onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                Sign in
              </button>
            </div>
          </div>

          {/* Stats panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { value: '40+', label: 'Active Carriers', icon: '🚛' },
              { value: '2x', label: 'Avg Load Increase', icon: '📈' },
              { value: '48h', label: 'Payment Window', icon: '💰' },
              { value: '0%', label: 'Platform Commission', icon: '🎯' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#f97316', lineHeight: 1, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ background: '#f8fafc', padding: '90px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f97316', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>CARRIER BENEFITS</div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' }}>Why carriers choose NexFlow</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {benefits.map(b => (
              <div key={b.title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '28px', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#f97316'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{b.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{b.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to join */}
      <section style={{ background: '#fff', padding: '90px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#f97316', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: 44, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 12 }}>On the road in 4 steps</h2>
            <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>From sign-up to your first delivery — it takes less than a day.</p>
          </div>
          <div>
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: 'flex', gap: 20, marginBottom: i < steps.length - 1 ? 32 : 0, position: 'relative' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f97316', fontWeight: 900, fontSize: 13 }}>{s.n}</div>
                  {i < steps.length - 1 && <div style={{ width: 2, height: 20, background: '#e2e8f0', margin: '4px auto' }} />}
                </div>
                <div>
                  <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 5 }}>{s.title}</h4>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: '#f8fafc', padding: '80px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 48 }}>What our carriers say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '28px' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array(t.rating).fill(0).map((_, i) => <span key={i} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ fontSize: 15, color: '#0f172a', lineHeight: 1.7, fontFamily: 'var(--font-body)', marginBottom: 20, fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 15 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-body)' }}>{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner carriers */}
      <section style={{ background: '#0f172a', padding: '70px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8, textAlign: 'center' }}>Our carrier network</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', marginBottom: 36, fontFamily: 'var(--font-body)' }}>40+ verified carriers across Europe</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {partnerCarriers.map(c => (
              <div key={c.name} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px 14px', textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 6 }}>{c.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)' }}>{c.type}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#f97316', padding: '90px 60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 50, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: 14 }}>Join the carrier network</h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', marginBottom: 36, fontFamily: 'var(--font-body)' }}>Free to join. No commission. Start earning more today.</p>
        <button onClick={() => navigate('/register')} style={{ background: '#fff', color: '#f97316', border: 'none', borderRadius: 9, padding: '16px 36px', fontSize: 16, fontWeight: 900, cursor: 'pointer' }}>
          Create your carrier account →
        </button>
      </section>

      <PublicFooter />
    </div>
  );
}
