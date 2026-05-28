import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const contactOptions = [
  { icon: '💼', title: 'Sales', desc: 'Learn about our Enterprise plan, volume pricing, and custom integrations.', email: 'sales@nexflow.app', cta: 'Talk to sales' },
  { icon: '🛠️', title: 'Technical Support', desc: 'Help with your account, shipments, API integration, or platform issues.', email: 'support@nexflow.app', cta: 'Get support' },
  { icon: '🤝', title: 'Carrier Partnerships', desc: 'Join our network, list your fleet, and start receiving shipment requests.', email: 'carriers@nexflow.app', cta: 'Join as carrier' },
  { icon: '📰', title: 'Press & Media', desc: 'Interviews, press kits, media inquiries, and official statements.', email: 'press@nexflow.app', cta: 'Contact PR' },
];

const offices = [
  { city: 'Tirana', country: 'Albania 🇦🇱', address: 'Rruga Ismail Qemali, Blloku', role: 'Headquarters' },
  { city: 'Sofia', country: 'Bulgaria 🇧🇬', address: 'Bulgaria Blvd 102, Sofia', role: 'Engineering Hub' },
  { city: 'Vienna', country: 'Austria 🇦🇹', address: 'Schottenring 12, Wien 1010', role: 'Sales & Partnerships' },
];

export default function Contact() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', type: 'general', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0', borderRadius: 8,
    fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', background: '#fff',
    transition: 'border-color 0.15s', boxSizing: 'border-box',
  };

  return (
    <div style={{ fontFamily: 'var(--font-display)', overflowX: 'hidden', background: '#fff' }}>
      <PublicNav scrolled={scrolled} />

      {/* Hero */}
      <section style={{ background: '#f8fafc', padding: '140px 60px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e0fef4', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 50, padding: '5px 18px', fontSize: 13, fontWeight: 700, color: '#059669', marginBottom: 24 }}>
          💬 Get in touch
        </div>
        <h1 style={{ fontSize: 58, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', marginBottom: 20, lineHeight: 1.1 }}>
          We'd love to hear<br />from you
        </h1>
        <p style={{ fontSize: 18, color: '#475569', maxWidth: 460, margin: '0 auto', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
          Whether you're a shipper, a carrier, a developer, or just curious — our team responds within 24 hours.
        </p>
      </section>

      {/* Contact options */}
      <section style={{ background: '#fff', padding: '60px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 72 }}>
            {contactOptions.map(c => (
              <div key={c.title} style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00c896'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{c.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, fontFamily: 'var(--font-body)', marginBottom: 16 }}>{c.desc}</p>
                <a href={`mailto:${c.email}`} style={{ fontSize: 13, fontWeight: 700, color: '#00c896', textDecoration: 'none' }}>
                  {c.email} →
                </a>
              </div>
            ))}
          </div>

          {/* Form + offices */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 64 }}>
            {/* Form */}
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 8 }}>Send us a message</h2>
              <p style={{ fontSize: 14, color: '#64748b', marginBottom: 32, fontFamily: 'var(--font-body)' }}>We reply to every message within one business day.</p>

              {submitted ? (
                <div style={{ background: '#e0fef4', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 12, padding: '32px', textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Message sent!</h3>
                  <p style={{ fontSize: 14, color: '#475569', fontFamily: 'var(--font-body)' }}>We'll get back to you at <strong>{form.email}</strong> within one business day.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full name *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Erion Doci" required style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#00c896'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email address *</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="erion@company.com" required style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#00c896'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</label>
                    <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Your company name (optional)" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#00c896'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>I'm a...</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="general">Choose your role</option>
                      <option value="shipper">Shipper / Business</option>
                      <option value="carrier">Carrier / Fleet Operator</option>
                      <option value="developer">Developer / API user</option>
                      <option value="enterprise">Enterprise customer</option>
                      <option value="press">Press / Media</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Message *</label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us what you need..." required rows={5} style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                      onFocus={e => e.target.style.borderColor = '#00c896'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                  </div>

                  <button type="submit" disabled={loading} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 9, padding: '14px', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
                    {loading ? 'Sending…' : 'Send message →'}
                  </button>
                </form>
              )}
            </div>

            {/* Offices */}
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 24, letterSpacing: '-0.01em' }}>Our offices</h3>
              {offices.map(o => (
                <div key={o.city} style={{ marginBottom: 24, padding: '20px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{o.city}</div>
                    <span style={{ background: '#e0fef4', color: '#059669', borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{o.role}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'var(--font-body)', marginBottom: 2 }}>{o.country}</div>
                  <div style={{ fontSize: 13, color: '#64748b', fontFamily: 'var(--font-body)' }}>{o.address}</div>
                </div>
              ))}

              {/* Social links */}
              <div style={{ marginTop: 32 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Follow us</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { icon: '𝕏', label: 'Twitter', href: '#' },
                    { icon: 'in', label: 'LinkedIn', href: '#' },
                    { icon: 'gh', label: 'GitHub', href: '#' },
                  ].map(s => (
                    <a key={s.label} href={s.href} style={{ width: 40, height: 40, borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#0f172a', textDecoration: 'none', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f172a'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
