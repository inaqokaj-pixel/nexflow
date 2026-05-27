import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const CITY_COORDS = {
  // ALBANIA
  'Tirane':[41.33,19.82],'Tirana':[41.33,19.82],'Durres':[41.32,19.45],
  'Vlore':[40.47,19.49],'Sarande':[39.88,20.00],'Shkoder':[42.07,19.51],
  'Fier':[40.72,19.56],'Korce':[40.62,20.78],'Berat':[40.71,19.95],
  'Lushnje':[40.94,19.70],'Elbasan':[41.11,20.08],'Kavaje':[41.19,19.56],
  'Gjirokaster':[40.07,20.14],'Pogradec':[40.90,20.65],'Lezhe':[41.78,19.64],
  'Kukes':[42.08,20.42],'Permet':[40.24,20.35],'Himare':[40.10,19.74],
  'Peshkopi':[41.69,20.43],'Burrel':[41.61,20.01],'Tepelene':[40.30,20.02],
  // WESTERN BALKANS
  'Skopje':[41.99,21.43],'Bitola':[41.03,21.33],'Ohrid':[41.11,20.80],
  'Pristina':[42.67,21.17],'Prizren':[42.21,20.74],'Sarajevo':[43.85,18.39],
  'Banja Luka':[44.77,17.19],'Mostar':[43.34,17.81],'Belgrade':[44.82,20.46],
  'Novi Sad':[45.26,19.83],'Nis':[43.32,21.90],'Zagreb':[45.81,15.98],
  'Split':[43.51,16.44],'Dubrovnik':[42.65,18.09],'Zadar':[44.12,15.23],
  'Rijeka':[45.33,14.44],'Osijek':[45.55,18.70],'Ljubljana':[46.05,14.51],
  'Maribor':[46.56,15.65],'Podgorica':[42.44,19.26],
  // GREECE
  'Athens':[37.98,23.73],'Thessaloniki':[40.64,22.94],'Ioannina':[39.67,20.85],
  'Patras':[38.25,21.73],'Kavala':[40.94,24.40],'Larissa':[39.64,22.42],
  'Volos':[39.36,22.94],'Alexandroupoli':[40.85,25.88],
  // BULGARIA
  'Sofia':[42.70,23.32],'Plovdiv':[42.15,24.75],'Varna':[43.21,27.91],
  'Burgas':[42.51,27.47],'Stara Zagora':[42.43,25.64],'Ruse':[43.85,25.95],
  // ROMANIA
  'Bucharest':[44.43,26.10],'Cluj':[46.77,23.60],'Timisoara':[45.75,21.23],
  'Iasi':[47.16,27.59],'Constanta':[44.18,28.65],'Brasov':[45.65,25.61],
  // HUNGARY
  'Budapest':[47.50,19.04],'Debrecen':[47.53,21.63],'Miskolc':[48.10,20.78],
  'Szeged':[46.25,20.15],'Pecs':[46.07,18.23],
  // AUSTRIA
  'Vienna':[48.21,16.37],'Graz':[47.07,15.44],'Salzburg':[47.80,13.04],
  'Innsbruck':[47.27,11.40],'Linz':[48.31,14.29],
  // CZECH & SLOVAKIA
  'Prague':[50.08,14.44],'Brno':[49.20,16.61],'Bratislava':[48.15,17.11],
  'Kosice':[48.72,21.26],'Ostrava':[49.84,18.29],
  // POLAND
  'Warsaw':[52.23,21.01],'Krakow':[50.06,19.94],'Gdansk':[54.37,18.64],
  'Wroclaw':[51.11,17.04],'Poznan':[52.41,16.93],'Katowice':[50.26,19.02],
  // GERMANY
  'Berlin':[52.52,13.40],'Hamburg':[53.55,10.00],'Munich':[48.14,11.58],
  'Frankfurt':[50.11,8.68],'Cologne':[50.94,6.96],'Stuttgart':[48.78,9.18],
  'Dresden':[51.05,13.74],'Leipzig':[51.34,12.37],'Nuremberg':[49.45,11.08],
  'Hannover':[52.37,9.74],'Dusseldorf':[51.22,6.77],
  // FRANCE
  'Paris':[48.85,2.35],'Lyon':[45.75,4.83],'Marseille':[43.30,5.37],
  'Toulouse':[43.60,1.44],'Nice':[43.71,7.26],'Bordeaux':[44.84,-0.58],
  'Strasbourg':[48.57,7.75],'Lille':[50.63,3.07],'Montpellier':[43.61,3.88],
  'Nantes':[47.22,-1.55],'Grenoble':[45.19,5.72],
  // SPAIN
  'Madrid':[40.42,-3.70],'Barcelona':[41.39,2.15],'Seville':[37.39,-5.99],
  'Valencia':[39.47,-0.38],'Bilbao':[43.26,-2.93],'Zaragoza':[41.65,-0.88],
  'Malaga':[36.72,-4.42],
  // ITALY
  'Rome':[41.90,12.50],'Milan':[45.46,9.19],'Naples':[40.85,14.27],
  'Turin':[45.07,7.69],'Florence':[43.77,11.25],'Bologna':[44.49,11.34],
  'Venice':[45.44,12.32],'Genoa':[44.41,8.93],'Verona':[45.44,10.99],
  'Trieste':[45.65,13.77],'Bari':[41.13,16.87],'Ancona':[43.62,13.51],
  // BENELUX
  'Amsterdam':[52.37,4.90],'Rotterdam':[51.92,4.48],'Brussels':[50.85,4.35],
  'Antwerp':[51.22,4.40],'Luxembourg':[49.61,6.13],
  // UK & IRELAND
  'London':[51.51,-0.13],'Birmingham':[52.49,-1.90],'Manchester':[53.48,-2.24],
  'Glasgow':[55.86,-4.25],'Edinburgh':[55.95,-3.19],'Dublin':[53.33,-6.25],
  // SWITZERLAND
  'Zurich':[47.38,8.54],'Geneva':[46.20,6.15],'Basel':[47.56,7.59],'Bern':[46.95,7.45],
  // NORDIC
  'Stockholm':[59.33,18.07],'Oslo':[59.91,10.75],'Copenhagen':[55.68,12.57],
  'Helsinki':[60.17,24.94],'Gothenburg':[57.71,11.97],
  // BALTICS
  'Riga':[56.95,24.11],'Tallinn':[59.44,24.75],'Vilnius':[54.69,25.28],
  // PORTUGAL
  'Lisbon':[38.72,-9.14],'Porto':[41.16,-8.63],
  // UKRAINE / MOLDOVA
  'Kyiv':[50.45,30.52],'Lviv':[49.84,24.03],'Chisinau':[47.01,28.86],'Odessa':[46.48,30.73],
  // TURKEY
  'Istanbul':[41.01,28.95],'Ankara':[39.92,32.85],'Izmir':[38.42,27.14],
};

