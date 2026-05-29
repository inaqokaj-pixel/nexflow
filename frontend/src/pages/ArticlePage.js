import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PublicNav from '../components/PublicNav';
import PublicFooter from '../components/PublicFooter';

const ARTICLES = {
  'getting-started': {
    cat: 'Guide', badge: '📘', time: '5 min read',
    title: 'Getting started with NexFlow',
    intro: 'Set up your account, book your first shipment, and track it in real time — in under 10 minutes.',
    sections: [
      { title: '1. Create your account', body: 'Go to nexflow.app/register and sign up with your email. Choose your role — Shipper if you want to book freight, or Carrier if you want to list your fleet. Verify your email and you\'re in.' },
      { title: '2. Complete your profile', body: 'Fill in your company name, address, and contact details. Shippers should add a payment method. Carriers should upload their transport licence and VAT number for verification (takes under 2 hours).' },
      { title: '3. Book your first shipment', body: 'From the dashboard click "Book Shipment". Enter pickup and delivery address, cargo weight and dimensions, and preferred pickup date. NexFlow shows you available carriers and rates instantly. Select one and confirm.' },
      { title: '4. Track it live', body: 'Once confirmed, track your shipment in real time from the "Live Tracking" page. You\'ll receive automatic email and SMS notifications at each milestone: picked up, in transit, and delivered.' },
      { title: 'What\'s next?', body: 'Explore bulk booking for multiple shipments, set up API webhooks for automated updates, or invite team members. Check the rest of the documentation for more.' },
    ],
    related: ['carrier-profile-setup', 'rest-api-overview'],
  },
  'carrier-profile-setup': {
    cat: 'Guide', badge: '📘', time: '8 min read',
    title: 'How to set up your carrier profile',
    intro: 'Add your vehicles, define your routes, and start receiving shipment requests on day one.',
    sections: [
      { title: 'Register as a carrier', body: 'During sign-up, select "Carrier" as your role. You\'ll need your company registration number, transport licence, and primary country. Verification typically takes under 2 hours.' },
      { title: 'Add your first vehicle', body: 'Navigate to Fleet Manager → Add Vehicle. Enter the registration, type (van, truck, semi-trailer), payload capacity in kg, and volume in m³. Add as many vehicles as you operate.' },
      { title: 'Define your service area', body: 'Set your primary routes and coverage areas. This helps NexFlow match you with shipments that fit your existing runs — maximizing load efficiency and reducing empty mileage.' },
      { title: 'Set your availability', body: 'Use the availability calendar to mark operating days and hours. Mark vehicles unavailable for maintenance, holidays, or planned downtime.' },
      { title: 'Accepting your first job', body: 'Once approved, shipment requests matching your capacity and routes appear in your dashboard. Accept with one click. You\'ll see pickup details, cargo specs, and payout upfront — every time.' },
    ],
    related: ['getting-started', 'rest-api-overview'],
  },
  'rest-api-overview': {
    cat: 'API', badge: '🔌', time: '10 min read',
    title: 'REST API overview',
    intro: 'Authentication, base URLs, rate limits, error codes, and your first API call.',
    sections: [
      { title: 'Base URL', body: 'All API requests go to:\n\nhttps://api.nexflow.app/v1\n\nThe API uses standard HTTP methods: GET, POST, PUT, PATCH, DELETE. All requests and responses use JSON.' },
      { title: 'Authentication', body: 'NexFlow uses JWT Bearer tokens. Include your token in every request:\n\nAuthorization: Bearer YOUR_TOKEN\n\nTokens expire after 24 hours. Use POST /auth/refresh with your refresh token to get a new one.' },
      { title: 'Rate limits', body: 'Free plan: 100 requests/hour\nGrowth plan: 5,000 requests/day\nEnterprise: unlimited\n\nRate limit headers are included in every response: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.' },
      { title: 'Error codes', body: '400 Bad Request — missing or invalid parameters\n401 Unauthorized — invalid or expired token\n403 Forbidden — insufficient permissions\n404 Not Found — resource does not exist\n429 Too Many Requests — rate limit exceeded\n500 Internal Server Error — contact support' },
      { title: 'Your first API call', body: 'List your shipments:\n\ncurl -X GET https://api.nexflow.app/v1/bookings \\\n  -H "Authorization: Bearer YOUR_TOKEN"\n\nReturns a paginated list of bookings with status, carrier, tracking ID, and timestamps.' },
    ],
    related: ['booking-api-reference', 'webhooks-guide', 'authentication-guide'],
  },
  'booking-api-reference': {
    cat: 'API', badge: '🔌', time: '12 min read',
    title: 'Booking API reference',
    intro: 'Complete reference for creating, updating, and cancelling bookings via the NexFlow API.',
    sections: [
      { title: 'Create a booking — POST /bookings', body: 'Required: pickup_address, delivery_address, cargo_weight_kg, cargo_volume_m3, pickup_date\nOptional: carrier_id (auto-assigned if omitted), notes, insurance\n\nReturns the booking object with id, status: "pending", and a list of matched carriers.' },
      { title: 'Confirm a carrier — PATCH /bookings/:id', body: 'Once you have a booking ID, confirm your carrier:\n\nPATCH /bookings/bk_12345\n{ "carrier_id": "c_abc123", "action": "confirm" }\n\nStatus changes to "confirmed" and the carrier is notified instantly.' },
      { title: 'Get booking status — GET /bookings/:id', body: 'Returns the full booking object: current status, carrier details, tracking ID, estimated delivery, and full event history.\n\nStatus lifecycle: pending → confirmed → picked_up → in_transit → delivered → completed' },
      { title: 'Cancel — DELETE /bookings/:id', body: 'Free if cancelled more than 2 hours before pickup. Late cancellations may incur a fee.\n\nDELETE /bookings/bk_12345\n{ "reason": "optional reason" }' },
      { title: 'List bookings — GET /bookings', body: 'Supports filtering by status, date range, carrier, and pagination:\n\nGET /bookings?status=in_transit&from=2026-05-01&limit=50&page=1' },
    ],
    related: ['rest-api-overview', 'webhooks-guide'],
  },
  'webhooks-guide': {
    cat: 'API', badge: '🔌', time: '7 min read',
    title: 'Webhook events guide',
    intro: 'Subscribe to shipment status changes, delivery confirmations, and carrier assignments in real time.',
    sections: [
      { title: 'What are webhooks?', body: 'Webhooks let NexFlow push events to your server as they happen. When a shipment status changes, we POST to your endpoint within seconds — no polling needed.' },
      { title: 'Register an endpoint', body: 'POST /webhooks\n{ "url": "https://yourapp.com/nexflow", "events": ["booking.confirmed", "shipment.picked_up", "shipment.delivered"] }\n\nWe\'ll send a test event to verify the endpoint is reachable.' },
      { title: 'Available events', body: 'booking.created · booking.confirmed · booking.cancelled\nshipment.picked_up · shipment.in_transit · shipment.delivered · shipment.failed\npayment.processed · payment.failed\ncarrier.assigned · carrier.unassigned' },
      { title: 'Verifying signatures', body: 'Every webhook includes X-NexFlow-Signature — an HMAC-SHA256 hash of the payload using your webhook secret. Always verify before processing to protect against spoofed requests.' },
      { title: 'Retry policy', body: 'Non-2xx response? We retry up to 5 times with exponential backoff: 1 min, 5 min, 30 min, 2 h, 6 h. After 5 failures the webhook is disabled and you\'re notified by email.' },
    ],
    related: ['rest-api-overview', 'booking-api-reference'],
  },
  'authentication-guide': {
    cat: 'API', badge: '🔌', time: '6 min read',
    title: 'Authentication & API keys',
    intro: 'JWT tokens, API keys, refresh flows, and role-based access control.',
    sections: [
      { title: 'JWT authentication', body: 'POST /auth/login with email and password. You receive access_token (24h) and refresh_token (30d). Include the access token as a Bearer header on every request.' },
      { title: 'Refreshing tokens', body: 'POST /auth/refresh\n{ "refresh_token": "YOUR_REFRESH_TOKEN" }\n\nReturns a new access_token. If the refresh token is expired, the user must log in again.' },
      { title: 'API keys', body: 'For backend integrations, generate a long-lived API key under Account → Developer → API Keys. Keys don\'t expire but can be revoked at any time. They carry the permissions of the account that created them.' },
      { title: 'Role-based permissions', body: 'Shipper: create/view/cancel own bookings, view carrier profiles\nCarrier: view/accept/reject assigned jobs, update shipment status, manage own fleet\nAdmin: full read/write on all resources\n\nActions outside your role return 403 Forbidden.' },
    ],
    related: ['rest-api-overview', 'webhooks-guide'],
  },
  'freshbox-case-study': {
    cat: 'Case Study', badge: '📊', time: '6 min read',
    title: 'How FreshBox cut shipping costs by 31%',
    intro: 'E-commerce startup FreshBox reduced their logistics spend in 90 days using NexFlow\'s carrier comparison engine.',
    sections: [
      { title: 'The challenge', body: 'FreshBox was manually calling 3–4 carriers every morning to get rates. The process took 2 hours and they were stuck with whichever carrier happened to pick up. Average cost per shipment: €18.40.' },
      { title: 'Why NexFlow', body: 'After a referral from another founder, FreshBox signed up for the Growth plan. Setup took 20 minutes. They connected their Shopify store and automated booking was live the same day.' },
      { title: 'The results', body: 'After 90 days:\n\n• Average cost per shipment: €18.40 → €12.70 (−31%)\n• Morning logistics routine: 2 hours → 5 minutes\n• On-time delivery rate: 87% → 96%' },
      { title: 'What made the difference', body: '"The carrier comparison alone paid for the subscription in the first week," said FreshBox COO Anila Mema. "But the real win was time. My team now focuses on growth instead of calling carriers."' },
      { title: 'Current usage', body: 'FreshBox now processes 300+ shipments/month across 6 carriers and 4 Balkan countries.' },
    ],
    related: ['getting-started', 'carrier-profile-setup'],
  },
  'v24-changelog': {
    cat: 'Changelog', badge: '🆕', time: 'May 2026',
    title: 'v2.4 — Live tracking improvements',
    intro: 'Sub-30-second GPS updates, geofence alerts, and a redesigned tracking map with route playback.',
    sections: [
      { title: '⚡ Sub-30s GPS updates', body: 'Tracking Service now polls carrier GPS data every 25 seconds (down from 90s). Updates propagate to the frontend via WebSocket in under 1 second. Applies to all active shipments automatically.' },
      { title: '🗺️ Redesigned tracking map', body: 'The live map now shows the full planned route as a dashed line with the vehicle\'s current position overlaid. Zoom, pan, or click any route point to see the estimated arrival time at that location.' },
      { title: '📍 Geofence alerts', body: 'Set a geofence radius around the delivery address. A push notification and webhook event fire when the carrier enters the zone — giving the recipient advance notice to prepare.' },
      { title: '⏪ Route playback', body: 'After delivery, click "Replay route" to watch a time-lapse of the full journey. Useful for auditing, dispute resolution, and SLA verification.' },
      { title: '🐛 Bug fixes', body: '• Fixed: tracking map not loading on Safari mobile\n• Fixed: duplicate webhook events for booking.confirmed\n• Fixed: incorrect ETA for cross-border shipments\n• Fixed: fleet manager showing wrong vehicle count after deletion' },
    ],
    related: ['getting-started', 'booking-api-reference'],
  },
  'v23-changelog': {
    cat: 'Changelog', badge: '🆕', time: 'April 2026',
    title: 'v2.3 — Multi-carrier booking',
    intro: 'Book shipments across multiple carriers in a single checkout. Volume discounts applied automatically.',
    sections: [
      { title: 'Multi-carrier checkout', body: 'You can now select different carriers for different shipments in a single booking session. The checkout combines them into one confirmation and one invoice.' },
      { title: 'Automatic volume discounts', body: 'Book 10+ shipments in a single session and volume discounts are applied automatically based on your plan tier. No manual negotiation needed.' },
      { title: 'Bulk CSV import', body: 'Upload a CSV with up to 500 shipments and NexFlow will auto-match each one to the best available carrier. Review the matches, adjust if needed, and confirm the whole batch.' },
      { title: '🐛 Bug fixes', body: '• Fixed: invoice total rounding error for multi-currency bookings\n• Fixed: carrier filter not persisting between page reloads\n• Fixed: mobile dashboard layout on iOS 16' },
    ],
    related: ['getting-started', 'rest-api-overview'],
  },
};

