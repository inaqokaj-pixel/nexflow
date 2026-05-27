import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function FleetManager() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ vehicle_type: 'truck', weight_kg: '', volume_m3: '', city: '', country: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function load() {
    try {
      const r = await api.getFleet();
      setVehicles((r.vehicles || []).filter(v => v.carrier_id === user.id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setAdding(true); setError(''); setSuccess('');
    try {
      await api.addVehicle({
        carrier_id: user.id,
        vehicle_type: form.vehicle_type,
        capacity: { weight_kg: Number(form.weight_kg), volume_m3: Number(form.volume_m3) },
        current_location: { city: form.city, country: form.country, coordinates: [0, 0] },
      });
      setSuccess('Vehicle added successfully!');
      setShowForm(false);
      setForm({ vehicle_type: 'truck', weight_kg: '', volume_m3: '', city: '', country: '' });
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  const vehicleEmoji = { truck: '🚛', van: '🚐', motorcycle: '🏍️', ship: '🚢', train: '🚂', plane: '✈️' };

  return (
    <div style={{ padding: '40px', maxWidth: 800, margin: '0 auto', animation: 'fadeUp 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}>My Fleet</h1>
          <p style={{ color: 'var(--gray-600)', marginTop: 4 }}>{vehicles.length} vehicles registered</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}>
          {showForm ? '✕ Cancel' : '+ Add Vehicle'}
        </button>
      </div>

      {success && <div className="success-msg" style={{ marginBottom: 20 }}>{success}</div>}

      {showForm && (
        <form onSubmit={handleAdd} className="card" style={{ marginBottom: 32, animation: 'fadeUp 0.3s ease' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 20 }}>Add New Vehicle</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Vehicle Type</label>
              <select className="input" value={form.vehicle_type} onChange={e => setForm(f => ({ ...f, vehicle_type: e.target.value }))}>
                {['truck', 'van', 'motorcycle', 'ship', 'train', 'plane'].map(t => (
                  <option key={t} value={t}>{vehicleEmoji[t]} {t.charAt(0).toUpperCase() + t.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Capacity (kg)</label>
              <input className="input" type="number" placeholder="5000" value={form.weight_kg}
                onChange={e => setForm(f => ({ ...f, weight_kg: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Volume (m³)</label>
              <input className="input" type="number" placeholder="30" value={form.volume_m3}
                onChange={e => setForm(f => ({ ...f, volume_m3: e.target.value }))} />
            </div>
            <div>
              <label className="label">Current City</label>
              <input className="input" placeholder="Tirana" value={form.city}
                onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Current Country</label>
              <input className="input" placeholder="Albania" value={form.country}
                onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required />
            </div>
          </div>
          {error && <div className="error-msg" style={{ marginTop: 12 }}>{error}</div>}
          <button type="submit" className="btn btn-primary" disabled={adding}
            style={{ marginTop: 20, justifyContent: 'center' }}>
            {adding ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Add Vehicle'}
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      ) : vehicles.length === 0 ? (
        <div className="empty-state">
          <h3>No vehicles yet</h3>
          <p>Add your first vehicle to start accepting shipments</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {vehicles.map(v => (
            <div key={v._id} className="card">
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 36 }}>{vehicleEmoji[v.vehicle_type] || '🚛'}</div>
                <div>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 15 }}>{v.vehicle_type}</div>
                  <span className={`badge badge-${v.availability?.status}`} style={{ marginTop: 4 }}>
                    {v.availability?.status}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Capacity', `${v.capacity?.weight_kg}kg / ${v.capacity?.volume_m3}m³`],
                  ['Location', `${v.current_location?.city}, ${v.current_location?.country}`],
                  ['Available from', v.availability?.available_from ? new Date(v.availability.available_from).toLocaleDateString() : 'Now'],
                ].map(([k, val]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--gray-600)' }}>{k}</span>
                    <span style={{ fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