// Aliases — alternate spellings mapped to canonical keys
const CITY_ALIASES = {
  'tiranë':'Tirane','tirana':'Tirane','durrës':'Durres','vlorë':'Vlore',
  'shkodër':'Shkoder','korçë':'Korce','gjirokastër':'Gjirokaster',
  'lezhë':'Lezhe','kruje':'Tirane','krujë':'Tirane','tepelena':'Tepelene',
  'münchen':'Munich','köln':'Cologne','zürich':'Zurich','wien':'Vienna',
  'roma':'Rome','venezia':'Venice','firenze':'Florence','torino':'Turin',
  'napoli':'Naples','génova':'Genoa','beograd':'Belgrade','warszawa':'Warsaw',
  'cracow':'Krakow','athina':'Athens','athena':'Athens','sevilla':'Seville',
  'kyiv':'Kyiv','kiev':'Kyiv','den haag':'Amsterdam','the hague':'Amsterdam',
};

function getCoords(city) {
  if (!city) return null;
  const trimmed = city.trim();
  const lower   = trimmed.toLowerCase();

  // 1. Exact key match
  if (CITY_COORDS[trimmed]) return CITY_COORDS[trimmed];

  // 2. Case-insensitive exact
  const exact = Object.keys(CITY_COORDS).find(k => k.toLowerCase() === lower);
  if (exact) return CITY_COORDS[exact];

  // 3. Alias
  if (CITY_ALIASES[lower]) return CITY_COORDS[CITY_ALIASES[lower]];

  // 4. Partial
  const partial = Object.keys(CITY_COORDS).find(k =>
    lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)
  );
  return partial ? CITY_COORDS[partial] : null;
}

