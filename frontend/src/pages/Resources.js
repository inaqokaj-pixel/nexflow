import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const categories = ['All', 'Guide', 'API', 'Case Study', 'Changelog'];

const articles = [
  { cat: 'Guide',      badge: '📘', title: 'Getting started with NexFlow',         desc: 'Set up your account, book your first shipment, and track it in real time — in under 10 minutes.', time: '5 min read',  color: '#6c63ff', featured: true, slug: 'getting-started' },
  { cat: 'Guide',      badge: '📘', title: 'How to set up your carrier profile',    desc: 'Add your vehicles, define your routes, and start receiving shipment requests on day one.',           time: '8 min read',  color: '#6c63ff', slug: 'carrier-profile-setup' },
  { cat: 'API',        badge: '🔌', title: 'REST API overview',                     desc: 'Authentication, base URLs, rate limits, error codes, and your first API call.',                        time: '10 min read', color: '#f97316', slug: 'rest-api-overview' },
  { cat: 'API',        badge: '🔌', title: 'Booking API reference',                 desc: 'Complete reference for creating, updating, and cancelling bookings via the API.',                     time: '12 min read', color: '#f97316', slug: 'booking-api-reference' },
  { cat: 'API',        badge: '🔌', title: 'Webhook events guide',                  desc: 'Subscribe to shipment status changes, delivery confirmations, and carrier assignments.',              time: '7 min read',  color: '#f97316', slug: 'webhooks-guide' },
  { cat: 'API',        badge: '🔌', title: 'Authentication & API keys',             desc: 'JWT tokens, refresh flows, long-lived API keys, and role-based access control.',                    time: '6 min read',  color: '#f97316', slug: 'authentication-guide' },
  { cat: 'Case Study', badge: '📊', title: 'How FreshBox cut shipping costs by 31%',desc: "E-commerce startup FreshBox reduced logistics spend in 90 days using NexFlow's carrier comparison.", time: '6 min read',  color: '#0d9488', slug: 'freshbox-case-study' },
  { cat: 'Changelog',  badge: '🆕', title: 'v2.4 — Live tracking improvements',     desc: 'Sub-30-second GPS updates, new geofence alerts, and a redesigned tracking map with route playback.',time: 'May 2026',    color: '#22c55e', slug: 'v24-changelog' },
  { cat: 'Changelog',  badge: '🆕', title: 'v2.3 — Multi-carrier booking',          desc: 'Book shipments across multiple carriers in a single checkout. Volume discounts applied automatically.',time: 'April 2026', color: '#22c55e', slug: 'v23-changelog' },
];

const docs = [
  { icon: '🚀', title: 'Quick Start',    desc: 'Up and running in 5 minutes',      slug: 'getting-started' },
  { icon: '📋', title: 'API Reference',  desc: 'Full REST API documentation',       slug: 'rest-api-overview' },
  { icon: '🔔', title: 'Webhooks',       desc: 'Real-time event subscriptions',     slug: 'webhooks-guide' },
  { icon: '🔐', title: 'Authentication', desc: 'JWT tokens and API keys',           slug: 'authentication-guide' },
  { icon: '📦', title: 'Bookings',       desc: 'Create and manage shipments',       slug: 'booking-api-reference' },
  { icon: '📘', title: 'Carrier Setup',  desc: 'Fleet and profile configuration',   slug: 'carrier-profile-setup' },
];

