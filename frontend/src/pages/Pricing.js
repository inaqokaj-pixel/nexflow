import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 0, annual: 0 },
    desc: 'For individuals and small businesses just getting started.',
    color: '#64748b',
    badge: null,
    features: [
      'Up to 50 shipments/month',
      'Access to 10+ carriers',
      'Basic tracking',
      'Email notifications',
      'Standard support',
      '—',
      '—',
      '—',
    ],
    cta: 'Get started free',
    link: '/register',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: { monthly: 79, annual: 59 },
    desc: 'For growing businesses that need more volume and features.',
    color: '#6c63ff',
    badge: 'Most popular',
    features: [
      'Up to 500 shipments/month',
      'Access to 40+ carriers',
      'Real-time GPS tracking',
      'SMS & email notifications',
      'Priority support',
      'Volume discounts',
      'API access (5k req/day)',
      '—',
    ],
    cta: 'Start free trial',
    link: '/register',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: null, annual: null },
    desc: 'Custom pricing for high-volume shippers and enterprise operations.',
    color: '#0f172a',
    badge: null,
    features: [
      'Unlimited shipments',
      'Full carrier network',
      'Advanced tracking & analytics',
      'Custom notifications',
      '24/7 dedicated support',
      'Custom volume pricing',
      'Unlimited API access',
      'Dedicated account manager',
    ],
    cta: 'Contact sales',
    link: '/contact',
  },
];

const carrierPlan = {
  name: 'Carrier Partner',
  price: 'Free forever',
  desc: 'No platform fees. Earn more by listing your fleet on NexFlow.',
  features: [
    'Unlimited vehicle listings',
    'Real-time job matching',
    'Fleet management dashboard',
    'Payment in 48 hours',
    'Revenue analytics',
    'Driver management tools',
  ],
};

const faqs = [
  { q: 'Is there a free trial?', a: 'Yes — the Growth plan comes with a 14-day free trial. No credit card required. You will have full access to all Growth features during the trial period.' },
  { q: 'Can I switch plans at any time?', a: 'Absolutely. You can upgrade, downgrade, or cancel your plan at any time from your account settings. Upgrades take effect immediately; downgrades take effect at the next billing cycle.' },
  { q: 'How does per-shipment pricing work?', a: 'Each plan includes a monthly shipment quota. If you exceed your quota, additional shipments are billed at a small per-shipment rate. You will always be notified before any overage charges apply.' },
  { q: 'Do carriers pay anything?', a: 'No. NexFlow is completely free for carrier partners. We monetize through shipper subscriptions, not carrier commissions. Carriers keep 100% of what they earn.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, Amex), SEPA bank transfers for EU customers, and invoicing for annual Enterprise contracts.' },
  { q: 'Is my data secure?', a: 'Yes. All data is encrypted in transit and at rest. We are GDPR compliant and do not share your data with third parties. Enterprise plans include a Data Processing Agreement.' },
];

