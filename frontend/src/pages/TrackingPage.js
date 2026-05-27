import React, { useEffect, useState, useRef, useCallback } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

// ── City coords (same as ShipperDashboard) ────────────────────────────────────
const CITY_COORDS = {
  'Tirane':[41.33,19.82],'Tirana':[41.33,19.82],'Durres':[41.32,19.45],
  'Vlore':[40.47,19.49],'Sarande':[39.88,20.00],'Shkoder':[42.07,19.51],
  'Fier':[40.72,19.56],'Korce':[40.62,20.78],'Berat':[40.71,19.95],
  'Lushnje':[40.94,19.70],'Elbasan':[41.11,20.08],'Kavaje':[41.19,19.56],
  'Gjirokaster':[40.07,20.14],'Pogradec':[40.90,20.65],'Lezhe':[41.78,19.64],
  'Kukes':[42.08,20.42],'Permet':[40.24,20.35],'Himare':[40.10,19.74],
  'Peshkopi':[41.69,20.43],'Burrel':[41.61,20.01],'Tepelene':[40.30,20.02],
  'Skopje':[41.99,21.43],'Bitola':[41.03,21.33],'Ohrid':[41.11,20.80],
  'Pristina':[42.67,21.17],'Prizren':[42.21,20.74],'Sarajevo':[43.85,18.39],
  'Banja Luka':[44.77,17.19],'Mostar':[43.34,17.81],'Belgrade':[44.82,20.46],
  'Novi Sad':[45.26,19.83],'Nis':[43.32,21.90],'Zagreb':[45.81,15.98],
  'Split':[43.51,16.44],'Dubrovnik':[42.65,18.09],'Zadar':[44.12,15.23],
  'Rijeka':[45.33,14.44],'Osijek':[45.55,18.70],'Ljubljana':[46.05,14.51],
  'Maribor':[46.56,15.65],'Podgorica':[42.44,19.26],
  'Athens':[37.98,23.73],'Thessaloniki':[40.64,22.94],'Ioannina':[39.67,20.85],
  'Patras':[38.25,21.73],'Kavala':[40.94,24.40],'Larissa':[39.64,22.42],
  'Volos':[39.36,22.94],'Alexandroupoli':[40.85,25.88],
  'Sofia':[42.70,23.32],'Plovdiv':[42.15,24.75],'Varna':[43.21,27.91],
  'Burgas':[42.51,27.47],'Stara Zagora':[42.43,25.64],'Ruse':[43.85,25.95],
  'Bucharest':[44.43,26.10],'Cluj':[46.77,23.60],'Timisoara':[45.75,21.23],
  'Iasi':[47.16,27.59],'Constanta':[44.18,28.65],'Brasov':[45.65,25.61],
  'Budapest':[47.50,19.04],'Debrecen':[47.53,21.63],'Miskolc':[48.10,20.78],
  'Szeged':[46.25,20.15],'Pecs':[46.07,18.23],
  'Vienna':[48.21,16.37],'Graz':[47.07,15.44],'Salzburg':[47.80,13.04],
  'Innsbruck':[47.27,11.40],'Linz':[48.31,14.29],
  'Prague':[50.08,14.44],'Brno':[49.20,16.61],'Bratislava':[48.15,17.11],
  'Kosice':[48.72,21.26],'Ostrava':[49.84,18.29],
  'Warsaw':[52.23,21.01],'Krakow':[50.06,19.94],'Gdansk':[54.37,18.64],
  'Wroclaw':[51.11,17.04],'Poznan':[52.41,16.93],'Katowice':[50.26,19.02],
  'Berlin':[52.52,13.40],'Hamburg':[53.55,10.00],'Munich':[48.14,11.58],
  'Frankfurt':[50.11,8.68],'Cologne':[50.94,6.96],'Stuttgart':[48.78,9.18],
  'Dresden':[51.05,13.74],'Leipzig':[51.34,12.37],'Nuremberg':[49.45,11.08],
  'Hannover':[52.37,9.74],'Dusseldorf':[51.22,6.77],
  'Paris':[48.85,2.35],'Lyon':[45.75,4.83],'Marseille':[43.30,5.37],
  'Toulouse':[43.60,1.44],'Nice':[43.71,7.26],'Bordeaux':[44.84,-0.58],
  'Strasbourg':[48.57,7.75],'Lille':[50.63,3.07],'Montpellier':[43.61,3.88],
  'Nantes':[47.22,-1.55],'Grenoble':[45.19,5.72],
  'Madrid':[40.42,-3.70],'Barcelona':[41.39,2.15],'Seville':[37.39,-5.99],
  'Valencia':[39.47,-0.38],'Bilbao':[43.26,-2.93],'Zaragoza':[41.65,-0.88],
  'Malaga':[36.72,-4.42],
  'Rome':[41.90,12.50],'Milan':[45.46,9.19],'Naples':[40.85,14.27],
  'Turin':[45.07,7.69],'Florence':[43.77,11.25],'Bologna':[44.49,11.34],
  'Venice':[45.44,12.32],'Genoa':[44.41,8.93],'Verona':[45.44,10.99],
  'Trieste':[45.65,13.77],'Bari':[41.13,16.87],'Ancona':[43.62,13.51],
  'Amsterdam':[52.37,4.90],'Rotterdam':[51.92,4.48],'Brussels':[50.85,4.35],
  'Antwerp':[51.22,4.40],'Luxembourg':[49.61,6.13],
  'London':[51.51,-0.13],'Birmingham':[52.49,-1.90],'Manchester':[53.48,-2.24],
  'Glasgow':[55.86,-4.25],'Edinburgh':[55.95,-3.19],'Dublin':[53.33,-6.25],
  'Zurich':[47.38,8.54],'Geneva':[46.20,6.15],'Basel':[47.56,7.59],'Bern':[46.95,7.45],
  'Stockholm':[59.33,18.07],'Oslo':[59.91,10.75],'Copenhagen':[55.68,12.57],
  'Helsinki':[60.17,24.94],'Gothenburg':[57.71,11.97],
  'Riga':[56.95,24.11],'Tallinn':[59.44,24.75],'Vilnius':[54.69,25.28],
  'Lisbon':[38.72,-9.14],'Porto':[41.16,-8.63],
  'Kyiv':[50.45,30.52],'Lviv':[49.84,24.03],'Chisinau':[47.01,28.86],'Odessa':[46.48,30.73],
  'Istanbul':[41.01,28.95],'Ankara':[39.92,32.85],'Izmir':[38.42,27.14],
};

