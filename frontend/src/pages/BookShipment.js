import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const VEHICLE_EMOJI = { truck: '🚛', van: '🚐', semi_truck: '🚚', container: '📦', cargo_plane: '✈️', motorcycle: '🏍️', ship: '🚢', train: '🚂' };

const CARGO_TYPES = [
  { value: 'furniture',       label: '🛋️ Furniture' },
  { value: 'electronics',     label: '💻 Electronics' },
  { value: 'clothing',        label: '👕 Clothing & Textiles' },
  { value: 'food_beverage',   label: '🍎 Food & Beverage' },
  { value: 'perishables',     label: '🧊 Perishables (refrigerated)' },
  { value: 'machinery',       label: '⚙️ Machinery & Equipment' },
  { value: 'construction',    label: '🏗️ Construction Materials' },
  { value: 'automotive',      label: '🚗 Automotive Parts' },
  { value: 'pharmaceuticals', label: '💊 Pharmaceuticals' },
  { value: 'hazmat',          label: '⚠️ Hazardous Materials' },
  { value: 'documents',       label: '📄 Documents & Parcels' },
  { value: 'other',           label: '📦 Other' },
];

const WEIGHT_PRESETS = [50, 100, 250, 500, 1000, 2000, 5000, 10000];
const VOLUME_PRESETS = [1, 3, 5, 10, 20, 40, 80, 120];

function PresetPicker({ presets, value, onChange, format }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
      {presets.map(p => {
        const str = String(p);
        const active = value === str;
        return (
          <button key={p} type="button" onClick={() => onChange(str)}
            style={{
              fontSize: 11, padding: '3px 9px', borderRadius: 6, cursor: 'pointer',
              border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
              background: active ? 'var(--primary-light)' : 'transparent',
              color: active ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: active ? 700 : 400,
            }}>
            {format(p)}
          </button>
        );
      })}
    </div>
  );
}

