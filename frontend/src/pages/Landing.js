import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Tracking demo state machine ─────────────────────────── */
const STEPS = [
  { key: 'booked',    label: 'Shipment booked',    time: 'Mon 08:02',  loc: 'Tirana, AL',      icon: '📋', color: '#6c63ff' },
  { key: 'pickup',    label: 'Picked up by DHL',   time: 'Mon 09:15',  loc: 'Tirana Hub',       icon: '📦', color: '#f97316' },
  { key: 'transit',   label: 'In transit',          time: 'Mon 11:40',  loc: 'Pristina, XK',    icon: '🚛', color: '#3b82f6' },
  { key: 'customs',   label: 'Customs cleared',    time: 'Mon 14:30',  loc: 'Skopje, MK',      icon: '✅', color: '#0d9488' },
  { key: 'delivery',  label: 'Out for delivery',   time: 'Tue 09:00',  loc: 'Sofia, BG',        icon: '🏃', color: '#f59e0b' },
  { key: 'delivered', label: 'Delivered',           time: 'Tue 11:22',  loc: 'Sofia — Signed', icon: '🎉', color: '#22c55e' },
];

const TESTIMONIALS = [
  {
    quote: 'We cut our monthly freight bill by €3,400 in the first 60 days. The carrier comparison alone paid for a year of Growth plan subscriptions.',
    name: 'Anila Mema',
    role: 'COO, FreshBox',
    avatar: 'AM',
    gradient: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
    metric: '−31% costs',
    metricColor: '#22c55e',
  },
  {
    quote: "Getting paid in 48 hours changed our cash flow completely. Before NexFlow we waited 45 days on invoices. Now it's automatic.",
    name: 'Arben Koci',
    role: 'Owner, AlbaTrans',
    avatar: 'AK',
    gradient: 'linear-gradient(135deg,#f97316,#f59e0b)',
    metric: '48h payment',
    metricColor: '#f97316',
  },
  {
    quote: "I used to spend two hours every morning getting quotes. Now I review 8 carrier options in 20 seconds and click confirm. That's it.",
    name: 'Mihai Popa',
    role: 'Logistics Manager, RoFreight SRL',
    avatar: 'MP',
    gradient: 'linear-gradient(135deg,#0d9488,#3b82f6)',
    metric: '2h → 20s',
    metricColor: '#0d9488',
  },
];

const LOGOS = [
  { name: 'FreshBox',     sector: 'E-commerce' },
  { name: 'AlbaTrans',    sector: 'Logistics' },
  { name: 'RoFreight',    sector: 'Freight' },
  { name: 'Besa Cargo',   sector: 'Cargo' },
  { name: 'EuroShip',     sector: 'Shipping' },
  { name: 'AdriaMover',   sector: 'Moving' },
  { name: 'BalkanPost',   sector: 'Parcels' },
  { name: 'NordLogix',    sector: 'Supply Chain' },
];