const CITY_ALIASES = {
  'tiranë':'Tirane','tirana':'Tirane','durrës':'Durres','vlorë':'Vlore',
  'shkodër':'Shkoder','korçë':'Korce','gjirokastër':'Gjirokaster',
  'lezhë':'Lezhe','münchen':'Munich','köln':'Cologne','zürich':'Zurich',
  'wien':'Vienna','roma':'Rome','venezia':'Venice','firenze':'Florence',
  'torino':'Turin','napoli':'Naples','beograd':'Belgrade','athina':'Athens',
  'kyiv':'Kyiv','kiev':'Kyiv',
};

function getCoords(city) {
  if (!city) return null;
  const trimmed = city.trim();
  const lower = trimmed.toLowerCase();
  if (CITY_COORDS[trimmed]) return CITY_COORDS[trimmed];
  const exact = Object.keys(CITY_COORDS).find(k => k.toLowerCase() === lower);
  if (exact) return CITY_COORDS[exact];
  if (CITY_ALIASES[lower]) return CITY_COORDS[CITY_ALIASES[lower]];
  const partial = Object.keys(CITY_COORDS).find(k =>
    lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)
  );
  return partial ? CITY_COORDS[partial] : null;
}

function formatETA(ms) {
  if (!ms || ms <= 0) return 'Arriving soon';
  const minutes = Math.round(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `~${mins} min`;
  return `~${hours}h ${mins}m`;
}

function formatDistance(route) {
  if (!route) return null;
  const cities = route.split(' → ');
  return `${cities.length - 1} stop${cities.length > 2 ? 's' : ''}`;
}

// ── Map Component ──────────────────────────────────────────────────────────────
function TrackingMap({ bookings, locations, selected, onSelect }) {
  const mapRef      = useRef(null);
  const mapInstance = useRef(null);
  const markersRef  = useRef([]);
  const [ready, setReady] = useState(false);

  // location lookup by booking_id
  const locMap = {};
  (locations || []).forEach(l => { locMap[l.booking_id] = l; });

  useEffect(() => {
    if (mapInstance.current || !mapRef.current) return;
    const L = window.L;
    if (!L) return;
    const map = L.map(mapRef.current, {
      center: [44, 16], zoom: 4,
      zoomControl: true, attributionControl: false,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    mapInstance.current = map;
    setReady(true);
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; } };
  }, []);

  // Zoom to selected booking
  useEffect(() => {
    if (!ready || !selected || !mapInstance.current) return;
    const loc = locMap[selected];
    if (loc?.latitude && loc?.longitude) {
      mapInstance.current.flyTo([parseFloat(loc.latitude), parseFloat(loc.longitude)], 7, { duration: 1 });
    }
  }, [selected, ready]);

  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstance.current || !ready) return;
    const map = mapInstance.current;

    markersRef.current.forEach(m => { try { map.removeLayer(m); } catch(e) {} });
    markersRef.current = [];

    bookings.filter(b => b.status !== 'cancelled').forEach(b => {
      const from = getCoords(b.pickup_location?.city);
      const to   = getCoords(b.delivery_location?.city);
      if (!from || !to) return;

      const isSelected = selected === b.id;
      const statusColor = {
        pending: '#f59e0b', confirmed: '#3b82f6',
        in_transit: '#00c896', delivered: '#22c55e',
      };
      const color  = statusColor[b.status] || '#6c63ff';
      const weight = isSelected ? 3 : 2;
      const opacity = isSelected ? 0.9 : (b.status === 'delivered' ? 0.3 : 0.6);

      const line = L.polyline([from, to], {
        color, weight, opacity, dashArray: b.status === 'delivered' ? null : '6 4',
      }).addTo(map);
      line.on('click', () => onSelect(b.id));

      // Origin
      const fromIcon = L.divIcon({
        html: `<div style="width:${isSelected?12:8}px;height:${isSelected?12:8}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 ${isSelected?10:5}px ${color}"></div>`,
        iconSize: [12,12], iconAnchor: [6,6], className: '',
      });
      const fromM = L.marker(from, { icon: fromIcon }).addTo(map);
      fromM.on('click', () => onSelect(b.id));

      // Destination
      const toIcon = L.divIcon({
        html: `<div style="width:${isSelected?14:10}px;height:${isSelected?14:10}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 ${isSelected?14:8}px ${color}"></div>`,
        iconSize: [14,14], iconAnchor: [7,7], className: '',
      });
      const toM = L.marker(to, { icon: toIcon })
        .bindPopup(`<b>${b.pickup_location?.city} → ${b.delivery_location?.city}</b><br/>Status: ${b.status.replace('_',' ')}<br/>Cost: $${b.total_cost}`)
        .addTo(map);
      toM.on('click', () => onSelect(b.id));

      // Truck for in_transit
      if (b.status === 'in_transit') {
        const loc = locMap[b.id];
        const truckPos = loc?.latitude && loc?.longitude
          ? [parseFloat(loc.latitude), parseFloat(loc.longitude)]
          : [(from[0]+to[0])/2, (from[1]+to[1])/2];

        const truckIcon = L.divIcon({
          html: `<div style="font-size:${isSelected?24:18}px;line-height:1;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.7));transition:all 0.3s">🚚</div>`,
          iconSize: [28,28], iconAnchor: [14,14], className: '',
        });
        const truck = L.marker(truckPos, { icon: truckIcon, zIndexOffset: 1000 })
          .bindPopup(loc?.city ? `<b>Near ${loc.city}</b><br/>${loc.message || ''}` : 'In transit')
          .addTo(map);
        truck.on('click', () => onSelect(b.id));
        markersRef.current.push(truck);
      }

      markersRef.current.push(line, fromM, toM);
    });

    // Auto-fit if no selection
    if (!selected && markersRef.current.length > 0) {
      try {
        const group = L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.2));
      } catch(e) {}
    }
  }, [bookings, locations, selected, ready]);

  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
      {/* Legend */}
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 500, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {[['#f59e0b','Pending'],['#3b82f6','Confirmed'],['#00c896','In Transit'],['#22c55e','Delivered']].map(([c,l]) => (
          <div key={l} style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '3px 9px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
            <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>{l}</span>
          </div>
        ))}
      </div>
      {/* Live badge */}
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 500, background: 'rgba(15,23,42,0.85)', borderRadius: 8, padding: '4px 10px' }}>
        <span style={{ fontSize: 11, color: '#00c896', fontWeight: 700 }}>● LIVE</span>
      </div>
      <div ref={mapRef} style={{ height: 420, width: '100%', background: '#0f172a' }} />
    </div>
  );
}

