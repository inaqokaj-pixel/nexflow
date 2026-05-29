import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const TOPICS = [
  { icon: '💼', label: 'Sales & pricing',       email: 'sales@nexflow.app',    desc: 'Enterprise plans, volume pricing, custom integrations.' },
  { icon: '🛠️', label: 'Technical support',    email: 'support@nexflow.app',  desc: 'Help with your account, API, or platform issues.' },
  { icon: '🚛', label: 'Carrier partnerships', email: 'carriers@nexflow.app', desc: 'Join the network, list your fleet, grow your revenue.' },
  { icon: '📰', label: 'Press & media',         email: 'press@nexflow.app',    desc: 'Interviews, press kits, and media inquiries.' },
];

const inputStyle = {
  width: '100%', padding: '12px 15px',
  border: '1.5px solid #e2e8f0', borderRadius: 9,
  fontSize: 14, fontFamily: 'var(--font-body)',
  outline: 'none', background: '#fff',
  transition: 'border-color 0.15s, box-shadow 0.15s',
  boxSizing: 'border-box', color: '#0f172a',
};

const isEmailJSConfigured = () =>
  window.EMAILJS_PUBLIC_KEY && window.EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';

export default function Contact() {
  const navigate = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [form, setForm]           = useState({ name: '', email: '', company: '', role: 'shipper', message: '' });
  const [status, setStatus]       = useState('idle'); // idle | sending | success | error | not_configured
  const [errMsg, setErrMsg]       = useState('');
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;

    if (!isEmailJSConfigured()) {
      setStatus('not_configured');
      return;
    }

    setStatus('sending');
    setErrMsg('');

    try {
      const result = await window.emailjs.send(
        window.EMAILJS_SERVICE_ID,
        window.EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          company:    form.company || '—',
          role:       form.role,
          message:    form.message,
          to_email:   window.CONTACT_RECIPIENT || 'hello@nexflow.app',
          reply_to:   form.email,
        },
        window.EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        setStatus('success');
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err) {
      setStatus('error');
      setErrMsg('Something went wrong. Please email us directly at hello@nexflow.app');
    }
  };

  const focusStyle = (e) => {
    e.target.style.borderColor = '#00c896';
    e.target.style.boxShadow = '0 0 0 3px rgba(0,200,150,0.12)';
  };
  const blurStyle = (e) => {
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={{ fontFamily: 'var(--font-display)', overflowX: 'hidden', background: '#fff' }}>
      <PublicNav scrolled={scrolled} />

      {/* ── HERO ── */}
      <section style={{ background: '#f8fafc', padding: '130px 60px 70px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e0fef4', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 50, padding: '5px 18px', fontSize: 13, fontWeight: 700, color: '#059669', marginBottom: 22 }}>
          💬 We're here to help
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', lineHeight: 1.07, marginBottom: 18 }}>
          Get in touch
        </h1>
        <p style={{ fontSize: 17, color: '#475569', maxWidth: 440, margin: '0 auto', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
          Our team responds to every message within one business day. No bots, no runaround.
        </p>
      </section>

      {/* ── TOPIC CARDS ── */}
      <section style={{ background: '#fff', padding: '50px 60px 0' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 60 }}>
            {TOPICS.map(t => (
              <div key={t.label}
                onClick={() => setActiveTopic(activeTopic === t.label ? null : t.label)}
                style={{
                  border: `1.5px solid ${activeTopic === t.label ? '#00c896' : '#e2e8f0'}`,
                  background: activeTopic === t.label ? '#f0fdf9' : '#fff',
                  borderRadius: 12, padding: '22px 18px', cursor: 'pointer', transition: 'all 0.18s',
                }}
                onMouseEnter={e => { if (activeTopic !== t.label) { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}}
                onMouseLeave={e => { if (activeTopic !== t.label) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55, fontFamily: 'var(--font-body)', marginBottom: 12 }}>{t.desc}</div>
                <a href={`mailto:${t.email}`} onClick={e => e.stopPropagation()}
                  style={{ fontSize: 12, fontWeight: 700, color: '#00c896', textDecoration: 'none', display: 'block' }}>
                  {t.email} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + SIDEBAR ── */}
      <section style={{ background: '#fff', padding: '0 60px 90px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 64 }}>

          {/* ── FORM ── */}
          <div>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: 6 }}>Send a message</h2>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 30, fontFamily: 'var(--font-body)' }}>
              Fill in the form — we'll email you back at <strong>{form.email || 'your address'}</strong>.
            </p>

            {/* ── SUCCESS ── */}
            {status === 'success' && (
              <div style={{ background: '#f0fdf9', border: '1.5px solid rgba(0,200,150,0.35)', borderRadius: 14, padding: '36px', textAlign: 'center' }}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>✅</div>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Message sent!</h3>
                <p style={{ fontSize: 15, color: '#475569', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                  We got your message and will reply to <strong>{form.email}</strong> within one business day.
                </p>
                <button onClick={() => { setStatus('idle'); setForm({ name:'', email:'', company:'', role:'shipper', message:'' }); }}
                  style={{ marginTop: 22, background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  Send another message
                </button>
              </div>
            )}

            {/* ── NOT CONFIGURED WARNING ── */}
            {status === 'not_configured' && (
              <div style={{ background: '#fffbeb', border: '1.5px solid rgba(245,158,11,0.3)', borderRadius: 12, padding: '20px 22px', marginBottom: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#92400e', marginBottom: 6 }}>⚙️ EmailJS not configured yet</div>
                <p style={{ fontSize: 13, color: '#78350f', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}>
                  Open <code style={{ background: '#fef3c7', padding: '1px 5px', borderRadius: 3 }}>public/index.html</code> and replace the four <code style={{ background: '#fef3c7', padding: '1px 5px', borderRadius: 3 }}>YOUR_*</code> placeholders with your EmailJS credentials. Takes 5 minutes at <a href="https://emailjs.com" target="_blank" rel="noreferrer" style={{ color: '#d97706', fontWeight: 700 }}>emailjs.com</a>.
                </p>
                <button onClick={() => setStatus('idle')} style={{ marginTop: 12, background: 'transparent', border: '1px solid #d97706', borderRadius: 7, padding: '7px 16px', fontSize: 13, fontWeight: 700, color: '#92400e', cursor: 'pointer' }}>Got it</button>
              </div>
            )}

            {/* ── FORM FIELDS ── */}
            {status !== 'success' && (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Full name *</label>
                    <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Erion Doci"
                      required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com"
                      required style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Company</label>
                    <input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Your company (optional)"
                      style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>I am a…</label>
                    <select value={form.role} onChange={e => set('role', e.target.value)}
                      style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusStyle} onBlur={blurStyle}>
                      <option value="shipper">Shipper / Business owner</option>
                      <option value="carrier">Carrier / Fleet operator</option>
                      <option value="developer">Developer / API user</option>
                      <option value="enterprise">Enterprise buyer</option>
                      <option value="press">Press / Journalist</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Message *</label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)}
                    placeholder="Tell us what you need, what you're shipping, or what question you have…"
                    required rows={5} style={{ ...inputStyle, resize: 'vertical', minHeight: 130, lineHeight: 1.6 }}
                    onFocus={focusStyle} onBlur={blurStyle} />
                </div>

                {status === 'error' && (
                  <div style={{ background: '#fef2f2', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '11px 14px', fontSize: 13, color: '#991b1b', fontFamily: 'var(--font-body)' }}>
                    ⚠️ {errMsg}
                  </div>
                )}

                <button type="submit" disabled={status === 'sending' || !form.name || !form.email || !form.message}
                  style={{
                    background: (status === 'sending' || !form.name || !form.email || !form.message) ? '#94a3b8' : '#0f172a',
                    color: '#fff', border: 'none', borderRadius: 9,
                    padding: '14px', fontSize: 15, fontWeight: 800,
                    cursor: (status === 'sending' || !form.name || !form.email || !form.message) ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  }}>
                  {status === 'sending' ? (
                    <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Sending…</>
                  ) : '✉️  Send message'}
                </button>

                <p style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-body)', textAlign: 'center' }}>
                  We reply within 1 business day. Your data is never shared with third parties.
                </p>
              </form>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ paddingTop: 6 }}>
            {/* Response time */}
            <div style={{ background: '#f0fdf9', border: '1px solid rgba(0,200,150,0.25)', borderRadius: 12, padding: '20px 22px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c896', animation: 'pulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>Typical response time</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#00c896', lineHeight: 1, marginBottom: 4 }}>Under 4 hours</div>
              <div style={{ fontSize: 12, color: '#64748b', fontFamily: 'var(--font-body)' }}>Monday – Friday, 8:00 – 18:00 CET</div>
            </div>

            {/* Direct emails */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 22px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Direct email</div>
              {[
                { label: 'General',  email: 'hello@nexflow.app' },
                { label: 'Sales',    email: 'sales@nexflow.app' },
                { label: 'Support',  email: 'support@nexflow.app' },
                { label: 'Carriers', email: 'carriers@nexflow.app' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: '#64748b', fontFamily: 'var(--font-body)' }}>{item.label}</span>
                  <a href={`mailto:${item.email}`}
                    style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#00c896'}
                    onMouseLeave={e => e.currentTarget.style.color = '#0f172a'}>
                    {item.email}
                  </a>
                </div>
              ))}
            </div>

            {/* Offices */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 22px', marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Offices</div>
              {[
                { flag: '🇦🇱', city: 'Tirana', role: 'HQ', address: 'Rruga Ismail Qemali, Blloku' },
                { flag: '🇧🇬', city: 'Sofia',  role: 'Engineering', address: 'Bulgaria Blvd 102' },
                { flag: '🇦🇹', city: 'Vienna', role: 'Sales', address: 'Schottenring 12' },
              ].map(o => (
                <div key={o.city} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{o.flag} {o.city}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 4 }}>{o.role}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-body)' }}>{o.address}</div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Follow us</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { label: '𝕏', href: 'https://twitter.com' },
                  { label: 'in', href: 'https://linkedin.com' },
                  { label: 'gh', href: 'https://github.com' },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    style={{ width: 38, height: 38, borderRadius: 8, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, color: '#0f172a', textDecoration: 'none', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f172a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
