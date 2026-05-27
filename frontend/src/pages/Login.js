import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../AuthContext';

/* ─── Warehouse illustration (App tab) ──────────────────────────────────── */
function WarehouseIllustration() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      <svg viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg"
        style={{ position:'absolute', bottom:0, right:0, width:'62%', height:'90%' }}>
        <ellipse cx="900" cy="870" rx="580" ry="90" fill="#009e76" opacity="0.4"/>
        <rect x="400" y="110" width="800" height="700" rx="6" fill="#0d5c45"/>
        <rect x="400" y="110" width="800" height="38" fill="#0a4a37"/>
        {Array.from({length:14},(_,i)=>(
          <circle key={i} cx={428+i*56} cy={129} r={10} fill="none" stroke="#0a4a37" strokeWidth="2.5"/>
        ))}
        {[415,555,695,835,975].map((x,i)=>(
          <g key={i}>
            <rect x={x} y={170} width={115} height={95} rx="4" fill="#f59e0b"/>
            {i===0 && <ellipse cx={x+57} cy={192} rx={23} ry={30} fill="#00c896"/>}
            {i===1 && <rect x={x+24} y={174} width={67} height={44} rx="3" fill="#a78bfa"/>}
            {i===2 && <circle cx={x+57} cy={216} r={22} fill="#00c896" stroke="#0d5c45" strokeWidth="3"/>}
            {i===3 && <rect x={x+16} y={178} width={82} height={36} rx="3" fill="#f97316"/>}
            {i===4 && <text x={x+57} y={228} textAnchor="middle" fontSize="12" fontWeight="800" fill="#0d5c45" fontFamily="sans-serif">NX</text>}
          </g>
        ))}
        <rect x="560" y="490" width="165" height="225" rx="6" fill="#f59e0b"/>
        <circle cx="642" cy="612" r="22" fill="#00c896" stroke="#0d5c45" strokeWidth="3"/>
        <circle cx="642" cy="612" r="9" fill="#0d5c45"/>
        <rect x="770" y="440" width="245" height="275" rx="4" fill="#f59e0b"/>
        <text x="892" y="496" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0d5c45" fontFamily="sans-serif">nexflow</text>
        {[{x:784,y:510,w:66,h:50},{x:858,y:510,w:54,h:50},{x:920,y:510,w:86,h:50},
          {x:784,y:566,w:82,h:50},{x:874,y:566,w:128,h:50},
          {x:784,y:622,w:112,h:80},{x:904,y:622,w:96,h:80}].map((b,i)=>(
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="#d97706"/>
            <rect x={b.x+b.w/2-9} y={b.y} width={18} height={b.h} fill="rgba(0,0,0,0.1)"/>
            <rect x={b.x} y={b.y+b.h/2-3} width={b.w} height={6} fill="rgba(0,0,0,0.07)"/>
          </g>
        ))}
        <circle cx="756" cy="458" r="27" fill="#7c3aed" opacity="0.9"/>
        <circle cx="756" cy="458" r="14" fill="#a78bfa"/>
        <g style={{animation:'float 3.5s ease-in-out infinite'}}>
          <rect x="415" y="665" width="210" height="94" rx="8" fill="#0a4a37"/>
          <rect x="585" y="640" width="105" height="76" rx="6" fill="#0d5c45"/>
          <rect x="600" y="652" width="74" height="42" rx="3" fill="#00c896" opacity="0.45"/>
          <circle cx="462" cy="762" r="23" fill="#053d2c"/><circle cx="462" cy="762" r="11" fill="#0a4a37"/>
          <circle cx="600" cy="762" r="23" fill="#053d2c"/><circle cx="600" cy="762" r="11" fill="#0a4a37"/>
        </g>
        <g style={{animation:'float 2.8s 0.4s ease-in-out infinite'}}>
          <rect x="665" y="378" width="154" height="34" rx="17" fill="#00c896"/>
          <text x="742" y="400" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a" fontFamily="sans-serif">select_carrier</text>
        </g>
        <g style={{animation:'float 2.2s 1.1s ease-in-out infinite'}}>
          <rect x="1010" y="706" width="136" height="34" rx="17" fill="#00c896"/>
          <text x="1078" y="728" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a" fontFamily="sans-serif">print_label</text>
        </g>
        <g style={{animation:'float 3s 0.7s ease-in-out infinite'}}>
          <rect x="415" y="384" width="124" height="34" rx="17" fill="#f59e0b"/>
          <text x="477" y="406" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a" fontFamily="sans-serif">book_now</text>
        </g>
      </svg>
      <svg viewBox="0 0 1400 180" xmlns="http://www.w3.org/2000/svg"
        style={{ position:'absolute', bottom:0, left:0, width:'100%', height:'140px' }}>
        <ellipse cx="190" cy="170" rx="360" ry="110" fill="#009e76" opacity="0.3"/>
        <ellipse cx="1280" cy="175" rx="300" ry="95" fill="#009e76" opacity="0.22"/>
      </svg>
    </div>
  );
}