export default function Pricing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-display)', overflowX: 'hidden', background: '#fff' }}>
      <PublicNav scrolled={scrolled} />

      {/* Hero */}
      <section style={{ background: '#f8fafc', padding: '140px 60px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e0fef4', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 50, padding: '5px 18px', fontSize: 13, fontWeight: 700, color: '#059669', marginBottom: 24 }}>
          💚 Simple, transparent pricing
        </div>
        <h1 style={{ fontSize: 60, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', marginBottom: 20 }}>
          Pay for what you ship
        </h1>
        <p style={{ fontSize: 18, color: '#475569', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
          No hidden fees, no per-carrier charges. One plan, your whole freight operation.
        </p>
        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#e2e8f0', borderRadius: 50, padding: '6px 6px 6px 14px' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: annual ? '#94a3b8' : '#0f172a' }}>Monthly</span>
          <div onClick={() => setAnnual(a => !a)} style={{ width: 44, height: 24, borderRadius: 12, background: annual ? '#00c896' : '#94a3b8', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ position: 'absolute', top: 2, left: annual ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: annual ? '#0f172a' : '#94a3b8' }}>Annual</span>
          {annual && <span style={{ background: '#00c896', color: '#0f172a', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>Save 25%</span>}
        </div>
      </section>

      {/* Plans */}
      <section style={{ background: '#f8fafc', padding: '0 60px 80px' }}>
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {plans.map(p => (
            <div key={p.id} style={{
              background: p.id === 'growth' ? '#0f172a' : '#fff',
              border: p.id === 'growth' ? 'none' : '1px solid #e2e8f0',
              borderRadius: 16, padding: '32px 28px',
              boxShadow: p.id === 'growth' ? '0 20px 60px rgba(15,23,42,0.25)' : 'none',
              position: 'relative', transform: p.id === 'growth' ? 'scale(1.03)' : 'none',
              transition: 'transform 0.2s',
            }}>
              {p.badge && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#00c896', color: '#0f172a', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 800, whiteSpace: 'nowrap' }}>
                  ⭐ {p.badge}
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 700, color: p.id === 'growth' ? 'rgba(255,255,255,0.5)' : '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{p.name}</div>

              <div style={{ marginBottom: 16 }}>
                {p.price.monthly === null ? (
                  <div style={{ fontSize: 36, fontWeight: 900, color: p.id === 'growth' ? '#fff' : '#0f172a' }}>Custom</div>
                ) : p.price.monthly === 0 ? (
                  <div style={{ fontSize: 36, fontWeight: 900, color: p.id === 'growth' ? '#fff' : '#0f172a' }}>Free</div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: p.id === 'growth' ? '#fff' : '#0f172a' }}>
                      €{annual ? p.price.annual : p.price.monthly}
                    </span>
                    <span style={{ fontSize: 14, color: p.id === 'growth' ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>/mo</span>
                  </div>
                )}
              </div>

              <p style={{ fontSize: 13, color: p.id === 'growth' ? 'rgba(255,255,255,0.55)' : '#64748b', lineHeight: 1.6, marginBottom: 24, fontFamily: 'var(--font-body)' }}>{p.desc}</p>

              <button onClick={() => navigate(p.link)} style={{
                width: '100%', borderRadius: 8, padding: '12px', fontSize: 14, fontWeight: 800,
                cursor: 'pointer', marginBottom: 24, border: 'none',
                background: p.id === 'growth' ? '#00c896' : p.id === 'enterprise' ? '#0f172a' : '#f1f5f9',
                color: p.id === 'growth' ? '#0f172a' : p.id === 'enterprise' ? '#fff' : '#0f172a',
              }}>
                {p.cta} →
              </button>

              <div style={{ borderTop: `1px solid ${p.id === 'growth' ? 'rgba(255,255,255,0.1)' : '#f1f5f9'}`, paddingTop: 20 }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, opacity: f === '—' ? 0.3 : 1 }}>
                    <span style={{ color: f === '—' ? '#94a3b8' : '#00c896', fontSize: 14, flexShrink: 0 }}>{f === '—' ? '—' : '✓'}</span>
                    <span style={{ fontSize: 13, color: p.id === 'growth' ? 'rgba(255,255,255,0.75)' : '#475569', fontFamily: 'var(--font-body)' }}>{f === '—' ? 'Not included' : f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Carrier plan */}
      <section style={{ background: '#fff', padding: '60px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: 16, padding: '40px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#00c896', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>FOR CARRIERS</div>
              <h3 style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10 }}>{carrierPlan.name}</h3>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#00c896', marginBottom: 14 }}>{carrierPlan.price}</div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 24, fontFamily: 'var(--font-body)' }}>{carrierPlan.desc}</p>
              <button onClick={() => navigate('/register')} style={{ background: '#00c896', color: '#0f172a', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                Join as carrier →
              </button>
            </div>
            <div>
              {carrierPlan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ color: '#00c896', fontSize: 14 }}>✓</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#f8fafc', padding: '80px 60px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', textAlign: 'center', marginBottom: 48 }}>Frequently asked questions</h2>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e2e8f0', marginBottom: 0 }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '20px 0', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
              }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{faq.q}</span>
                <span style={{ fontSize: 20, color: '#94a3b8', transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 16 }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ paddingBottom: 20, fontSize: 15, color: '#475569', lineHeight: 1.7, fontFamily: 'var(--font-body)', animation: 'fadeIn 0.2s' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#00c896', padding: '80px 60px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 46, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: 14 }}>Start shipping today</h2>
        <p style={{ fontSize: 16, color: 'rgba(15,23,42,0.6)', marginBottom: 32, fontFamily: 'var(--font-body)' }}>Free plan available. No credit card required.</p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <button onClick={() => navigate('/register')} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Get started free →</button>
          <button onClick={() => navigate('/contact')} style={{ background: 'rgba(0,0,0,0.1)', color: '#0f172a', border: 'none', borderRadius: 9, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Talk to sales</button>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