function LiveMap({ bookings, trackingLocations }) {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const markersRef  = useRef([]);
  const [mapReady, setMapReady]   = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  // Build lookup: bookingId → latest tracking entry
  const trackingMap = {};
  (trackingLocations || []).forEach(t => { trackingMap[t.booking_id] = t; });

  // Init map once
  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;
    const L = window.L;
    if (!L) { console.error('Leaflet not loaded'); return; }

    const map = L.map(mapRef.current, {
      center: [44, 16],
      zoom: 5,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
    }).addTo(map);

    mapInstance.current = map;
    setMapReady(true);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Draw markers whenever data or map readiness changes
  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstance.current || !mapReady) return;
    const map = mapInstance.current;

    // Clear old markers
    markersRef.current.forEach(m => { try { map.removeLayer(m); } catch(e) {} });
    markersRef.current = [];

    const active = bookings.filter(b => b.status !== 'cancelled');
    let drawn = 0;
    let skipped = [];

    active.forEach(b => {
      const fromCity = b.pickup_location?.city;
      const toCity   = b.delivery_location?.city;
      const from = getCoords(fromCity);
      const to   = getCoords(toCity);

      if (!from || !to) {
        skipped.push(`${fromCity} → ${toCity}`);
        return;
      }

      drawn++;
      const statusColor = {
        pending:    '#f59e0b',
        confirmed:  '#3b82f6',
        in_transit: '#00c896',
        delivered:  '#22c55e',
      };
      const color = statusColor[b.status] || '#6c63ff';

      // Route line
      const line = L.polyline([from, to], {
        color, weight: 2, opacity: 0.6, dashArray: '6 4',
      }).addTo(map);

      // Origin dot
      const fromIcon = L.divIcon({
        html: `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 6px ${color}"></div>`,
        iconSize: [10, 10], iconAnchor: [5, 5], className: '',
      });
      const fromM = L.marker(from, { icon: fromIcon })
        .bindPopup(`<b>Origin:</b> ${fromCity}`)
        .addTo(map);

      // Destination pulse
      const toIcon = L.divIcon({
        html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 10px ${color}"></div>`,
        iconSize: [12, 12], iconAnchor: [6, 6], className: '',
      });
      const toM = L.marker(to, { icon: toIcon })
        .bindPopup(`<b>${fromCity} → ${toCity}</b><br/>Status: <b>${b.status.replace('_',' ')}</b><br/>Cost: $${b.total_cost}`)
        .addTo(map);

      markersRef.current.push(line, fromM, toM);

      // Truck for in_transit — use real tracking coords or midpoint
      if (b.status === 'in_transit') {
        const tracked = trackingMap[b.id];
        let truckPos;
        if (tracked?.latitude && tracked?.longitude) {
          truckPos = [parseFloat(tracked.latitude), parseFloat(tracked.longitude)];
        } else {
          truckPos = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
        }

        const truckIcon = L.divIcon({
          html: `<div style="font-size:20px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.6))">🚚</div>`,
          iconSize: [24, 24], iconAnchor: [12, 12], className: '',
        });
        const truck = L.marker(truckPos, { icon: truckIcon })
          .bindPopup(
            tracked?.city
              ? `<b>Currently near ${tracked.city}</b><br/>${tracked.message || ''}`
              : `<b>In transit:</b> ${fromCity} → ${toCity}`
          )
          .addTo(map);
        markersRef.current.push(truck);
      }
    });

    setDebugInfo({ total: active.length, drawn, skipped });

    // Auto-fit map to markers if any were drawn
    if (drawn > 0 && markersRef.current.length > 0) {
      try {
        const group = L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.2));
      } catch (e) { /* bounds may be invalid for single point */ }
    }
  }, [bookings, trackingLocations, mapReady]);

  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
      {/* Legend */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 500, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[
          { color: '#f59e0b', label: 'Pending' },
          { color: '#3b82f6', label: 'Confirmed' },
          { color: '#00c896', label: 'In Transit' },
          { color: '#22c55e', label: 'Delivered' },
        ].map(l => (
          <div key={l.label} style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: l.color }} />
            <span style={{ fontSize: 11, color: '#fff', fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Live badge */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 500, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '6px 12px' }}>
        <span style={{ fontSize: 11, color: '#00c896', fontWeight: 700 }}>● LIVE</span>
      </div>

      {/* Debug info — shown when something is skipped */}
      {debugInfo?.skipped?.length > 0 && (
        <div style={{ position: 'absolute', bottom: 12, left: 12, zIndex: 500, background: 'rgba(239,68,68,0.9)', borderRadius: 8, padding: '6px 12px', maxWidth: 280 }}>
          <div style={{ fontSize: 11, color: '#fff', fontWeight: 700, marginBottom: 2 }}>
            ⚠️ {debugInfo.skipped.length} route(s) not plotted — cities not in map:
          </div>
          {debugInfo.skipped.map((s, i) => (
            <div key={i} style={{ fontSize: 10, color: '#fecaca' }}>{s}</div>
          ))}
        </div>
      )}

      {/* No shipments state */}
      {debugInfo?.drawn === 0 && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(15,23,42,0.85)', borderRadius: 12, padding: '16px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🗺️</div>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>No active routes to display</div>
            <div style={{ color: '#94a3b8', fontSize: 11, marginTop: 4 }}>Book a shipment to see it here</div>
          </div>
        </div>
      )}

      <div ref={mapRef} style={{ height: 400, width: '100%', background: '#0f172a' }} />
    </div>
  );
}

