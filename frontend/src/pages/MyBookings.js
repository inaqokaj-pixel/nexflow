import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const STEPS = ['pending', 'confirmed', 'in_transit', 'delivered'];
const STEP_LABELS = { pending: 'Pending', confirmed: 'Confirmed', in_transit: 'In Transit', delivered: 'Delivered' };
const STEP_ICONS  = { pending: '⏳', confirmed: '✅', in_transit: '🚚', delivered: '📦' };

const STATUS_ICON = { delivered: '✅', cancelled: '❌', in_transit: '🚚', confirmed: '📋', pending: '📦' };

// ─── Tracking Timeline ────────────────────────────────────────────────────────
function TrackingTimeline({ bookingId, status }) {
  const [updates, setUpdates]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  const fetch = useCallback(async () => {
    try {
      const r = await api.getTracking(bookingId);
      setUpdates(r.tracking || []);
      setLastFetch(new Date());
    } catch (e) {
      // tracking service may have no data yet — silent fail
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetch();
    // Auto-refresh every 15s if still in transit
    if (status === 'in_transit') {
      const t = setInterval(fetch, 15000);
      return () => clearInterval(t);
    }
  }, [fetch, status]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', color: 'var(--text-muted)', fontSize: 13 }}>
      <div className="spinner" style={{ width: 14, height: 14 }} /> Loading tracking data...
    </div>
  );

  if (updates.length === 0) return (
    <div style={{ padding: '14px 0', color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 18 }}>📡</span>
      No tracking updates yet — the carrier hasn't started the journey.
    </div>
  );

  const latest = updates[updates.length - 1];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>📍 Live Tracking</span>
          {status === 'in_transit' && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: 'var(--success)', background: 'var(--success-light)', padding: '2px 8px', borderRadius: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              LIVE
            </span>
          )}
        </div>
        {lastFetch && (
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Updated {lastFetch.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Current location banner */}
      {status === 'in_transit' && latest?.city && (
        <div style={{
          background: 'linear-gradient(135deg, #6c63ff15, #00c89615)',
          border: '1px solid var(--primary)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 24 }}>🚚</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Currently near <span style={{ color: 'var(--primary)' }}>{latest.city}</span></div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{latest.message}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
            {new Date(latest.created_at).toLocaleTimeString()}<br />
            {new Date(latest.created_at).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: 15, top: 8, bottom: 8,
          width: 2, background: 'var(--border)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[...updates].reverse().map((u, i) => {
            const isFirst = i === 0;
            const time = new Date(u.created_at);
            const cityIcon = u.status === 'delivered' ? '🏁'
              : u.status === 'confirmed' ? '✅'
              : u.city ? '📍' : '📋';

            return (
              <div key={u.id} style={{ display: 'flex', gap: 16, paddingBottom: 16, position: 'relative' }}>
                {/* Dot */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: isFirst ? 'var(--primary)' : '#fff',
                  border: `2px solid ${isFirst ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, zIndex: 1,
                  boxShadow: isFirst ? '0 0 0 4px rgba(108,99,255,0.15)' : 'none',
                }}>
                  {cityIcon}
                </div>

                {/* Content */}
                <div style={{
                  flex: 1, background: isFirst ? 'var(--primary-light)' : 'var(--bg-2)',
                  borderRadius: 10, padding: '10px 14px',
                  border: `1px solid ${isFirst ? 'rgba(108,99,255,0.3)' : 'var(--border)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      {u.city && (
                        <span style={{ fontWeight: 700, fontSize: 13, color: isFirst ? 'var(--primary)' : 'var(--text-primary)' }}>
                          {u.city}
                        </span>
                      )}
                      {u.status && (
                        <span style={{
                          marginLeft: u.city ? 8 : 0,
                          fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                          color: 'var(--text-muted)',
                        }}>
                          · {u.status.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right', whiteSpace: 'nowrap', marginLeft: 12 }}>
                      <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div>{time.toLocaleDateString()}</div>
                    </div>
                  </div>
                  {u.message && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                      {u.message}
                    </div>
                  )}
                  {u.latitude && u.longitude && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'monospace' }}>
                      {parseFloat(u.latitude).toFixed(4)}, {parseFloat(u.longitude).toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [updating, setUpdating]   = useState(null);
  const [filter, setFilter]       = useState('all');
  const [expanded, setExpanded]   = useState(null);
  const [activeTab, setActiveTab] = useState({}); // bookingId → 'details' | 'tracking'

  async function load() {
    try {
      const r = await api.getBookings(user.id);
      setBookings(r.bookings || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [user.id]);

  async function handleCancel(id) {
    if (!window.confirm('Cancel this shipment?')) return;
    setUpdating(id);
    try { await api.cancelBooking(id); await load(); }
    catch (e) { alert(e.message); }
    finally { setUpdating(null); }
  }

  function toggleExpand(id, defaultTab) {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      // Default to tracking tab for active shipments, details otherwise
      if (!activeTab[id]) {
        setActiveTab(t => ({ ...t, [id]: defaultTab }));
      }
    }
  }

  function setTab(bookingId, tab) {
    setActiveTab(t => ({ ...t, [bookingId]: tab }));
  }

  const filters = ['all', 'pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'];
  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>My Shipments</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>{bookings.length} total shipments</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--bg-2)', borderRadius: 10, padding: 4, width: 'fit-content', border: '1px solid var(--border)' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 7, fontSize: 12, fontWeight: 600,
            background: filter === f ? '#fff' : 'transparent',
            color: filter === f ? 'var(--text-primary)' : 'var(--text-muted)',
            border: filter === f ? '1px solid var(--border)' : '1px solid transparent',
            boxShadow: filter === f ? 'var(--shadow-sm)' : 'none',
            textTransform: 'capitalize', transition: 'all 0.15s',
          }}>{f.replace('_', ' ')}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <div className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card empty-state">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <h3>No shipments found</h3>
          <p>Try a different filter or book a new shipment</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(b => {
            const isExpanded = expanded === b.id;
            const tab = activeTab[b.id] || (b.status === 'in_transit' ? 'tracking' : 'details');
            const isLive = b.status === 'in_transit';

            return (
              <div key={b.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>

                {/* ── Row header ── */}
                <div
                  onClick={() => toggleExpand(b.id, isLive ? 'tracking' : 'details')}
                  style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer' }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    background: b.status === 'delivered' ? 'var(--success-light)' : b.status === 'cancelled' ? 'var(--danger-light)' : 'var(--primary-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  }}>
                    {STATUS_ICON[b.status] || '📦'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                      {b.pickup_location?.city}, {b.pickup_location?.country}
                      <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>→</span>
                      {b.delivery_location?.city}, {b.delivery_location?.country}
                      {isLive && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--success)', background: 'var(--success-light)', padding: '2px 7px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                          LIVE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      #{b.id.slice(0, 8).toUpperCase()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: 90 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Pickup</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {b.pickup_date ? new Date(b.pickup_date).toLocaleDateString() : 'TBD'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 70 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Weight</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{b.cargo_details?.weight_kg}kg</div>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: 80 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Cost</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--primary)' }}>${b.total_cost}</div>
                  </div>
                  <span className={`badge badge-${b.status}`} style={{ minWidth: 90, justifyContent: 'center' }}>
                    {b.status.replace('_', ' ')}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 16, transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>▾</span>
                </div>

                {/* ── Expanded panel ── */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--border)', background: 'var(--bg)', animation: 'fadeIn 0.2s ease' }}>

                    {/* Status progress bar */}
                    {b.status !== 'cancelled' && (
                      <div style={{ padding: '20px 24px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative', marginBottom: 8 }}>
                          {STEPS.map((s, i) => {
                            const currentIdx = STEPS.indexOf(b.status);
                            const done   = i <= currentIdx;
                            const active = s === b.status;
                            return (
                              <React.Fragment key={s}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1 }}>
                                  <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: done ? 'var(--primary)' : '#fff',
                                    border: `2px solid ${done ? 'var(--primary)' : 'var(--border)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 13, color: done ? '#fff' : 'var(--text-muted)',
                                    boxShadow: active ? '0 0 0 4px rgba(108,99,255,0.2)' : 'none',
                                    transition: 'all 0.3s', fontWeight: 700,
                                  }}>
                                    {done && !active ? '✓' : STEP_ICONS[s]}
                                  </div>
                                  <div style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: done ? 'var(--primary)' : 'var(--text-muted)', marginTop: 6, whiteSpace: 'nowrap' }}>
                                    {STEP_LABELS[s]}
                                  </div>
                                </div>
                                {i < STEPS.length - 1 && (
                                  <div style={{ flex: 1, height: 2, background: i < STEPS.indexOf(b.status) ? 'var(--primary)' : 'var(--border)', margin: '0 4px', marginBottom: 20, transition: 'background 0.3s' }} />
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Tab switcher */}
                    <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
                      {['details', 'tracking'].map(t => (
                        <button
                          key={t}
                          onClick={() => setTab(b.id, t)}
                          style={{
                            padding: '10px 18px', fontSize: 13, fontWeight: 600,
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: tab === t ? 'var(--primary)' : 'var(--text-muted)',
                            borderBottom: tab === t ? '2px solid var(--primary)' : '2px solid transparent',
                            marginBottom: -1, textTransform: 'capitalize',
                            transition: 'all 0.15s',
                          }}
                        >
                          {t === 'tracking' ? '📍 Tracking' : '📋 Details'}
                          {t === 'tracking' && isLive && (
                            <span style={{ marginLeft: 6, width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                          )}
                        </button>
                      ))}
                    </div>

                    <div style={{ padding: '20px 24px' }}>
                      {/* ── Details tab ── */}
                      {tab === 'details' && (
                        <>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
                            {[
                              ['Cargo', b.cargo_details?.description || 'N/A'],
                              ['Est. Delivery', b.estimated_delivery ? new Date(b.estimated_delivery).toLocaleDateString() : 'TBD'],
                              ['Carrier', b.carrier_id?.slice(0, 8) + '...'],
                              ['Booked', new Date(b.created_at).toLocaleString()],
                            ].map(([k, v]) => (
                              <div key={k} style={{ background: '#fff', borderRadius: 8, padding: '12px 14px', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{k}</div>
                                <div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div>
                              </div>
                            ))}
                          </div>

                          {(b.status === 'pending' || b.status === 'confirmed') && (
                            <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)} disabled={updating === b.id}>
                              {updating === b.id ? <span className="spinner" style={{ width: 14, height: 14 }} /> : '✕ Cancel Shipment'}
                            </button>
                          )}
                        </>
                      )}

                      {/* ── Tracking tab ── */}
                      {tab === 'tracking' && (
                        <TrackingTimeline bookingId={b.id} status={b.status} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