export default function BookShipment() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [form, setForm] = useState({
    pickup_city: '', pickup_country: '',
    delivery_city: '', delivery_country: '',
    weight_kg: '', volume_m3: '',
    cargo_type: '', description: '',
    pickup_date: '', estimated_delivery: '',
    vehicle_id: '',
  });

  useEffect(() => {
    api.getFleet().then(r => setVehicles(r.vehicles || [])).catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function resetForm() {
    setStep(1);
    setBookingResult(null);
    setPaymentResult(null);
    setForm({
      pickup_city: '', pickup_country: '',
      delivery_city: '', delivery_country: '',
      weight_kg: '', volume_m3: '',
      cargo_type: '', description: '',
      pickup_date: '', estimated_delivery: '',
      vehicle_id: '',
    });
  }

  async function handleBook(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const selected = vehicles.find(v => v._id === form.vehicle_id);
      const data = await api.createBooking({
        shipper_id: user.id,
        carrier_id: selected?.carrier_id || 'unknown',
        resource_id: form.vehicle_id,
        pickup_location: { city: form.pickup_city, country: form.pickup_country },
        delivery_location: { city: form.delivery_city, country: form.delivery_country },
        cargo_details: {
          weight_kg: Number(form.weight_kg),
          volume_m3: form.volume_m3 ? Number(form.volume_m3) : undefined,
          cargo_type: form.cargo_type,
          description: form.description,
        },
        pickup_date: form.pickup_date,
        estimated_delivery: form.estimated_delivery,
      });
      setBookingResult(data.booking);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment() {
    setError(''); setLoading(true);
    try {
      const data = await api.processPayment({
        booking_id: bookingResult.id,
        user_id: user.id,
        amount: Number(bookingResult.total_cost),
        payment_method: paymentMethod,
        payment_method_id: 'pm_card_visa', // valid Stripe test PaymentMethod
      });
      setPaymentResult(data.payment);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const steps = ['Route & Cargo', 'Review & Pay', 'Confirmed'];

  return (
    <div className="page" style={{ maxWidth: 860 }}>
      <button onClick={() => navigate('/dashboard')}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, marginBottom: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
        ← Back to Dashboard
      </button>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Book a Shipment</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>Fill in the details below to book and pay for your shipment</p>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'var(--bg-2)',
                border: `2px solid ${step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'var(--border)'}`,
                color: step >= i + 1 ? '#fff' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, transition: 'all 0.3s',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: step === i + 1 ? 700 : 400, color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: step > i + 1 ? 'var(--success)' : 'var(--border)', margin: '0 12px', transition: 'background 0.3s' }} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <form onSubmit={handleBook}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Pickup */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>📍</span> Pickup Location
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label className="label">City</label><input className="input" placeholder="Tirana" value={form.pickup_city} onChange={e => set('pickup_city', e.target.value)} required /></div>
                <div><label className="label">Country</label><input className="input" placeholder="Albania" value={form.pickup_country} onChange={e => set('pickup_country', e.target.value)} required /></div>
                <div><label className="label">Pickup Date & Time</label><input className="input" type="datetime-local" value={form.pickup_date} onChange={e => set('pickup_date', e.target.value)} required /></div>
              </div>
            </div>

            {/* Delivery */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🏁</span> Delivery Location
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div><label className="label">City</label><input className="input" placeholder="Rome" value={form.delivery_city} onChange={e => set('delivery_city', e.target.value)} required /></div>
                <div><label className="label">Country</label><input className="input" placeholder="Italy" value={form.delivery_country} onChange={e => set('delivery_country', e.target.value)} required /></div>
                <div><label className="label">Estimated Delivery</label><input className="input" type="datetime-local" value={form.estimated_delivery} onChange={e => set('estimated_delivery', e.target.value)} required /></div>
              </div>
            </div>
          </div>

          {/* Cargo Details */}
          <div className="card" style={{ marginTop: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>📦</span> Cargo Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Weight */}
              <div>
                <label className="label">Weight (kg)</label>
                <input className="input" type="number" placeholder="500" value={form.weight_kg} onChange={e => set('weight_kg', e.target.value)} required />
                <PresetPicker
                  presets={WEIGHT_PRESETS}
                  value={form.weight_kg}
                  onChange={v => set('weight_kg', v)}
                  format={w => w >= 1000 ? `${w / 1000}t` : `${w}kg`}
                />
              </div>

              {/* Volume */}
              <div>
                <label className="label">
                  Volume (m³) <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 11 }}>optional</span>
                </label>
                <input className="input" type="number" placeholder="10" value={form.volume_m3} onChange={e => set('volume_m3', e.target.value)} />
                <PresetPicker
                  presets={VOLUME_PRESETS}
                  value={form.volume_m3}
                  onChange={v => set('volume_m3', v)}
                  format={v => `${v}m³`}
                />
              </div>

              {/* Cargo Type */}
              <div>
                <label className="label">Cargo Type</label>
                <select className="input" value={form.cargo_type} onChange={e => set('cargo_type', e.target.value)} required>
                  <option value="">— Select type —</option>
                  {CARGO_TYPES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="label">
                  Description <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 11 }}>optional</span>
                </label>
                <input className="input" placeholder="Additional details about the cargo…" value={form.description} onChange={e => set('description', e.target.value)} />
              </div>

            </div>
          </div>

          {/* Vehicle Select */}
          <div className="card" style={{ marginTop: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🚛</span> Select Vehicle
            </h3>
            {vehicles.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: '12px 0' }}>No vehicles available right now</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                {vehicles.map(v => (
                  <div key={v._id} onClick={() => set('vehicle_id', v._id)} style={{
                    border: `2px solid ${form.vehicle_id === v._id ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 10, padding: '14px 16px', cursor: 'pointer',
                    background: form.vehicle_id === v._id ? 'var(--primary-light)' : '#fff',
                    transition: 'all 0.15s',
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{VEHICLE_EMOJI[v.vehicle_type] || '🚛'}</div>
                    <div style={{ fontWeight: 600, fontSize: 13, textTransform: 'capitalize', marginBottom: 2 }}>
                      {v.vehicle_type.replace(/_/g, ' ')}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                      {v.capacity?.weight_kg}kg · {v.current_location?.city}
                    </div>
                    <span className="badge badge-available">Available</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <div className="error-msg" style={{ marginTop: 16 }}>{error}</div>}
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading || !form.vehicle_id}
            style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>
            {loading ? <span className="spinner" /> : 'Continue to Review →'}
          </button>
        </form>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && bookingResult && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Booking Summary */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📋 Booking Summary</h3>
              {[
                ['Booking ID', '#' + bookingResult.id.slice(0, 8).toUpperCase()],
                ['Route', `${bookingResult.pickup_location?.city} → ${bookingResult.delivery_location?.city}`],
                ['Pickup Date', new Date(bookingResult.pickup_date).toLocaleDateString()],
                ['Cargo Weight', `${bookingResult.cargo_details?.weight_kg}kg`],
                ['Cargo Type', bookingResult.cargo_details?.cargo_type || '—'],
                ['Status', bookingResult.status],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontSize: 16 }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 20 }}>${bookingResult.total_cost}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>💳 Payment Method</h3>
              <div style={{ background: 'linear-gradient(135deg, #1a1d2e, #2d2057)', borderRadius: 12, padding: '20px', marginBottom: 16, color: '#fff' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 12, letterSpacing: '0.1em' }}>CREDIT CARD</div>
                <div style={{ fontFamily: 'monospace', fontSize: 16, letterSpacing: '0.2em', marginBottom: 16 }}>4111 1111 1111 1111</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>Cardholder</span>
                  <span>{user.email.split('@')[0].toUpperCase()}</span>
                </div>
              </div>
              <select className="input" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ marginBottom: 16 }}>
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
              <div style={{ background: 'var(--success-light)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#166534' }}>
                🔒 Payment processed via Stripe test mode
              </div>
            </div>
          </div>

          {error && <div className="error-msg" style={{ marginBottom: 16 }}>{error}</div>}
          <button className="btn btn-primary btn-lg" onClick={handlePayment} disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? <span className="spinner" /> : `Pay $${bookingResult.total_cost} Now →`}
          </button>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && paymentResult && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px', animation: 'fadeUp 0.4s ease' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-light)', border: '3px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px' }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Shipment Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 14 }}>Your booking is confirmed. Check your notifications for the confirmation email.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32, textAlign: 'left', maxWidth: 480, margin: '0 auto 32px' }}>
            {[
              ['Transaction ID', paymentResult.transaction_id],
              ['Invoice', paymentResult.invoice_number],
              ['Amount Paid', `$${paymentResult.amount}`],
              ['Status', paymentResult.payment_status],
            ].map(([k, v]) => (
              <div key={k} style={{ background: 'var(--bg)', borderRadius: 8, padding: '12px 14px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace', wordBreak: 'break-all' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={() => navigate('/bookings')}>View My Shipments</button>
            <button className="btn btn-primary" onClick={resetForm}>Book Another →</button>
          </div>
        </div>
      )}
    </div>
  
  );
}