export default function ShipperDashboard() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [bookings,          setBookings]          = useState([]);
  const [notifications,     setNotifications]     = useState([]);
  const [trackingLocations, setTrackingLocations] = useState([]);
  const [loading,           setLoading]           = useState(true);

  const loadTracking = useCallback(async () => {
    try {
      const r = await api.getActiveLocations();
      setTrackingLocations(r.locations || []);
    } catch (e) { console.error('Tracking fetch:', e.message); }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [bRes, nRes] = await Promise.all([
          api.getBookings(user.id),
          api.getNotifications(user.id),
        ]);
        setBookings(bRes.bookings || []);
        setNotifications(nRes.notifications || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }

    load();
    loadTracking();

    const interval = setInterval(() => { load(); loadTracking(); }, 30000);
    return () => clearInterval(interval);
  }, [user.id, loadTracking]);

  const counts = {
    total:      bookings.length,
    pending:    bookings.filter(b => b.status === 'pending').length,
    in_transit: bookings.filter(b => b.status === 'in_transit').length,
    delivered:  bookings.filter(b => b.status === 'delivered').length,
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Welcome back, <span style={{ color: 'var(--primary)' }}>{user.email.split('@')[0]}</span> 👋
          </h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/book')} style={{ borderRadius: 8 }}>
          + Book Shipment
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <div className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Total Shipments', value: counts.total,      color: '#6c63ff', bg: '#ede9ff', icon: '📦' },
              { label: 'Pending',         value: counts.pending,     color: '#f59e0b', bg: '#fef3c7', icon: '⏳' },
              { label: 'In Transit',      value: counts.in_transit,  color: '#3b82f6', bg: '#dbeafe', icon: '🚚' },
              { label: 'Delivered',       value: counts.delivered,   color: '#22c55e', bg: '#dcfce7', icon: '✅' },
            ].map(s => (
              <div key={s.label} className="stat-card" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{s.icon}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Live Shipment Map</h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                  {bookings.filter(b => b.status === 'in_transit').length} in transit · {bookings.filter(b => b.status !== 'cancelled' && b.status !== 'delivered').length} active routes shown
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={loadTracking} style={{ fontSize: 12 }}>↻ Refresh</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)' }} />
                  Every 30s
                </div>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <LiveMap bookings={bookings} trackingLocations={trackingLocations} />
            </div>
          </div>

          {/* Bottom grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            {/* Recent shipments */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Recent Shipments</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/bookings')}>View all →</button>
              </div>
              {bookings.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                  <h3>No shipments yet</h3>
                  <p style={{ marginBottom: 16 }}>Book your first shipment to get started</p>
                  <button className="btn btn-primary" onClick={() => navigate('/book')}>Book Now</button>
                </div>
              ) : (
                <table className="table">
                  <thead><tr><th>Route</th><th>Date</th><th>Cost</th><th>Status</th></tr></thead>
                  <tbody>
                    {bookings.slice(0, 5).map(b => (
                      <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/bookings')}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.pickup_location?.city} → {b.delivery_location?.city}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.cargo_details?.weight_kg}kg</div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{new Date(b.created_at).toLocaleDateString()}</td>
                        <td style={{ fontWeight: 700 }}>${b.total_cost}</td>
                        <td><span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Notifications */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Notifications</h2>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notifications')}>All →</button>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🔔</div>No notifications
                  </div>
                ) : notifications.slice(0, 6).map((n, i) => (
                  <div key={n.id} style={{ padding: '12px 20px', borderBottom: i < 5 ? '1px solid var(--border-light)' : 'none', display: 'flex', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, flexShrink: 0, background: n.subject?.includes('Payment') ? '#dcfce7' : '#ede9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                      {n.subject?.includes('Payment') ? '💳' : '📦'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.subject}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{new Date(n.created_at).toLocaleString()}</div>
                    </div>
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