const CARRIERS = ['DHL Express','FedEx','Maersk','DB Cargo','GLS','UPS','DSV','TNT','Rhenus','Glovo','Spring GDS','Packeta'];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled]       = useState(false);
  const [loginOpen, setLoginOpen]     = useState(false);
  const [trackStep, setTrackStep]     = useState(0);
  const [trackRunning, setTrackRunning] = useState(true);
  const loginRef = useRef(null);
  const trackRef = useRef(null);

  /* nav scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* login dropdown close on outside click */
  useEffect(() => {
    const fn = e => { if (loginRef.current && !loginRef.current.contains(e.target)) setLoginOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  /* tracking demo auto-advance */
  useEffect(() => {
    if (!trackRunning) return;
    const t = setInterval(() => {
      setTrackStep(s => {
        if (s >= STEPS.length - 1) { setTrackRunning(false); return s; }
        return s + 1;
      });
    }, 1600);
    return () => clearInterval(t);
  }, [trackRunning]);

  const restartDemo = () => { setTrackStep(0); setTrackRunning(true); };

  return (
    <div style={{ fontFamily: 'var(--font-display)', overflowX: 'hidden', background: '#fff' }}>

      {/* ════════════════════════════════════════
          NAV
      ════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 48px', height: 68, display: 'flex', alignItems: 'center',
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.07)' : 'none',
        transition: 'all 0.25s',
      }}>
        <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer', background:'none', border:'none', marginRight:36 }}>
          <div style={{ width:32, height:32, borderRadius:7, background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', color:'#00c896', fontWeight:900, fontSize:15 }}>N</div>
          <span style={{ fontWeight:900, fontSize:17, color:'#0f172a', letterSpacing:'-0.02em' }}>NexFlow</span>
        </button>
        <div style={{ display:'flex', gap:4, alignItems:'center' }}>
          {[['Platform','/platform'],['Carriers','/carriers'],['Solutions','/solutions'],['Pricing','/pricing'],['Resources','/resources']].map(([l,p]) => (
            <button key={l} onClick={() => navigate(p)} style={{ fontSize:14, fontWeight:600, color:'#0f172a', opacity:0.7, cursor:'pointer', background:'transparent', border:'none', padding:'7px 12px', borderRadius:6, transition:'opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity=1}
              onMouseLeave={e => e.currentTarget.style.opacity=0.7}>{l}</button>
          ))}
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:10, alignItems:'center' }}>
          <div ref={loginRef} style={{ position:'relative' }}>
            <button onClick={() => setLoginOpen(o=>!o)} style={{ fontSize:14, fontWeight:600, color:'#0f172a', cursor:'pointer', background: loginOpen?'rgba(0,0,0,0.05)':'transparent', border:'none', padding:'7px 14px', borderRadius:6, textDecoration:'underline', textUnderlineOffset:3 }}>Login</button>
            {loginOpen && (
              <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, background:'#fff', border:'1px solid #e2e8f0', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', padding:'6px 0', minWidth:170, zIndex:999 }}>
                {[['📦 Shipping app','/login'],['🔌 API portal','/login'],['🚛 Carrier portal','/login']].map(([l,p]) => (
                  <button key={l} onClick={()=>navigate(p)} style={{ width:'100%', padding:'10px 18px', fontSize:13, fontWeight:600, color:'#0f172a', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', transition:'background 0.12s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>{l}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => navigate('/contact')} style={{ background:'transparent', color:'#0f172a', border:'2px solid rgba(15,23,42,0.22)', borderRadius:7, padding:'7px 16px', fontSize:14, fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='#0f172a';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(15,23,42,0.22)';}}>Contact sales</button>
          <button onClick={() => navigate('/register')} style={{ background:'#0f172a', color:'#fff', border:'none', borderRadius:7, padding:'8px 18px', fontSize:14, fontWeight:700, cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='#1e293b'}
            onMouseLeave={e=>e.currentTarget.style.background='#0f172a'}>Get started</button>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section style={{ background:'#00c896', minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', overflow:'hidden', paddingTop:68 }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, right:-80, width:500, height:500, borderRadius:'50%', background:'rgba(0,0,0,0.05)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1200, margin:'0 auto', padding:'80px 60px 60px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center', position:'relative', zIndex:2, width:'100%' }}>

          {/* LEFT */}
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(0,0,0,0.1)', borderRadius:50, padding:'5px 16px', fontSize:13, fontWeight:700, color:'#0f172a', marginBottom:28 }}>
              🚀 40+ carriers · 12 countries · live tracking
            </div>
            <h1 style={{ fontSize:62, fontWeight:900, color:'#0f172a', lineHeight:1.04, letterSpacing:'-0.04em', marginBottom:22 }}>
              Stop calling<br />carriers.<br />Start shipping.
            </h1>
            <p style={{ fontSize:17, color:'#0f172a', opacity:0.72, maxWidth:430, lineHeight:1.7, marginBottom:36, fontFamily:'var(--font-body)' }}>
              Compare rates from 40+ carriers in under a second. Book in one click. Track live from pickup to delivery.
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:36 }}>
              <button onClick={() => navigate('/register')} style={{ background:'#0f172a', color:'#fff', border:'none', borderRadius:9, padding:'15px 28px', fontSize:15, fontWeight:800, cursor:'pointer', transition:'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none';}}>
                Get started free →
              </button>
              <button onClick={() => navigate('/platform')} style={{ background:'rgba(0,0,0,0.10)', color:'#0f172a', border:'none', borderRadius:9, padding:'15px 28px', fontSize:15, fontWeight:700, cursor:'pointer' }}>
                See how it works
              </button>
            </div>
            {/* Social proof strip */}
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ display:'flex' }}>
                {['#6c63ff','#f97316','#0d9488','#3b82f6','#22c55e'].map((c,i) => (
                  <div key={i} style={{ width:30, height:30, borderRadius:'50%', background:c, border:'2px solid #00c896', marginLeft: i===0?0:-8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#fff', fontWeight:900, zIndex:5-i }}>
                    {['A','B','E','M','D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:'flex', gap:2, marginBottom:2 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color:'#0f172a', fontSize:13 }}>★</span>)}
                </div>
                <div style={{ fontSize:12, color:'rgba(15,23,42,0.7)', fontFamily:'var(--font-body)', fontWeight:600 }}>500+ businesses trust NexFlow</div>
              </div>
            </div>
          </div>

          {/* RIGHT — Dashboard mockup */}
          <div>
            <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 32px 80px rgba(0,0,0,0.22)', overflow:'hidden', border:'1px solid rgba(0,0,0,0.08)' }}>
              {/* Browser chrome */}
              <div style={{ background:'#f1f5f9', padding:'9px 14px', display:'flex', alignItems:'center', gap:6, borderBottom:'1px solid #e2e8f0' }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width:9, height:9, borderRadius:'50%', background:c }} />)}
                <div style={{ flex:1, background:'#fff', borderRadius:4, margin:'0 10px', padding:'2px 10px', fontSize:11, color:'#94a3b8', border:'1px solid #e2e8f0' }}>nexflow.app/dashboard</div>
              </div>
              <div style={{ background:'#f8fafc', padding:'16px' }}>
                {/* Stat cards */}
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:12 }}>
                  {[
                    { l:'Shipments', v:'1,284', c:'#6c63ff', i:'📦' },
                    { l:'In Transit', v:'47',   c:'#3b82f6', i:'🚚' },
                    { l:'Delivered', v:'1,201', c:'#22c55e', i:'✅' },
                    { l:'Saved',     v:'€4.2k', c:'#f97316', i:'💰' },
                  ].map(s => (
                    <div key={s.l} style={{ background:'#fff', borderRadius:8, padding:'10px 12px', border:'1px solid #e2e8f0' }}>
                      <div style={{ fontSize:14, marginBottom:3 }}>{s.i}</div>
                      <div style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:800, color:s.c }}>{s.v}</div>
                      <div style={{ fontSize:9, color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', marginTop:1 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                {/* Live tracking strip */}
                <div style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)', borderRadius:9, padding:'14px 16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Live shipments</div>
                    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#22c55e', fontWeight:700 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', animation:'pulse 2s ease-in-out infinite' }} /> 47 active
                    </div>
                  </div>
                  {[
                    { id:'NX-2847', from:'Tirana → Sofia',    carrier:'DHL',  status:'In transit', color:'#3b82f6' },
                    { id:'NX-2851', from:'Vienna → Belgrade', carrier:'GLS',  status:'Delivered',  color:'#22c55e' },
                    { id:'NX-2863', from:'Skopje → Pristina', carrier:'UPS',  status:'Picked up',  color:'#f97316' },
                  ].map(s => (
                    <div key={s.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                      <span style={{ fontSize:10, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', flexShrink:0 }}>{s.id}</span>
                      <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', flex:1, fontFamily:'var(--font-body)' }}>{s.from}</span>
                      <span style={{ fontSize:10, color:'rgba(255,255,255,0.4)' }}>{s.carrier}</span>
                      <span style={{ fontSize:10, fontWeight:700, color:s.color, background:s.color+'20', padding:'2px 7px', borderRadius:4 }}>{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CARRIER TICKER
      ════════════════════════════════════════ */}
      <div style={{ background:'#0f172a', padding:'14px 0', overflow:'hidden', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'flex', gap:48, animation:'marquee 24s linear infinite', width:'max-content' }}>
          {[...CARRIERS,...CARRIERS].map((c,i) => (
            <span key={i} style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.38)', whiteSpace:'nowrap' }}>● {c}</span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          TRUSTED BY
      ════════════════════════════════════════ */}
      <section style={{ background:'#fff', padding:'56px 60px', borderBottom:'1px solid #f1f5f9' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:36 }}>
            <p style={{ fontSize:13, fontWeight:700, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'0.1em' }}>Trusted by 500+ businesses across Europe</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:8 }}>
            {LOGOS.map(l => (
              <div key={l.name} style={{ border:'1px solid #e2e8f0', borderRadius:8, padding:'12px 8px', textAlign:'center', transition:'all 0.18s', cursor:'default' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#0f172a'; e.currentTarget.style.background='#f8fafc';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='#fff';}}>
                <div style={{ fontSize:11, fontWeight:900, color:'#0f172a', marginBottom:2 }}>{l.name}</div>
                <div style={{ fontSize:10, color:'#94a3b8' }}>{l.sector}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PAIN SECTION — "The old way"
      ════════════════════════════════════════ */}
      <section style={{ background:'#f8fafc', padding:'90px 60px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#ef4444', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>BEFORE NEXFLOW</div>
            <h2 style={{ fontSize:44, fontWeight:900, color:'#0f172a', letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:14 }}>
              Sound familiar?
            </h2>
            <p style={{ fontSize:16, color:'#475569', fontFamily:'var(--font-body)', maxWidth:460, margin:'0 auto', lineHeight:1.7 }}>
              This is how freight logistics still works for most businesses. It doesn't have to.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginBottom:52 }}>
            {[
              { icon:'📞', pain:'Calling 4 carriers every morning to get rates — and still not knowing if you got the best price.', time:'~2 hrs/day' },
              { icon:'📊', pain:'Tracking shipments by calling the driver directly and updating a spreadsheet by hand.', time:'Zero visibility' },
              { icon:'🧾', pain:'Chasing invoices for 30–60 days, reconciling across 5 different carrier billing systems.', time:'30–60 day delays' },
            ].map(p => (
              <div key={p.icon} style={{ background:'#fff', border:'1.5px solid #fecaca', borderRadius:14, padding:'28px', position:'relative' }}>
                <div style={{ position:'absolute', top:16, right:16, fontSize:11, fontWeight:700, color:'#ef4444', background:'#fef2f2', padding:'3px 8px', borderRadius:4 }}>{p.time}</div>
                <div style={{ fontSize:36, marginBottom:14 }}>{p.icon}</div>
                <p style={{ fontSize:15, color:'#475569', lineHeight:1.7, fontFamily:'var(--font-body)' }}>{p.pain}</p>
              </div>
            ))}
          </div>
          {/* Arrow */}
          <div style={{ textAlign:'center', fontSize:36, marginBottom:32, color:'#00c896' }}>↓</div>
          <div style={{ background:'#0f172a', borderRadius:16, padding:'40px 48px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:32, textAlign:'center' }}>
            {[
              { icon:'⚡', title:'Instant quotes', desc:'40+ carrier rates in under 1 second. No calls needed.' },
              { icon:'📍', title:'Live GPS tracking', desc:'30-second location updates from pickup to delivery.' },
              { icon:'💰', title:'Automated billing', desc:'One invoice, all carriers. Carriers paid in 48 hours.' },
            ].map(s => (
              <div key={s.title}>
                <div style={{ fontSize:32, marginBottom:12 }}>{s.icon}</div>
                <div style={{ fontSize:16, fontWeight:800, color:'#fff', marginBottom:6 }}>{s.title}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,0.5)', fontFamily:'var(--font-body)', lineHeight:1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          LIVE TRACKING DEMO
      ════════════════════════════════════════ */}
      <section style={{ background:'#fff', padding:'90px 60px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center' }}>
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:'#00c896', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:12 }}>LIVE TRACKING</div>
            <h2 style={{ fontSize:44, fontWeight:900, color:'#0f172a', letterSpacing:'-0.03em', lineHeight:1.1, marginBottom:18 }}>
              Know exactly where your shipment is. Always.
            </h2>
            <p style={{ fontSize:15, color:'#475569', lineHeight:1.75, fontFamily:'var(--font-body)', marginBottom:28 }}>
              Real-time GPS updates every 30 seconds. Your customers get a live tracking link the moment a shipment is picked up — no login required. Automated alerts at every milestone.
            </p>
            {[
              '30-second GPS location updates',
              'Automated SMS + email milestone alerts',
              'Shareable public tracking link for customers',
              'Full route history and delivery confirmation',
            ].map(b => (
              <div key={b} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'#e0fef4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#00c896', fontWeight:900, flexShrink:0 }}>✓</div>
                <span style={{ fontSize:14, color:'#475569', fontFamily:'var(--font-body)' }}>{b}</span>
              </div>
            ))}
            <div style={{ marginTop:28, display:'flex', gap:12 }}>
              <button onClick={() => navigate('/register')} style={{ background:'#0f172a', color:'#fff', border:'none', borderRadius:9, padding:'13px 24px', fontSize:14, fontWeight:800, cursor:'pointer' }}>Try live tracking →</button>
              <button onClick={() => navigate('/platform')} style={{ background:'#f8fafc', color:'#0f172a', border:'1.5px solid #e2e8f0', borderRadius:9, padding:'13px 24px', fontSize:14, fontWeight:700, cursor:'pointer' }}>Learn more</button>
            </div>
          </div>

          {/* INTERACTIVE TRACKING DEMO */}
          <div ref={trackRef}>
            <div style={{ background:'#0f172a', borderRadius:16, padding:'24px', boxShadow:'0 24px 64px rgba(0,0,0,0.18)' }}>
              {/* Header */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.35)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:4 }}>TRACKING</div>
                  <div style={{ fontSize:16, fontWeight:900, color:'#fff', letterSpacing:'0.05em', fontFamily:'monospace' }}>NX-2847-TIR</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:3 }}>Carrier</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>DHL Express</div>
                </div>
              </div>

              {/* Route bar */}
              <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:8, padding:'12px 16px', marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginBottom:3 }}>FROM</div>
                  <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>Tirana 🇦🇱</div>
                </div>
                <div style={{ flex:1, margin:'0 12px', position:'relative', height:2, background:'rgba(255,255,255,0.1)', borderRadius:1 }}>
                  <div style={{ position:'absolute', top:0, left:0, height:'100%', background:'#00c896', borderRadius:1, width:`${(trackStep/(STEPS.length-1))*100}%`, transition:'width 0.6s ease' }} />
                  <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', fontSize:16, left:`calc(${(trackStep/(STEPS.length-1))*100}% - 8px)`, transition:'left 0.6s ease' }}>🚛</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,0.35)', marginBottom:3 }}>TO</div>
                  <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>Sofia 🇧🇬</div>
                </div>
              </div>

              {/* Current status badge */}
              <div style={{ background:STEPS[trackStep].color+'22', border:`1px solid ${STEPS[trackStep].color}44`, borderRadius:8, padding:'10px 14px', marginBottom:16, display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:STEPS[trackStep].color, animation: trackStep < STEPS.length-1 ? 'pulse 1.5s ease-in-out infinite' : 'none' }} />
                <div>
                  <div style={{ fontSize:13, fontWeight:800, color:'#fff' }}>{STEPS[trackStep].label}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.45)', fontFamily:'var(--font-body)' }}>{STEPS[trackStep].loc} · {STEPS[trackStep].time}</div>
                </div>
              </div>

              {/* Steps timeline */}
              <div style={{ marginBottom:16 }}>
                {STEPS.map((s, i) => (
                  <div key={s.key} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <div style={{
                      width:22, height:22, borderRadius:'50%', flexShrink:0,
                      background: i <= trackStep ? s.color : 'rgba(255,255,255,0.08)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10, transition:'background 0.4s',
                      border: i === trackStep ? `2px solid ${s.color}` : '2px solid transparent',
                      boxShadow: i === trackStep ? `0 0 0 3px ${s.color}33` : 'none',
                    }}>
                      {i < trackStep ? '✓' : i === trackStep ? '●' : ''}
                    </div>
                    <div style={{ flex:1, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span style={{ fontSize:12, fontWeight: i <= trackStep ? 700 : 400, color: i <= trackStep ? '#fff' : 'rgba(255,255,255,0.3)', transition:'all 0.3s' }}>{s.label}</span>
                      <span style={{ fontSize:11, color: i <= trackStep ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', fontFamily:'var(--font-body)' }}>{s.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div style={{ display:'flex', gap:8, borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:14 }}>
                <button onClick={restartDemo} style={{ flex:1, background:'rgba(0,200,150,0.12)', color:'#00c896', border:'1px solid rgba(0,200,150,0.25)', borderRadius:7, padding:'9px', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,200,150,0.2)';}}
                  onMouseLeave={e=>{e.currentTarget.style.background='rgba(0,200,150,0.12)';}}>
                  ↺ Replay demo
                </button>
                <button onClick={() => navigate('/register')} style={{ flex:1, background:'#00c896', color:'#0f172a', border:'none', borderRadius:7, padding:'9px', fontSize:12, fontWeight:800, cursor:'pointer' }}>
                  Try it live →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS
      ════════════════════════════════════════ */}
      <section style={{ background:'#0f172a', padding:'80px 60px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:0, textAlign:'center' }}>
          {[
            { value:'500+',  label:'Businesses',         sub:'across Europe',   color:'#00c896' },
            { value:'40+',   label:'Carrier partners',   sub:'and growing',     color:'#a78bfa' },
            { value:'€10M+', label:'Freight processed',  sub:'this year',       color:'#f97316' },
            { value:'31%',   label:'Avg cost savings',   sub:'vs booking direct',color:'#22c55e' },
            { value:'99.9%', label:'Platform uptime',    sub:'SLA guaranteed',  color:'#3b82f6' },
          ].map((s,i) => (
            <div key={s.label} style={{ padding:'20px', borderRight: i<4 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontSize:46, fontWeight:900, color:s.color, lineHeight:1, marginBottom:8, fontFamily:'var(--font-display)' }}>{s.value}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:3 }}>{s.label}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.35)', fontFamily:'var(--font-body)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section style={{ background:'#f8fafc', padding:'90px 60px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#00c896', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>CUSTOMER STORIES</div>
            <h2 style={{ fontSize:44, fontWeight:900, color:'#0f172a', letterSpacing:'-0.03em' }}>Real results, real businesses</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background:'#fff', border:'1px solid #e2e8f0', borderRadius:16, padding:'32px', display:'flex', flexDirection:'column', gap:20, transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.09)'; e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)';}}>
                {/* Metric badge */}
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:t.metricColor+'12', border:`1px solid ${t.metricColor}30`, borderRadius:6, padding:'5px 12px', width:'fit-content' }}>
                  <span style={{ fontSize:13, fontWeight:900, color:t.metricColor }}>{t.metric}</span>
                </div>
                <p style={{ fontSize:15, color:'#0f172a', lineHeight:1.75, fontFamily:'var(--font-body)', fontStyle:'italic', flex:1 }}>
                  "{t.quote}"
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:t.gradient, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:14, flexShrink:0 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:'#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize:12, color:'#94a3b8', fontFamily:'var(--font-body)' }}>{t.role}</div>
                  </div>
                  <div style={{ marginLeft:'auto', display:'flex', gap:1 }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ color:'#f59e0b', fontSize:12 }}>★</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section style={{ background:'#fff', padding:'90px 60px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#00c896', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>HOW IT WORKS</div>
            <h2 style={{ fontSize:44, fontWeight:900, color:'#0f172a', letterSpacing:'-0.03em' }}>Book your first shipment in 3 steps</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[
              { n:'1', icon:'📦', title:'Describe your shipment', desc:'Enter pickup, delivery, cargo weight, and dimensions. Choose your pickup date. Takes 60 seconds.', color:'#6c63ff' },
              { n:'2', icon:'⚡', title:'Pick your carrier', desc:'Compare real-time rates from 40+ carriers. Filter by price, transit time, or rating. Confirm with one click.', color:'#00c896' },
              { n:'3', icon:'📍', title:'Track until delivered', desc:"Live GPS updates from pickup to doorstep. Your customer automatically gets a public tracking link.", color:'#f97316' },
            ].map((s,i) => (
              <div key={s.n} style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:14, padding:'32px 28px', position:'relative', transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='#fff'; e.currentTarget.style.borderColor=s.color; e.currentTarget.style.boxShadow=`0 8px 24px rgba(0,0,0,0.08)`;}}
                onMouseLeave={e=>{e.currentTarget.style.background='#f8fafc'; e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.boxShadow='none';}}>
                <div style={{ width:44, height:44, borderRadius:'50%', background:'#0f172a', color:s.color, fontWeight:900, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>{s.n}</div>
                <div style={{ fontSize:32, marginBottom:14 }}>{s.icon}</div>
                <h3 style={{ fontSize:18, fontWeight:800, color:'#0f172a', marginBottom:8 }}>{s.title}</h3>
                <p style={{ fontSize:14, color:'#64748b', lineHeight:1.7, fontFamily:'var(--font-body)' }}>{s.desc}</p>
                {i < 2 && <div style={{ position:'absolute', top:'50%', right:-20, transform:'translateY(-50%)', fontSize:24, color:'#cbd5e1', zIndex:2 }}>→</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <button onClick={() => navigate('/register')} style={{ background:'#0f172a', color:'#fff', border:'none', borderRadius:9, padding:'14px 32px', fontSize:15, fontWeight:800, cursor:'pointer', transition:'all 0.15s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='#1e293b';}}
              onMouseLeave={e=>{e.currentTarget.style.background='#0f172a';}}>
              Book your first shipment →
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRICING TEASER
      ════════════════════════════════════════ */}
      <section style={{ background:'#f8fafc', padding:'90px 60px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#00c896', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>PRICING</div>
          <h2 style={{ fontSize:44, fontWeight:900, color:'#0f172a', letterSpacing:'-0.03em', marginBottom:14 }}>Start free. Scale as you grow.</h2>
          <p style={{ fontSize:16, color:'#475569', fontFamily:'var(--font-body)', maxWidth:440, margin:'0 auto 48px', lineHeight:1.7 }}>
            No per-shipment fees. No hidden carrier charges. One flat plan for everything.
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
            {[
              { name:'Starter', price:'Free', desc:'50 shipments/month, 10+ carriers', color:'#64748b', cta:'Get started' },
              { name:'Growth',  price:'€79/mo', desc:'500 shipments, 40+ carriers, API access', color:'#6c63ff', cta:'Start free trial', highlight:true },
              { name:'Enterprise', price:'Custom', desc:'Unlimited, dedicated support, SLA', color:'#0f172a', cta:'Contact sales' },
            ].map(p => (
              <div key={p.name} style={{ background: p.highlight ? '#0f172a' : '#fff', border:`1.5px solid ${p.highlight ? 'transparent' : '#e2e8f0'}`, borderRadius:14, padding:'28px 24px', position:'relative', transform: p.highlight ? 'scale(1.02)' : 'none', boxShadow: p.highlight ? '0 16px 48px rgba(0,0,0,0.18)' : 'none' }}>
                {p.highlight && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'#00c896', color:'#0f172a', borderRadius:20, padding:'4px 14px', fontSize:11, fontWeight:800, whiteSpace:'nowrap' }}>⭐ Most popular</div>}
                <div style={{ fontSize:13, fontWeight:700, color: p.highlight ? 'rgba(255,255,255,0.5)' : '#94a3b8', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.06em' }}>{p.name}</div>
                <div style={{ fontSize:32, fontWeight:900, color: p.highlight ? '#fff' : '#0f172a', marginBottom:6 }}>{p.price}</div>
                <div style={{ fontSize:13, color: p.highlight ? 'rgba(255,255,255,0.5)' : '#64748b', fontFamily:'var(--font-body)', marginBottom:20, lineHeight:1.5 }}>{p.desc}</div>
                <button onClick={() => p.name === 'Enterprise' ? navigate('/contact') : navigate('/register')} style={{ width:'100%', background: p.highlight ? '#00c896' : p.name === 'Enterprise' ? '#0f172a' : '#f1f5f9', color: p.highlight ? '#0f172a' : p.name === 'Enterprise' ? '#fff' : '#0f172a', border:'none', borderRadius:8, padding:'11px', fontSize:13, fontWeight:800, cursor:'pointer' }}>
                  {p.cta} →
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/pricing')} style={{ background:'transparent', border:'none', color:'#64748b', fontSize:14, fontWeight:600, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3 }}>
            Compare all plans in detail →
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════ */}
      <section style={{ background:'#00c896', padding:'90px 60px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />
        <div style={{ position:'relative', zIndex:2 }}>
          <h2 style={{ fontSize:54, fontWeight:900, color:'#0f172a', letterSpacing:'-0.04em', lineHeight:1.05, marginBottom:16 }}>
            Ready to ship smarter?
          </h2>
          <p style={{ fontSize:17, color:'rgba(15,23,42,0.65)', marginBottom:36, fontFamily:'var(--font-body)', maxWidth:400, margin:'0 auto 36px', lineHeight:1.7 }}>
            Join 500+ businesses saving time and money on freight. Free to start, no credit card required.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={() => navigate('/register')} style={{ background:'#0f172a', color:'#fff', border:'none', borderRadius:9, padding:'15px 30px', fontSize:15, fontWeight:800, cursor:'pointer', transition:'transform 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.transform='translateY(-1px)'}
              onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
              Start shipping for free →
            </button>
            <button onClick={() => navigate('/contact')} style={{ background:'rgba(0,0,0,0.10)', color:'#0f172a', border:'none', borderRadius:9, padding:'15px 30px', fontSize:15, fontWeight:700, cursor:'pointer' }}>
              Talk to an expert
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer style={{ background:'#0f172a', padding:'64px 60px 36px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr 1fr', gap:48, marginBottom:52 }}>
            <div>
              <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, background:'none', border:'none', cursor:'pointer', padding:0 }}>
                <div style={{ width:30, height:30, borderRadius:6, background:'#00c896', display:'flex', alignItems:'center', justifyContent:'center', color:'#0f172a', fontWeight:900, fontSize:14 }}>N</div>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:16, color:'#fff' }}>NexFlow</span>
              </button>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)', lineHeight:1.65, fontFamily:'var(--font-body)', marginBottom:16 }}>
                Smart freight platform connecting shippers and carriers across Europe.
              </p>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.2)', borderRadius:5, padding:'4px 10px' }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', animation:'pulse 2s ease-in-out infinite' }} />
                <span style={{ fontSize:11, fontWeight:700, color:'#22c55e' }}>All systems operational</span>
              </div>
            </div>
            {[
              { title:'Platform', links:[['Overview','/platform'],['Live Tracking','/platform'],['Fleet Management','/platform'],['API','/resources']] },
              { title:'Solutions', links:[['For Shippers','/solutions'],['For Carriers','/carriers'],['Enterprise','/solutions'],['Pricing','/pricing']] },
              { title:'Resources', links:[['Documentation','/resources'],['API Docs','/resources/rest-api-overview'],['Case Studies','/resources'],['Changelog','/resources/v24-changelog']] },
              { title:'Company',  links:[['About us','/about'],['Carriers','/carriers'],['Contact','/contact'],['Newsroom','/about']] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.28)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:16 }}>{col.title}</div>
                {col.links.map(([l,p]) => (
                  <button key={l} onClick={() => navigate(p)} style={{ display:'block', fontSize:13, color:'rgba(255,255,255,0.48)', marginBottom:10, cursor:'pointer', fontFamily:'var(--font-body)', transition:'color 0.15s', background:'none', border:'none', textAlign:'left', padding:0 }}
                    onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                    onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.48)'}>{l}</button>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.22)', fontFamily:'var(--font-body)' }}>© 2026 NexFlow Technologies. All rights reserved.</span>
            <div style={{ display:'flex', gap:20 }}>
              {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
                <span key={l} style={{ fontSize:12, color:'rgba(255,255,255,0.22)', cursor:'pointer', fontFamily:'var(--font-body)', transition:'color 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.5)'}
                  onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.22)'}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
