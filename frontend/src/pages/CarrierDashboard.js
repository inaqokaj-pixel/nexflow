import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

// ─── Tracking Timeline (same as shipper view) ─────────────────────────────────
function TrackingTimeline({ bookingId, status }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  const load = useCallback(async () => {
    try {
      const r = await api.getTracking(bookingId);
      setUpdates(r.tracking || []);
      setLastFetch(new Date());
    } catch (e) { /* silent */ }
    finally { setLoading(false); }
  }, [bookingId]);

  useEffect(() => {
    load();
    if (status === 'in_transit') {
      const t = setInterval(load, 15000);
      return () => clearInterval(t);
    }
  }, [load, status]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, padding: '12px 0' }}>
      <div className="spinner" style={{ width: 14, height: 14 }} /> Loading...
    </div>
  );

  if (updates.length === 0) return (
    <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: '12px 0' }}>
      No tracking updates posted yet.
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>📍 Tracking History</span>
        {lastFetch && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Updated {lastFetch.toLocaleTimeString()}</span>}
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 15, top: 8, bottom: 8, width: 2, background: 'var(--border)' }} />
        {[...updates].reverse().map((u, i) => (
          <div key={u.id} style={{ display: 'flex', gap: 14, paddingBottom: 14, position: 'relative' }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: i === 0 ? 'var(--primary)' : '#fff',
              border: `2px solid ${i === 0 ? 'var(--primary)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, zIndex: 1,
            }}>
              {i === 0 ? '🚚' : '📍'}
            </div>
            <div style={{
              flex: 1, background: i === 0 ? 'var(--primary-light)' : 'var(--bg-2)',
              borderRadius: 8, padding: '8px 12px',
              border: `1px solid ${i === 0 ? 'rgba(108,99,255,0.3)' : 'var(--border)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: i === 0 ? 'var(--primary)' : 'inherit' }}>
                  {u.city || u.status?.replace('_', ' ')}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {new Date(u.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {u.message && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{u.message}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const CITY_COORDS = {
  'Tirana': [41.33, 19.82], 'Rome': [41.90, 12.50], 'Milan': [45.46, 9.19],
  'Paris': [48.85, 2.35], 'Berlin': [52.52, 13.40], 'Vienna': [48.21, 16.37],
  'Athens': [37.98, 23.73], 'London': [51.51, -0.13], 'Madrid': [40.42, -3.70],
  'Amsterdam': [52.37, 4.90], 'Prague': [50.08, 14.44], 'Warsaw': [52.23, 21.01],
  'Budapest': [47.50, 19.04], 'Skopje': [41.99, 21.43], 'Sofia': [42.70, 23.32],
  'Sarajevo': [43.85, 18.39], 'Zagreb': [45.81, 15.98], 'Bucharest': [44.43, 26.10],
};

function LocationUpdateModal({ booking, onClose, onSaved }) {
  const { user } = useAuth();
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const cities = Object.keys(CITY_COORDS);

  async function handleSave() {
    if (!city) return;
    setSaving(true);
    try {
      const coords = CITY_COORDS[city] || [null, null];
      await api.postLocationUpdate(booking.id, {
        city,
        latitude: coords[0],
        longitude: coords[1],
        status: booking.status,
        message: message || `Shipment passing through ${city}`,
        updated_by: user.id,
      });
      onSaved();
      onClose();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div className="card" style={{ width: 420, padding: 28 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
          📍 Post Location Update
        </h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
          {booking.pickup_location?.city} → {booking.delivery_location?.city} · #{booking.id.slice(0,8).toUpperCase()}
        </p>

        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Current City *</label>
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, marginBottom: 16, background: 'var(--bg-1)' }}
        >
          <option value="">Select city...</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Status Message</label>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="e.g. Cleared customs, on route to Vienna"
          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, marginBottom: 20, boxSizing: 'border-box', background: 'var(--bg-1)' }}
        />

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!city || saving}>
            {saving ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Post Update'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CarrierDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [locationModal, setLocationModal] = useState(null);
  const [trackingDrawer, setTrackingDrawer] = useState(null);

  async function load() {
    try {
      const [bRes, fRes] = await Promise.all([api.getAllBookings(), api.getFleet()]);
      setBookings(bRes.bookings || []);
      setFleet((fRes.vehicles || []).filter(v => v.carrier_id === user.id));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function updateStatus(id, status, shipperId) {
    setUpdating(id + status);
    try { await api.updateStatus(id, status, shipperId); await load(); }
    catch (e) { alert(e.message); }
    finally { setUpdating(null); }
  }

  const myBookings = bookings.filter(b => b.carrier_id === user.id);
  const stats = [
    { label: 'Total Jobs', value: myBookings.length, color: 'var(--primary)', bg: 'var(--primary-light)', icon: '📋' },
    { label: 'Awaiting Confirm', value: myBookings.filter(b => b.status === 'pending').length, color: 'var(--warning)', bg: 'var(--warning-light)', icon: '⏳' },
    { label: 'In Transit', value: myBookings.filter(b => b.status === 'in_transit').length, color: 'var(--info)', bg: 'var(--info-light)', icon: '🚚' },
    { label: 'Completed', value: myBookings.filter(b => b.status === 'delivered').length, color: 'var(--success)', bg: 'var(--success-light)', icon: '✅' },
  ];

  const nextStatus = { pending: 'confirmed', confirmed: 'in_transit', in_transit: 'delivered' };
  const nextLabel = { pending: 'Confirm Job', confirmed: 'Mark In Transit', in_transit: 'Mark Delivered' };
  const nextColor = { pending: 'btn-primary', confirmed: 'btn-orange', in_transit: 'btn-secondary' };

  return (
    <div className="page">
      {trackingDrawer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: 420, background: 'var(--bg-card)', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)', padding: 28, overflowY: 'auto', animation: 'slideIn 0.2s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>
                  {trackingDrawer.pickup_location?.city} → {trackingDrawer.delivery_location?.city}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  #{trackingDrawer.id.slice(0,8).toUpperCase()}
                </p>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setTrackingDrawer(null)}>✕</button>
            </div>
            <TrackingTimeline bookingId={trackingDrawer.id} status={trackingDrawer.status} />
          </div>
        </div>
      )}

      {locationModal && (
        <LocationUpdateModal
          booking={locationModal}
          onClose={() => setLocationModal(null)}
          onSaved={load}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Carrier Hub, <span style={{ color: 'var(--orange)' }}>{user.email.split('@')[0]}</span> 🚛
          </h1>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/carrier/fleet')}>Manage Fleet →</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <div className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
            {stats.map(s => (
              <div key={s.label} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
            {/* Shipment jobs */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Shipment Jobs</h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Manage and update your active shipments</p>
              </div>
              {myBookings.length === 0 ? (
                <div className="empty-state" style={{ padding: '48px 24px' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <h3>No jobs yet</h3>
                  <p>Shippers will book jobs using your vehicles</p>
                </div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th>Pickup</th>
                      <th>Cargo</th>
                      <th>Revenue</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.map(b => (
                      <tr key={b.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.pickup_location?.city} → {b.delivery_location?.city}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{b.id.slice(0,8).toUpperCase()}</div>
                        </td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{b.pickup_date ? new Date(b.pickup_date).toLocaleDateString() : 'TBD'}</td>
                        <td style={{ fontSize: 12 }}>{b.cargo_details?.weight_kg}kg</td>
                        <td style={{ fontWeight: 700, color: 'var(--success)' }}>${b.total_cost}</td>
                        <td><span className={`badge badge-${b.status}`}>{b.status.replace('_',' ')}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            {nextStatus[b.status] && (
                              <button
                                className={`btn btn-sm ${nextColor[b.status]}`}
                                onClick={() => updateStatus(b.id, nextStatus[b.status], b.shipper_id)}
                                disabled={updating === b.id + nextStatus[b.status]}
                              >
                                {updating === b.id + nextStatus[b.status]
                                  ? <span className="spinner" style={{ width: 12, height: 12 }} />
                                  : nextLabel[b.status]}
                              </button>
                            )}
                            {b.status === 'in_transit' && (
                              <button
                                className="btn btn-sm btn-ghost"
                                title="Post location update"
                                onClick={() => setLocationModal(b)}
                                style={{ fontSize: 16, padding: '4px 8px' }}
                              >
                                📍
                              </button>
                            )}
                            <button
                              className="btn btn-sm btn-ghost"
                              title="View tracking history"
                              onClick={() => setTrackingDrawer(b)}
                              style={{ fontSize: 16, padding: '4px 8px' }}
                            >
                              🗺️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Fleet sidebar */}
            <div>
              <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>My Fleet</h3>
                  <button className="btn btn-secondary btn-sm" onClick={() => navigate('/carrier/fleet')}>Add Vehicle</button>
                </div>
                {fleet.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🚛</div>
                    No vehicles yet
                  </div>
                ) : fleet.map(v => (
                  <div key={v._id} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 22 }}>🚛</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{v.vehicle_type}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{v.capacity?.weight_kg}kg · {v.current_location?.city}</div>
                    </div>
                    <span className={`badge badge-${v.availability?.status}`}>{v.availability?.status}</span>
                  </div>
                ))}
              </div>

              {/* Earnings summary */}
              <div className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>💰 Earnings</h3>
                {[
                  ['Total Revenue', `$${myBookings.reduce((sum, b) => sum + Number(b.total_cost || 0), 0).toFixed(2)}`],
                  ['Completed Jobs', myBookings.filter(b => b.status === 'delivered').length],
                  ['Active Jobs', myBookings.filter(b => ['confirmed','in_transit'].includes(b.status)).length],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
