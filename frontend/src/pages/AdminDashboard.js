import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { api } from '../api';

// ── Mini sparkline chart ──────────────────────────────────────────────────────
function Sparkline({ data, color, height = 48 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 120, h = height;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`${color}22`} stroke="none" />
    </svg>
  );
}

// ── Activity bar chart ────────────────────────────────────────────────────────
function BarChart({ data, labels, color1 = '#f472b6', color2 = '#a78bfa' }) {
  const max = Math.max(...data.flat());
  const barW = 18, gap = 10, groupGap = 22;
  const totalW = data.length * (barW * 2 + gap + groupGap);
  return (
    <svg width="100%" height="160" viewBox={`0 0 ${totalW} 160`} preserveAspectRatio="none">
      {data.map(([a, b], i) => {
        const x = i * (barW * 2 + gap + groupGap);
        const ha = (a / max) * 120, hb = (b / max) * 120;
        return (
          <g key={i}>
            <rect x={x} y={130 - ha} width={barW} height={ha} rx="5" fill={color1} opacity="0.85" />
            <rect x={x + barW + gap} y={130 - hb} width={barW} height={hb} rx="5" fill={color2} opacity="0.85" />
            <text x={x + barW} y={150} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────
function Donut({ segments }) {
  const r = 44, cx = 54, cy = 54, stroke = 14;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;
  return (
    <svg width="108" height="108">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          />
        );
        offset += dash;
        return el;
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff" fontFamily="sans-serif">
        {total}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.4)" fontFamily="sans-serif">total</text>
    </svg>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, sparkData }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 16, padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: 6,
      position: 'relative', overflow: 'hidden',
      minWidth: 0,   /* ← prevents flex overflow */
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 16px 0 80px', background: `${color}18` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{icon}</div>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{value}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontSize: 11, color: color, fontWeight: 600 }}>{sub}</span>
        {sparkData && <Sparkline data={sparkData} color={color} />}
      </div>
    </div>
  );
}

// ── Sidebar width constant (single source of truth) ───────────────────────────
const SIDEBAR_W = 240;

// ── Admin Sidebar ─────────────────────────────────────────────────────────────
function AdminSidebar({ active, setActive }) {
  const { user, logout } = useAuth();
  const nav = [
    { key: 'dashboard',     icon: '▣',  label: 'Dashboard' },
    { key: 'users',         icon: '👥', label: 'Users' },
    { key: 'bookings',      icon: '📦', label: 'Bookings' },
    { key: 'payments',      icon: '💳', label: 'Payments' },
    { key: 'notifications', icon: '🔔', label: 'Notifications' },
  ];
  return (
    <aside style={{
      width: SIDEBAR_W,
      flexShrink: 0,
      background: 'linear-gradient(180deg,#2d1b69 0%,#1a1040 100%)',
      height: '100vh',
      position: 'sticky',   /* sticky instead of fixed → stays in flow */
      top: 0,
      alignSelf: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(135deg,#f472b6,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 16, color: '#fff', flexShrink: 0 }}>N</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 15, color: '#fff' }}>NexFlow</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* User */}
      <div style={{ padding: '14px 16px 8px' }}>
        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#f472b6,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email?.split('@')[0]}</div>
            <div style={{ fontSize: 10, color: '#f472b6', fontWeight: 700 }}>Administrator</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '8px 8px 6px' }}>Menu</div>
        {nav.map(item => (
          <button key={item.key} onClick={() => setActive(item.key)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 12px', borderRadius: 8, marginBottom: 2, border: 'none',
            background: active === item.key ? 'linear-gradient(90deg,rgba(244,114,182,0.25),rgba(167,139,250,0.15))' : 'transparent',
            color: active === item.key ? '#fff' : 'rgba(255,255,255,0.45)',
            borderLeft: active === item.key ? '3px solid #f472b6' : '3px solid transparent',
            fontSize: 13, fontWeight: active === item.key ? 700 : 400, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 12px 28px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: 'transparent', color: 'rgba(255,255,255,0.35)', border: 'none', fontSize: 13, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}>
          <span>→</span> Sign Out
        </button>
      </div>
    </aside>
  );
}

// ── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  async function load() {
    setLoadError('');
    try {
      const [uRes, bRes] = await Promise.all([
        api.adminGetUsers(),
        api.getAllBookings(),
      ]);
      setUsers(uRes.users || []);
      setBookings(bRes.bookings || []);
    } catch (e) {
      console.error(e);
      setLoadError(e.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }

  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { load(); }, []);

  async function handleDeleteUser(id) {
    if (!window.confirm('Delete this user?')) return;
    setDeletingId(id);
    try { await api.adminDeleteUser(id); await load(); }
    catch (e) { alert(e.message); }
    finally { setDeletingId(null); }
  }

  const shippers     = users.filter(u => u.role === 'shipper').length;
  const carriers     = users.filter(u => u.role === 'carrier').length;
  const totalRevenue = bookings.reduce((s, b) => s + Number(b.total_cost || 0), 0);
  const inTransit    = bookings.filter(b => b.status === 'in_transit').length;
  const delivered    = bookings.filter(b => b.status === 'delivered').length;

  const mockActivity  = [[12,8],[18,14],[9,11],[24,16],[15,20],[28,18],[22,25],[16,19],[30,22],[24,28],[18,15],[26,20]];
  const months        = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const statusColors  = { pending: '#f59e0b', confirmed: '#3b82f6', in_transit: '#a78bfa', delivered: '#34d399', cancelled: '#ef4444' };

  /* ── outer shell: flex row, full viewport height ── */
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg,#1a1040 0%,#0f0828 60%,#1a0a30 100%)',
      color: '#fff',
      overflow: 'hidden',   /* prevents horizontal scroll */
    }}>
      <AdminSidebar active={active} setActive={setActive} />

      {/* ── scrollable content column ── */}
      <main style={{
        flex: 1,
        minWidth: 0,          /* flex child: allow shrink below natural width */
        minHeight: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="spinner" style={{ width: 40, height: 40, borderTopColor: '#f472b6' }} />
          </div>
        ) : loadError ? (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: 16 }}>
            <div style={{ fontSize: 36 }}>⚠️</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#f87171' }}>Failed to load data</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', maxWidth: 360, textAlign: 'center' }}>{loadError}</div>
            <button onClick={load} style={{ marginTop: 8, padding: '8px 24px', borderRadius: 8, background: 'rgba(244,114,182,0.2)', border: '1px solid rgba(244,114,182,0.4)', color: '#f472b6', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* ── DASHBOARD TAB ── */}
            {active === 'dashboard' && (
              <div style={{ padding: '36px 36px', animation: 'fadeUp 0.35s ease' }}>
                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em' }}>
                    Good morning, <span style={{ background: 'linear-gradient(90deg,#f472b6,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.email?.split('@')[0]}</span> 👋
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Check your platform overview & schedules</p>
                </div>

                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
                  <StatCard icon="👥" label="Total Users"  value={users.length}               sub={`+${shippers} shippers`}       color="#f472b6" sparkData={[8,12,10,16,14,18,22,19,24,20,26,users.length]} />
                  <StatCard icon="📦" label="Bookings"     value={bookings.length}             sub={`${inTransit} in transit`}     color="#a78bfa" sparkData={[5,9,7,14,11,16,13,18,15,20,17,bookings.length]} />
                  <StatCard icon="💰" label="Revenue"      value={`$${totalRevenue.toFixed(0)}`} sub={`${delivered} delivered`}    color="#34d399" sparkData={[200,400,300,600,500,700,800,650,900,750,1000,totalRevenue/10]} />
                  <StatCard icon="🚚" label="Carriers"     value={carriers}                    sub={`${carriers} active fleets`}   color="#60a5fa" sparkData={[2,3,2,4,3,5,4,6,5,7,6,carriers]} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
                  {/* Activity chart */}
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '22px 24px', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Platform Activity</h3>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Bookings vs Deliveries per month</p>
                      </div>
                      <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                        {[['Bookings','#f472b6'],['Delivered','#a78bfa']].map(([l,c])=>(
                          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                            <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}
                          </div>
                        ))}
                      </div>
                    </div>
                    <BarChart data={mockActivity} labels={months} />
                  </div>

                  {/* Booking breakdown donut */}
                  <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '22px 24px' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Shipment Status</h3>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>Current distribution</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <Donut segments={[
                        { value: bookings.filter(b=>b.status==='pending').length || 1, color: '#f59e0b' },
                        { value: bookings.filter(b=>b.status==='in_transit').length || 1, color: '#a78bfa' },
                        { value: bookings.filter(b=>b.status==='delivered').length || 1, color: '#34d399' },
                        { value: bookings.filter(b=>b.status==='cancelled').length || 1, color: '#ef4444' },
                      ]} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[['Pending','#f59e0b','pending'],['In Transit','#a78bfa','in_transit'],['Delivered','#34d399','delivered'],['Cancelled','#ef4444','cancelled']].map(([l,c,s])=>(
                          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c, flexShrink: 0 }} />
                            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{l}</span>
                            <span style={{ fontWeight: 700, color: '#fff', marginLeft: 'auto', paddingLeft: 8 }}>{bookings.filter(b=>b.status===s).length}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent bookings table */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>Recent Bookings</h3>
                    <button onClick={() => setActive('bookings')} style={{ background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', borderRadius: 8, padding: '5px 14px', fontSize: 12, color: '#f472b6', fontWeight: 600, cursor: 'pointer' }}>View all</button>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 540 }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                          {['Route','Shipper','Pickup Date','Cost','Status'].map(h => (
                            <th key={h} style={{ padding: '10px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0,6).map(b => (
                          <tr key={b.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '13px 20px', fontSize: 13, fontWeight: 600 }}>{b.pickup_location?.city} → {b.delivery_location?.city}</td>
                            <td style={{ padding: '13px 20px', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{b.shipper_id?.slice(0,8)}...</td>
                            <td style={{ padding: '13px 20px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{b.pickup_date ? new Date(b.pickup_date).toLocaleDateString() : 'TBD'}</td>
                            <td style={{ padding: '13px 20px', fontSize: 13, fontWeight: 700, color: '#34d399' }}>${b.total_cost}</td>
                            <td style={{ padding: '13px 20px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${statusColors[b.status]}22`, color: statusColors[b.status], border: `1px solid ${statusColors[b.status]}44`, whiteSpace: 'nowrap' }}>
                                {b.status?.replace('_',' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── USERS TAB ── */}
            {active === 'users' && (
              <div style={{ padding: '36px 36px', animation: 'fadeUp 0.35s ease' }}>
                <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900 }}>User Management</h1>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>{users.length} registered users</p>
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {[['👥 All', users.length, '#fff'],['📦 Shippers', shippers, '#60a5fa'],['🚛 Carriers', carriers, '#34d399']].map(([l,v,c])=>(
                      <div key={l} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 18px', textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: c }}>{v}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                          {['User','Role','Joined','Actions'].map(h => (
                            <th key={h} style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => {
                          const roleColor = { shipper: '#60a5fa', carrier: '#34d399', admin: '#f472b6' };
                          return (
                            <tr key={u.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: '14px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${roleColor[u.role]}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: roleColor[u.role], flexShrink: 0 }}>
                                    {u.email[0].toUpperCase()}
                                  </div>
                                  <div style={{ minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>#{u.id.slice(0,8)}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '14px 20px' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${roleColor[u.role]}20`, color: roleColor[u.role], border: `1px solid ${roleColor[u.role]}40`, textTransform: 'capitalize' }}>
                                  {u.role}
                                </span>
                              </td>
                              <td style={{ padding: '14px 20px', fontSize: 12, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
                                {new Date(u.created_at).toLocaleDateString()}
                              </td>
                              <td style={{ padding: '14px 20px' }}>
                                {u.role !== 'admin' && (
                                  <button onClick={() => handleDeleteUser(u.id)} disabled={deletingId === u.id}
                                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, padding: '5px 14px', fontSize: 12, color: '#f87171', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}>
                                    {deletingId === u.id ? '...' : 'Remove'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── BOOKINGS TAB ── */}
            {active === 'bookings' && (
              <div style={{ padding: '36px 36px', animation: 'fadeUp 0.35s ease' }}>
                <div style={{ marginBottom: 28 }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900 }}>All Bookings</h1>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>{bookings.length} total bookings · ${totalRevenue.toFixed(2)} revenue</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                      <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                          {['ID','Route','Cargo','Pickup','Cost','Status'].map(h => (
                            <th key={h} style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b.id} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '12px 20px', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>#{b.id.slice(0,8)}</td>
                            <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 600 }}>{b.pickup_location?.city} → {b.delivery_location?.city}</td>
                            <td style={{ padding: '12px 20px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{b.cargo_details?.weight_kg}kg</td>
                            <td style={{ padding: '12px 20px', fontSize: 12, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>{b.pickup_date ? new Date(b.pickup_date).toLocaleDateString() : 'TBD'}</td>
                            <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700, color: '#34d399' }}>${b.total_cost}</td>
                            <td style={{ padding: '12px 20px' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${statusColors[b.status]}22`, color: statusColors[b.status], border: `1px solid ${statusColors[b.status]}44`, whiteSpace: 'nowrap' }}>
                                {b.status?.replace('_', ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── PAYMENTS TAB ── */}
            {active === 'payments' && (
              <div style={{ padding: '36px 36px', animation: 'fadeUp 0.35s ease' }}>
                <div style={{ marginBottom: 28 }}>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900 }}>Payment Overview</h1>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 4 }}>Total platform revenue</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                  {[
                    { icon: '💰', label: 'Total Revenue',     value: `$${totalRevenue.toFixed(2)}`,                                                                              color: '#34d399' },
                    { icon: '📦', label: 'Paid Bookings',     value: bookings.filter(b => b.status !== 'cancelled').length,                                                       color: '#a78bfa' },
                    { icon: '📊', label: 'Avg per Booking',   value: bookings.length ? `$${(totalRevenue / bookings.length).toFixed(2)}` : '$0',                                  color: '#f472b6' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '24px' }}>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 900, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ── */}
            {active === 'notifications' && (
              <div style={{ padding: '36px 36px', animation: 'fadeUp 0.35s ease' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 900, marginBottom: 8 }}>System Notifications</h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 28 }}>Platform-wide event log</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {bookings.slice(0, 10).map(b => (
                    <div key={b.id} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>📦</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Booking {b.status?.replace('_', ' ')}: {b.pickup_location?.city} → {b.delivery_location?.city}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{new Date(b.created_at).toLocaleString()} · ${b.total_cost}</div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${statusColors[b.status]}22`, color: statusColors[b.status], whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {b.status?.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}