export default function Resources() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === 'All' || a.cat === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !search || a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.find(a => a.featured);
  const rest = filtered.filter(a => !a.featured);

  return (
    <div style={{ fontFamily: 'var(--font-display)', overflowX: 'hidden', background: '#fff' }}>
      <PublicNav scrolled={scrolled} />

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '140px 60px 80px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,200,150,0.12)', border: '1px solid rgba(0,200,150,0.25)', borderRadius: 50, padding: '5px 18px', fontSize: 13, fontWeight: 700, color: '#00c896', marginBottom: 24 }}>
            📚 Resources & Documentation
          </div>
          <h1 style={{ fontSize: 56, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 20, lineHeight: 1.1 }}>
            Everything you need to succeed
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', marginBottom: 36, fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>
            Guides, API docs, case studies, and changelogs — all in one place.
          </p>
          <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 15, color: 'rgba(255,255,255,0.3)' }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search guides, API docs, case studies..."
              style={{ width: '100%', padding: '14px 16px 14px 44px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#fff', fontSize: 15, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </section>

      {/* Doc quick links — all wired to real articles */}
      <section style={{ background: '#f8fafc', padding: '56px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#00c896', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 18 }}>DEVELOPER DOCS</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
            {docs.map(d => (
              <button key={d.title} onClick={() => navigate(`/resources/${d.slug}`)}
                style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '18px 14px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6c63ff'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(108,99,255,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{d.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 3 }}>{d.title}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-body)', lineHeight: 1.4 }}>{d.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section style={{ background: '#fff', padding: '56px 60px 80px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 36 }}>
            {categories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)} style={{
                padding: '7px 18px', borderRadius: 6, border: '1px solid',
                borderColor: activeCategory === c ? '#0f172a' : '#e2e8f0',
                background: activeCategory === c ? '#0f172a' : '#fff',
                color: activeCategory === c ? '#fff' : '#64748b',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
              }}>{c}</button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8', fontFamily: 'var(--font-body)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16 }}>No results for "{search}"</div>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }} style={{ marginTop: 16, background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 7, padding: '8px 18px', fontSize: 13, color: '#64748b', cursor: 'pointer' }}>Clear search</button>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div onClick={() => navigate(`/resources/${featured.slug}`)}
                  style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', borderRadius: 16, padding: '40px', marginBottom: 28, display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
                      <span style={{ background: 'rgba(108,99,255,0.2)', color: '#a78bfa', borderRadius: 5, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>{featured.badge} {featured.cat}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>{featured.time}</span>
                      <span style={{ background: '#00c896', color: '#0f172a', borderRadius: 5, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>Featured</span>
                    </div>
                    <h3 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10 }}>{featured.title}</h3>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, fontFamily: 'var(--font-body)', maxWidth: 480 }}>{featured.desc}</p>
                    <div style={{ marginTop: 18, fontSize: 13, fontWeight: 700, color: '#00c896' }}>Read article →</div>
                  </div>
                  <div style={{ fontSize: 64, opacity: 0.5 }}>{featured.badge}</div>
                </div>
              )}

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {rest.map((a, i) => (
                  <div key={i} onClick={() => navigate(`/resources/${a.slug}`)}
                    style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', cursor: 'pointer', transition: 'all 0.2s', background: '#fff' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ background: a.color + '18', color: a.color, borderRadius: 5, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{a.badge} {a.cat}</span>
                      <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'var(--font-body)' }}>{a.time}</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 8, lineHeight: 1.4 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, fontFamily: 'var(--font-body)', marginBottom: 16 }}>{a.desc}</p>
                    <div style={{ fontSize: 13, fontWeight: 700, color: a.color }}>Read more →</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: '#f8fafc', padding: '80px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>📬</div>
          <h2 style={{ fontSize: 34, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 10 }}>Stay in the loop</h2>
          <p style={{ fontSize: 15, color: '#64748b', marginBottom: 28, fontFamily: 'var(--font-body)', lineHeight: 1.65 }}>
            New guides, product updates, and logistics insights in your inbox.
          </p>
          {subscribed ? (
            <div style={{ background: '#e0fef4', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 10, padding: '18px', fontSize: 15, fontWeight: 700, color: '#059669' }}>
              ✓ You're subscribed! We'll be in touch.
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 10 }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address"
                  style={{ flex: 1, padding: '13px 16px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', background: '#fff' }}
                  onFocus={e => e.target.style.borderColor = '#0f172a'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                <button onClick={() => email.includes('@') && setSubscribed(true)}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '13px 22px', fontSize: 14, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Subscribe →
                </button>
              </div>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 10, fontFamily: 'var(--font-body)' }}>No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