const LABELS = {
  'getting-started': 'Getting started with NexFlow',
  'carrier-profile-setup': 'How to set up your carrier profile',
  'rest-api-overview': 'REST API overview',
  'booking-api-reference': 'Booking API reference',
  'webhooks-guide': 'Webhook events guide',
  'authentication-guide': 'Authentication & API keys',
  'freshbox-case-study': 'How FreshBox cut shipping costs by 31%',
  'v24-changelog': 'v2.4 — Live tracking improvements',
  'v23-changelog': 'v2.3 — Multi-carrier booking',
};

const CAT_COLORS = { Guide: '#6c63ff', API: '#f97316', 'Case Study': '#0d9488', Changelog: '#22c55e' };
const CODE_STARTERS = ['curl', 'POST ', 'GET ', 'PATCH ', 'DELETE ', 'Authorization:', 'https://', '{ "', '400 ', '401 ', '403 ', '404 ', '429 ', '500 '];
const isCode = p => CODE_STARTERS.some(s => p.startsWith(s));

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, [slug]);

  const article = ARTICLES[slug];

  if (!article) return (
    <div style={{ fontFamily: 'var(--font-display)', background: '#fff', minHeight: '100vh' }}>
      <PublicNav scrolled={scrolled} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', flexDirection: 'column', gap: 16, paddingTop: 68 }}>
        <div style={{ fontSize: 64 }}>📭</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f172a' }}>Article not found</h1>
        <button onClick={() => navigate('/resources')} style={{ background: '#0f172a', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>← Back to Resources</button>
      </div>
      <PublicFooter />
    </div>
  );

  const color = CAT_COLORS[article.cat] || '#6c63ff';

  return (
    <div style={{ fontFamily: 'var(--font-display)', background: '#fff' }}>
      <PublicNav scrolled={scrolled} />

      {/* Header */}
      <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', paddingTop: 68 }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '44px 40px 36px' }}>
          <button onClick={() => navigate('/resources')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 20, padding: 0, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            ← All resources
          </button>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
            <span style={{ background: color + '18', color, borderRadius: 5, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>{article.badge} {article.cat}</span>
            <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'var(--font-body)' }}>{article.time}</span>
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>{article.title}</h1>
          <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.7, fontFamily: 'var(--font-body)', maxWidth: 580 }}>{article.intro}</p>
        </div>
      </div>

      {/* Body + Sidebar */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '48px 40px 80px', display: 'grid', gridTemplateColumns: '1fr 240px', gap: 56 }}>

        {/* Article content */}
        <div>
          {article.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 40, paddingBottom: 40, borderBottom: i < article.sections.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 14, letterSpacing: '-0.01em' }}>{s.title}</h2>
              {s.body.split('\n\n').map((para, j) => (
                <div key={j} style={{ marginBottom: 12 }}>
                  {isCode(para) ? (
                    <pre style={{
                      background: '#0f172a', color: '#00c896', borderRadius: 9,
                      padding: '16px 20px', fontSize: 13, fontFamily: 'monospace',
                      lineHeight: 1.65, overflowX: 'auto', border: '1px solid rgba(255,255,255,0.06)',
                      whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                    }}>{para}</pre>
                  ) : para.startsWith('•') || para.includes('\n•') ? (
                    <div style={{ fontFamily: 'var(--font-body)' }}>
                      {para.split('\n').map((line, k) => (
                        <div key={k} style={{ display: 'flex', gap: 10, marginBottom: 6, fontSize: 15, color: '#475569', lineHeight: 1.65 }}>
                          {line.startsWith('•') ? <><span style={{ color: color, flexShrink: 0 }}>•</span><span>{line.slice(2)}</span></> : <span>{line}</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.8, fontFamily: 'var(--font-body)' }}>{para}</p>
                  )}
                </div>
              ))}
            </div>
          ))}

          {/* Prev/next nav */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => navigate('/resources')} style={{ fontSize: 14, fontWeight: 700, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
              ← All resources
            </button>
            {article.related[0] && (
              <button onClick={() => navigate(`/resources/${article.related[0]}`)} style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'right', maxWidth: 260, transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = color}
                onMouseLeave={e => e.currentTarget.style.color = '#0f172a'}>
                {(LABELS[article.related[0]] || '').slice(0, 42)}{LABELS[article.related[0]]?.length > 42 ? '…' : ''} →
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 88, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* On this page */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '18px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>On this page</div>
            {article.sections.map((s, i) => (
              <div key={i} style={{ fontSize: 13, color: '#64748b', marginBottom: 8, cursor: 'pointer', fontFamily: 'var(--font-body)', lineHeight: 1.4, paddingLeft: 8, borderLeft: '2px solid transparent', transition: 'all 0.12s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderLeftColor = color; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderLeftColor = 'transparent'; }}>
                {s.title.replace(/^[0-9]+\.\s/, '').replace(/^[⚡🗺️📍⏪🐛]\s/, '')}
              </div>
            ))}
          </div>

          {/* Related */}
          {article.related.length > 0 && (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Related</div>
              {article.related.map(r => (
                <button key={r} onClick={() => navigate(`/resources/${r}`)} style={{ display: 'block', width: '100%', textAlign: 'left', fontSize: 13, color: '#0f172a', fontWeight: 600, marginBottom: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 10px', fontFamily: 'var(--font-display)', lineHeight: 1.4, borderBottom: '1px solid #f1f5f9', transition: 'color 0.12s' }}
                  onMouseEnter={e => e.currentTarget.style.color = color}
                  onMouseLeave={e => e.currentTarget.style.color = '#0f172a'}>
                  {LABELS[r]}
                </button>
              ))}
            </div>
          )}

          {/* CTA */}
          <div style={{ background: '#0f172a', borderRadius: 10, padding: '20px' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Ready to ship?</div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 14, fontFamily: 'var(--font-body)', lineHeight: 1.55 }}>Free account. No credit card required.</p>
            <button onClick={() => navigate('/register')} style={{ width: '100%', background: '#00c896', color: '#0f172a', border: 'none', borderRadius: 7, padding: '10px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>Get started free →</button>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
}