/* ─── API portal illustration ────────────────────────────────────────────── */
function ApiIllustration() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
      <svg viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg"
        style={{ position:'absolute', right:0, top:0, width:'65%', height:'100%' }}>
        <g style={{animation:'float 3s ease-in-out infinite'}}>
          <rect x="340" y="80" width="350" height="295" rx="14" fill="#0f172a" opacity="0.96"/>
          <rect x="340" y="80" width="350" height="32" rx="14" fill="#1e293b"/>
          <rect x="340" y="96" width="350" height="16" fill="#1e293b"/>
          {['#ef4444','#f59e0b','#22c55e'].map((c,i)=>(
            <circle key={i} cx={360+i*22} cy={96} r={7} fill={c}/>
          ))}
          {[
            ['#64748b','{'],
            ['#818cf8','  "booking": {'],
            ['#34d399','    "from": "Tirana, AL",'],
            ['#fbbf24','    "to": "Rome, IT",'],
            ['#f472b6','    "cargo": "500kg",'],
            ['#34d399','    "status": "pending",'],
            ['#818cf8','    "cost": "$100.00"'],
            ['#818cf8','  }'],
            ['#64748b','}'],
          ].map(([color,text],i)=>(
            <text key={i} x="358" y={134+i*24} fontSize="13" fill={color} fontFamily="monospace">{text}</text>
          ))}
        </g>
        <g style={{animation:'float 2.5s 0.6s ease-in-out infinite'}}>
          <rect x="720" y="230" width="265" height="265" rx="14" fill="rgba(255,255,255,0.95)"/>
          <text x="852" y="268" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a" fontFamily="sans-serif">ADMIN PORTAL</text>
          {[
            {l:'Total Users', v:'128', c:'#6366f1'},
            {l:'Active Loads', v:'340', c:'#3b82f6'},
            {l:'Revenue',     v:'$42K', c:'#22c55e'},
          ].map((s,i)=>(
            <g key={i}>
              <rect x="736" y={286+i*52} width="232" height="40" rx="8" fill={s.c} opacity="0.1"/>
              <text x="750" y={312+i*52} fontSize="12" fill={s.c} fontFamily="sans-serif" fontWeight="700">{s.l}</text>
              <text x="956" y={312+i*52} textAnchor="end" fontSize="14" fill={s.c} fontFamily="sans-serif" fontWeight="800">{s.v}</text>
            </g>
          ))}
          {[38,58,28,72,44,86,52].map((h,i)=>(
            <rect key={i} x={738+i*30} y={484-h} width="22" height={h} rx="4" fill="#6366f1" opacity="0.75"/>
          ))}
        </g>
        <g style={{animation:'float 2.2s 0.2s ease-in-out infinite'}}>
          <rect x="340" y="414" width="168" height="34" rx="17" fill="#00c896"/>
          <text x="424" y="436" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a" fontFamily="sans-serif">manage_users</text>
        </g>
        <g style={{animation:'float 2.8s 0.9s ease-in-out infinite'}}>
          <rect x="720" y="524" width="128" height="34" rx="17" fill="#f59e0b"/>
          <text x="784" y="546" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a" fontFamily="sans-serif">view_metrics</text>
        </g>
        <g style={{animation:'float 3s 1.4s ease-in-out infinite'}}>
          <rect x="960" y="110" width="148" height="34" rx="17" fill="#a78bfa"/>
          <text x="1034" y="132" textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a" fontFamily="sans-serif">get_carriers</text>
        </g>
      </svg>
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────────────────────── */
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */
export default function LoginPage() {
  const [tab, setTab]         = useState('app');   // 'app' | 'api'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const isApp = tab === 'app';

  /* colour tokens that flip per tab */
  const pageBg   = isApp ? '#00c896' : '#6366f1';
  const cardBg   = isApp ? '#a8f0d8' : '#c7d2fe';
  const headClr  = '#0f172a';
  const mutedClr = isApp ? 'rgba(0,0,0,0.42)' : 'rgba(15,23,42,0.5)';
  const borderFocus = isApp ? '#00a57a' : '#4f46e5';

  async function handleSubmit(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await api.login(email, password);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function switchTab(t) { setTab(t); setError(''); }

  /* shared input style */
  const fieldStyle = {
    width: '100%',
    padding: '13px 16px',
    background: 'white',
    border: '1.5px solid rgba(0,0,0,0.12)',
    borderRadius: 8,
    fontSize: 14,
    color: '#0f172a',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: pageBg,
      transition: 'background 0.4s ease',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* dot-grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(0,0,0,0.09) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}/>

      {/* illustration */}
      {isApp ? <WarehouseIllustration /> : <ApiIllustration />}

      {/* back button */}
      <button onClick={() => navigate('/')} style={{
        position: 'absolute', top: 20, left: 24, zIndex: 10,
        background: 'rgba(0,0,0,0.14)', border: 'none', borderRadius: 8,
        padding: '7px 14px', fontSize: 13, fontWeight: 700,
        color: '#0f172a', cursor: 'pointer',
      }}>← Back</button>

      {/* ── toggle pill ── */}
      <div style={{
        marginTop: 28, zIndex: 10,
        background: 'rgba(0,0,0,0.16)',
        backdropFilter: 'blur(10px)',
        borderRadius: 999, padding: 4,
        display: 'flex', gap: 3,
      }}>
        {[['app','App'],['api','API']].map(([t, label]) => (
          <button key={t} onClick={() => switchTab(t)} style={{
            padding: '7px 30px', borderRadius: 999, border: 'none',
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.22s',
            background: tab === t ? (t === 'app' ? '#00c896' : 'white') : 'transparent',
            color:      tab === t ? (t === 'app' ? '#0f172a' : '#6366f1') : 'rgba(15,23,42,0.65)',
            boxShadow:  tab === t ? '0 2px 10px rgba(0,0,0,0.18)' : 'none',
            fontFamily: 'var(--font-display)',
          }}>{label}</button>
        ))}
      </div>

      {/* ── card ── */}
      <div style={{
        marginTop: 22, zIndex: 10,
        width: 370,
        background: cardBg,
        borderRadius: 18,
        padding: '36px 34px 30px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        border: '1px solid rgba(255,255,255,0.55)',
        animation: 'fadeUp 0.3s ease',
      }}>

        {/* logo */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
          <div style={{
            width:28, height:28, borderRadius:6,
            background:'#0f172a', display:'flex', alignItems:'center',
            justifyContent:'center', color:'#00c896', fontWeight:900, fontSize:14,
            fontFamily:'var(--font-display)',
          }}>N</div>
          <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:15, color:headClr }}>nexflow</span>
        </div>

        {/* heading */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 30, fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          color: headClr,
          marginBottom: 26,
          whiteSpace: 'pre-line',
        }}>
          {isApp ? 'Welcome back\nto NexFlow!' : 'API Portal\nSign In'}
        </h2>

        {!isApp && (
          <p style={{ fontSize:13, color: mutedClr, marginTop:-16, marginBottom:20, lineHeight:1.5 }}>
            Sign in with your admin credentials to access the portal dashboard.
          </p>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:11 }}>

          <input
            type="email" placeholder="Email"
            value={email} onChange={e=>setEmail(e.target.value)}
            required style={fieldStyle}
            onFocus={e=>{ e.target.style.borderColor=borderFocus; e.target.style.boxShadow=`0 0 0 3px ${borderFocus}22`; }}
            onBlur={e=>{ e.target.style.borderColor='rgba(0,0,0,0.12)'; e.target.style.boxShadow='none'; }}
          />

          <div style={{ position:'relative' }}>
            <input
              type={showPass ? 'text' : 'password'} placeholder="Password"
              value={password} onChange={e=>setPassword(e.target.value)}
              required style={{...fieldStyle, paddingRight:44}}
              onFocus={e=>{ e.target.style.borderColor=borderFocus; e.target.style.boxShadow=`0 0 0 3px ${borderFocus}22`; }}
              onBlur={e=>{ e.target.style.borderColor='rgba(0,0,0,0.12)'; e.target.style.boxShadow='none'; }}
            />
            <button type="button" onClick={()=>setShowPass(p=>!p)} style={{
              position:'absolute', right:13, top:'50%', transform:'translateY(-50%)',
              background:'none', border:'none', cursor:'pointer', color:'rgba(0,0,0,0.38)',
              display:'flex', alignItems:'center', padding:0,
            }}>
              {showPass ? <EyeOffIcon/> : <EyeIcon/>}
            </button>
          </div>

          <div style={{ textAlign:'right', marginTop:-2 }}>
            <span style={{ fontSize:12.5, color:mutedClr, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:2 }}>
              Forgot password
            </span>
          </div>

          {error && (
            <div style={{
              background:'rgba(239,68,68,0.12)', border:'1.5px solid rgba(239,68,68,0.3)',
              color:'#7f1d1d', padding:'9px 13px', borderRadius:8, fontSize:13,
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'14px',
            background:'#0f172a', color:'white',
            border:'none', borderRadius:8,
            fontSize:15, fontWeight:700, cursor:'pointer',
            fontFamily:'var(--font-display)',
            marginTop:4,
            opacity: loading ? 0.65 : 1,
            transition:'opacity 0.15s, transform 0.15s',
            display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          }}
            onMouseEnter={e=>{ if(!loading) e.target.style.transform='translateY(-1px)'; }}
            onMouseLeave={e=>{ e.target.style.transform='translateY(0)'; }}
          >
            {loading
              ? <span style={{ width:18, height:18, border:'3px solid rgba(255,255,255,0.35)', borderTopColor:'white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }}/>
              : 'Log in'
            }
          </button>
        </form>

        {/* Google + signup — App tab only */}
        {isApp && (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:10, margin:'18px 0 14px', color:mutedClr, fontSize:13 }}>
              <div style={{ flex:1, height:1.5, background:'rgba(0,0,0,0.14)' }}/>
              <span>or</span>
              <div style={{ flex:1, height:1.5, background:'rgba(0,0,0,0.14)' }}/>
            </div>

            <button onClick={()=>alert('Configure REACT_APP_GOOGLE_CLIENT_ID in your .env to enable Google login.')} style={{
              width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
              padding:'13px', background:'white',
              border:'1.5px solid rgba(0,0,0,0.12)', borderRadius:8,
              fontSize:14, fontWeight:600, color:'#0f172a', cursor:'pointer',
              fontFamily:'var(--font-body)',
              transition:'border-color 0.15s, box-shadow 0.15s',
            }}
              onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(0,0,0,0.28)'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(0,0,0,0.12)'; e.currentTarget.style.boxShadow='none'; }}
            >
              <GoogleIcon/>
              Continue with Google
            </button>

            <p style={{ textAlign:'center', marginTop:20, fontSize:13.5, color:mutedClr }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'#0f172a', fontWeight:700, textDecoration:'underline', textUnderlineOffset:2 }}>
                Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