// ── Timeline Component ─────────────────────────────────────────────────────────
function Timeline({ bookingId, eta }) {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const r = await api.getTracking(bookingId);
      setUpdates(r.tracking || []);
    } catch(e) {}
    finally { setLoading(false); }
  }, [bookingId]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 16, color: 'var(--text-muted)', fontSize: 13 }}>
      <div className="spinner" style={{ width: 14, height: 14 }} /> Loading...
    </div>
  );

  if (!updates.length) return (
    <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 6 }}>📡</div>
      No tracking updates yet
    </div>
  );

  return (
    <div style={{ padding: '0 16px 16px' }}>
      {/* ETA banner */}
      {eta && eta.steps_remaining > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,200,150,0.1))',
          border: '1px solid rgba(108,99,255,0.3)', borderRadius: 10,
          padding: '10px 14px', marginBottom: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>ESTIMATED ARRIVAL</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>{eta.eta_label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {new Date(eta.eta_timestamp).toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>DESTINATION</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>📍 {eta.destination}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {eta.steps_remaining} stop{eta.steps_remaining !== 1 ? 's' : ''} remaining
            </div>
          </div>
        </div>
      )}

      {/* Route breadcrumb */}
      {eta?.route && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 14, background: 'var(--bg-2)', borderRadius: 8, padding: '8px 12px', lineHeight: 1.8, wordBreak: 'break-word' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>Full route: </span>
          {eta.route}
        </div>
      )}

      {/* Timeline entries */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 15, top: 8, bottom: 8, width: 2, background: 'var(--border)' }} />
        {[...updates].reverse().map((u, i) => (
          <div key={u.id} style={{ display: 'flex', gap: 14, paddingBottom: 12 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0, zIndex: 1,
              background: i === 0 ? 'var(--primary)' : 'var(--white)',
              border: `2px solid ${i === 0 ? 'var(--primary)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
              boxShadow: i === 0 ? '0 0 0 3px rgba(108,99,255,0.2)' : 'none',
            }}>
              {u.status === 'delivered' ? '🏁' : u.status === 'confirmed' ? '✅' : u.city ? '📍' : '📋'}
            </div>
            <div style={{
              flex: 1, borderRadius: 8, padding: '8px 12px',
              background: i === 0 ? 'var(--primary-light)' : 'var(--bg-2)',
              border: `1px solid ${i === 0 ? 'rgba(108,99,255,0.25)' : 'var(--border)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: i === 0 ? 'var(--primary)' : 'inherit' }}>
                  {u.city || u.status?.replace('_',' ')}
                  {u.status && u.city && (
                    <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6 }}>
                      · {u.status.replace('_',' ')}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: 8 }}>
                  {new Date(u.created_at).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}<br/>
                  {new Date(u.created_at).toLocaleDateString()}
                </div>
              </div>
              {u.message && <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{u.message}</div>}
              {u.latitude && u.longitude && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, fontFamily: 'monospace' }}>
                  {parseFloat(u.latitude).toFixed(4)}, {parseFloat(u.longitude).toFixed(4)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function TrackingPage() {
  const { user } = useAuth();
  const [bookings,   setBookings]   = useState([]);
  const [locations,  setLocations]  = useState([]);
  const [stats,      setStats]      = useState(null);
  const [selected,   setSelected]   = useState(null);
  const [selectedETA, setSelectedETA] = useState(null);
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const load = useCallback(async () => {
    try {
      const calls = user?.role === 'carrier'
        ? [api.getAllBookings(), api.getActiveLocations(), api.getTrackingStats()]
        : [api.getBookings(user.id), api.getActiveLocations(), api.getTrackingStats()];

      const [bRes, lRes, sRes] = await Promise.all(calls);
      setBookings(bRes.bookings || []);
      setLocations(lRes.locations || []);
      setStats(sRes);
      setLastUpdate(new Date());
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  }, [user]);

  // Load ETA when selection changes
  useEffect(() => {
    if (!selected) { setSelectedETA(null); return; }
    api.getTrackingETA(selected)
      .then(r => setSelectedETA(r.eta))
      .catch(() => setSelectedETA(null));
  }, [selected]);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  const locMap = {};
  (locations || []).forEach(l => { locMap[l.booking_id] = l; });

  const filtered = bookings.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return b.id.toLowerCase().includes(q)
      || b.pickup_location?.city?.toLowerCase().includes(q)
      || b.delivery_location?.city?.toLowerCase().includes(q)
      || b.status?.toLowerCase().includes(q);
  });

  const active    = filtered.filter(b => b.status === 'in_transit');
  const others    = filtered.filter(b => b.status !== 'in_transit' && b.status !== 'cancelled');
  const cancelled = filtered.filter(b => b.status === 'cancelled');
  const displayed = [...active, ...others, ...cancelled];

  const selectedBooking = bookings.find(b => b.id === selected);

  const statusColor = { pending:'#f59e0b', confirmed:'#3b82f6', in_transit:'#00c896', delivered:'#22c55e', cancelled:'#ef4444' };

  return (
    <div className="page" style={{ maxWidth: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
            📍 Live Tracking
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
            Real-time shipment locations across Europe
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {lastUpdate && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Updated {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button className="btn btn-secondary btn-sm" onClick={load} style={{ fontSize: 12 }}>
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Active Shipments',  value: stats.active_bookings, icon: '🚚', color: '#00c896' },
            { label: 'Updates Today',     value: stats.updates_today,   icon: '📡', color: '#3b82f6' },
            { label: 'Total Updates',     value: stats.total_updates,   icon: '📊', color: '#6c63ff' },
            { label: 'In Transit',        value: bookings.filter(b=>b.status==='in_transit').length, icon: '⚡', color: '#f59e0b' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 22 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 16, alignItems: 'start' }}>
        {/* ── Left panel ── */}
        <div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 12 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)' }}>🔍</span>
            <input
              type="text"
              placeholder="Search city, booking ID, status..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: 10, border: '1.5px solid var(--border)', fontSize: 13, boxSizing: 'border-box', background: 'var(--white)' }}
            />
          </div>

          {/* Shipment list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 'calc(100vh - 320px)', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                <div className="spinner" style={{ width: 28, height: 28 }} />
              </div>
            ) : displayed.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                No shipments found
              </div>
            ) : displayed.map(b => {
              const loc = locMap[b.id];
              const isSelected = selected === b.id;
              const color = statusColor[b.status] || '#6c63ff';
              const isLive = b.status === 'in_transit';

              return (
                <div
                  key={b.id}
                  onClick={() => setSelected(isSelected ? null : b.id)}
                  style={{
                    background: isSelected ? 'var(--primary-light)' : 'var(--white)',
                    border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                    transition: 'all 0.15s',
                    opacity: b.status === 'cancelled' ? 0.5 : 1,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>
                      {b.pickup_location?.city} → {b.delivery_location?.city}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {isLive && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00c896', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                      )}
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                    </div>
                  </div>

                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', marginBottom: 6 }}>
                    #{b.id.slice(0,8).toUpperCase()}
                  </div>

                  {/* Current location if in transit */}
                  {isLive && loc?.city && (
                    <div style={{ fontSize: 12, color: '#00c896', fontWeight: 600, marginBottom: 4 }}>
                      📍 Near {loc.city}
                    </div>
                  )}

                  {/* ETA if selected */}
                  {isSelected && selectedETA && selectedETA.steps_remaining > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, marginBottom: 4 }}>
                      ⏱ ETA: {selectedETA.eta_label}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`badge badge-${b.status}`} style={{ fontSize: 10 }}>
                      {b.status.replace('_',' ')}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>${b.total_cost}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Map */}
          <TrackingMap
            bookings={bookings}
            locations={locations}
            selected={selected}
            onSelect={setSelected}
          />

          {/* Selected booking detail */}
          {selected && selectedBooking ? (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>
                    {selectedBooking.pickup_location?.city} → {selectedBooking.delivery_location?.city}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2 }}>
                    #{selected.slice(0,8).toUpperCase()} · {selectedBooking.cargo_details?.weight_kg}kg
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className={`badge badge-${selectedBooking.status}`}>
                    {selectedBooking.status.replace('_',' ')}
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={() => setSelected(null)} style={{ fontSize: 16, padding: '4px 8px' }}>✕</button>
                </div>
              </div>
              <Timeline bookingId={selected} eta={selectedETA} />
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🗺️</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Select a shipment</div>
              <div style={{ fontSize: 12 }}>Click any route on the map or a shipment in the list to see full tracking details and ETA</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
