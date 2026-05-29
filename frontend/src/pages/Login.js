import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { api } from '../api';
import { useAuth } from '../AuthContext';

// Set your Google OAuth Client ID here or via REACT_APP_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

/* ─── Animations & global styles ─────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes nf-spin   { to { transform: rotate(360deg); } }
  @keyframes nf-rise   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes nf-drift1 { 0%,100%{transform:translateX(0) translateY(0)} 33%{transform:translateX(18px) translateY(-8px)} 66%{transform:translateX(-10px) translateY(6px)} }
  @keyframes nf-drift2 { 0%,100%{transform:translateX(0) translateY(0)} 40%{transform:translateX(-14px) translateY(10px)} 80%{transform:translateX(10px) translateY(-6px)} }
  @keyframes nf-plane  { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-14px) rotate(1.5deg)} }
  @keyframes nf-pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
  @keyframes nf-trail  { from{stroke-dashoffset:900} to{stroke-dashoffset:0} }
  @keyframes nf-pop    { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.04)} 100%{transform:scale(1);opacity:1} }
  @keyframes nf-tab    { from{width:0;opacity:0} to{width:100%;opacity:1} }
  @keyframes nf-err    { 0%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} 100%{transform:translateX(0)} }
  @keyframes nf-shine  { from{left:-100%} to{left:200%} }

  .nf-page {
    min-height: 100vh;
    display: flex;
    font-family: 'DM Sans', sans-serif;
    background: #060f0a;
    overflow: hidden;
  }

  /* ─ Left panel ─ */
  .nf-panel-left {
    flex: 0 0 46%;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 36px 42px;
    background: linear-gradient(160deg, #041a0e 0%, #062d18 38%, #0a5c35 80%, #0d8050 100%);
  }

  .nf-grid-svg {
    position: absolute; inset: 0; width: 100%; height: 100%;
    opacity: .045; pointer-events: none;
  }

  .nf-orb {
    position: absolute; border-radius: 50%;
    filter: blur(64px); pointer-events: none;
  }

  .nf-plane-wrap {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-55%, -52%);
    width: 72%;
    max-width: 380px;
    animation: nf-plane 6s ease-in-out infinite;
    filter: drop-shadow(0 32px 60px rgba(0,0,0,0.5));
  }

  .nf-badge-pin {
    position: absolute;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
  }
  .nf-badge-pin-label {
    padding: 4px 11px; border-radius: 20px;
    font-size: 10.5px; font-weight: 800; letter-spacing: .08em;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 3px 14px currentColor;
  }
  .nf-badge-pin-stem { width: 2px; height: 14px; border-radius: 1px; opacity: .5; }
  .nf-badge-pin-dot  { width: 7px; height: 7px; border-radius: 50%; opacity: .3; }

  .nf-panel-left-logo {
    display: flex; align-items: center; gap: 10px;
    position: relative; z-index: 2;
    animation: nf-rise .6s ease both;
  }
  .nf-logo-mark {
    width: 40px; height: 40px; border-radius: 11px;
    background: linear-gradient(135deg, #00c896, #007a50);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 18px rgba(0,200,150,.4);
    font-family: 'Instrument Serif', serif;
    font-size: 20px; color: #fff;
    font-style: italic;
  }
  .nf-logo-name {
    font-size: 17px; font-weight: 700; color: #fff;
    letter-spacing: .02em;
  }

  .nf-panel-left-footer {
    position: relative; z-index: 2;
    animation: nf-rise .8s .2s ease both;
    text-align: center;
  }
  .nf-left-headline {
    font-family: 'Instrument Serif', serif;
    font-size: 32px; color: #fff; line-height: 1.18;
    margin-bottom: 10px;
    text-shadow: 0 2px 24px rgba(0,0,0,.35);
  }
  .nf-left-sub {
    font-size: 13px; color: rgba(255,255,255,.52);
    line-height: 1.7;
  }
  .nf-dots {
    display: flex; justify-content: center; gap: 6px; margin-top: 18px;
  }
  .nf-dot { height: 6px; border-radius: 3px; }

  /* ─ Right panel ─ */
  .nf-panel-right {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 40px 28px;
    background: #fafaf9;
    position: relative;
    overflow-y: auto;
  }
  .nf-panel-right-bg {
    position: absolute; inset: 0;
    background-image: radial-gradient(rgba(0,0,0,.04) 1px, transparent 1px);
    background-size: 26px 26px;
    pointer-events: none;
    opacity: .7;
  }
  .nf-form-wrap {
    width: 100%; max-width: 400px;
    position: relative; z-index: 1;
    animation: nf-rise .5s ease both;
  }

  /* ─ Tabs ─ */
  .nf-tabs {
    display: flex;
    background: #efefed;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: 30px;
    gap: 2px;
  }
  .nf-tab {
    flex: 1; padding: 10px 0;
    border: none; background: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600;
    color: #8a9289; border-radius: 9px;
    cursor: pointer; transition: all .2s ease;
    position: relative; overflow: hidden;
  }
  .nf-tab.active {
    background: #fff;
    color: #0a1f12;
    box-shadow: 0 2px 10px rgba(0,0,0,.09);
  }
  .nf-tab.active::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(0,200,150,.06) 0%, transparent 100%);
    pointer-events: none;
  }

  /* ─ Heading ─ */
  .nf-heading {
    font-family: 'Instrument Serif', serif;
    font-size: 32px; color: #0a1f12;
    line-height: 1.1; margin-bottom: 6px;
    letter-spacing: -.01em;
  }
  .nf-heading em { color: #00a87e; font-style: italic; }
  .nf-subhead {
    font-size: 13.5px; color: #728470; margin-bottom: 28px; line-height: 1.6;
  }

  /* ─ Fields ─ */
  .nf-field { margin-bottom: 14px; }
  .nf-label {
    display: block; font-size: 11.5px; font-weight: 700;
    color: #4a6657; margin-bottom: 5px; letter-spacing: .04em;
    text-transform: uppercase;
  }
  .nf-input {
    width: 100%; padding: 13px 16px;
    background: #fff; border: 1.5px solid #dce8e1;
    border-radius: 11px; font-size: 14px; color: #0a1f12;
    font-family: 'DM Sans', sans-serif;
    transition: border-color .2s, box-shadow .2s, background .2s;
  }
  .nf-input::placeholder { color: #b0c4b9; }
  .nf-input:focus {
    outline: none; border-color: #00c896; background: #fdfffe;
    box-shadow: 0 0 0 4px rgba(0,200,150,.1);
  }
  .nf-input.has-icon { padding-right: 46px; }
  .nf-input-wrap { position: relative; }
  .nf-input-icon-btn {
    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
    background: none; border: none; padding: 4px; cursor: pointer;
    display: flex; align-items: center; color: #b0c4b9;
    transition: color .15s;
  }
  .nf-input-icon-btn:hover { color: #4a6657; }

  /* ─ Role cards ─ */
  .nf-roles { display: flex; gap: 10px; margin-bottom: 16px; }
  .nf-role-card {
    flex: 1; padding: 13px 10px; border: 2px solid #dce8e1;
    border-radius: 11px; cursor: pointer; transition: all .2s;
    background: #fff; text-align: center; user-select: none;
  }
  .nf-role-card:hover { border-color: #a8d8c4; }
  .nf-role-card.active {
    border-color: #00c896; background: rgba(0,200,150,.06);
    box-shadow: 0 0 0 3px rgba(0,200,150,.12);
  }
  .nf-role-icon { font-size: 22px; margin-bottom: 5px; }
  .nf-role-name { font-size: 12.5px; font-weight: 700; color: #0a1f12; }
  .nf-role-desc { font-size: 11px; color: #96b0a4; margin-top: 2px; }

  /* ─ Password strength ─ */
  .nf-strength { margin-top: 7px; }
  .nf-strength-bars { display: flex; gap: 4px; margin-bottom: 4px; }
  .nf-strength-bar { flex: 1; height: 3px; border-radius: 2px; transition: background .3s; }
  .nf-strength-label { font-size: 11px; font-weight: 600; }

  /* ─ Alert ─ */
  .nf-alert {
    padding: 11px 14px; border-radius: 10px; font-size: 13px;
    display: flex; align-items: flex-start; gap: 9px;
    margin-bottom: 14px; line-height: 1.5;
  }
  .nf-alert.error {
    background: #fff5f5; border: 1.5px solid #fcc; color: #b91c1c;
    animation: nf-err .35s ease;
  }
  .nf-alert.success {
    background: #f0fdf8; border: 1.5px solid #a7f0ce; color: #166534;
  }

  /* ─ Primary button ─ */
  .nf-btn {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #00c896 0%, #009e78 100%);
    color: #fff; border: none; border-radius: 11px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    transition: transform .15s, box-shadow .15s, opacity .15s;
    box-shadow: 0 4px 20px rgba(0,200,150,.35);
    position: relative; overflow: hidden;
    letter-spacing: .01em;
  }
  .nf-btn::after {
    content: '';
    position: absolute; top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
    transform: skewX(-20deg);
  }
  .nf-btn:hover:not(:disabled)::after { animation: nf-shine .55s ease; }
  .nf-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,200,150,.42); }
  .nf-btn:active:not(:disabled) { transform: translateY(0); }
  .nf-btn:disabled { opacity: .6; cursor: not-allowed; }

  /* ─ Google button ─ */
  .nf-google-btn {
    width: 100%; padding: 13px;
    background: #fff; border: 1.5px solid #dce8e1; border-radius: 11px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 600; color: #0a1f12; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: border-color .15s, box-shadow .15s, transform .15s;
  }
  .nf-google-btn:hover {
    border-color: #00c896; box-shadow: 0 0 0 3px rgba(0,200,150,.1);
    transform: translateY(-1px);
  }

  /* ─ Divider ─ */
  .nf-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 18px 0; color: #b0c4b9; font-size: 12px; font-weight: 500;
  }
  .nf-divider::before, .nf-divider::after {
    content: ''; flex: 1; height: 1px; background: #e4eee8;
  }

  /* ─ Footer text ─ */
  .nf-footer-text {
    text-align: center; margin-top: 22px;
    font-size: 13px; color: #7a9d8a;
  }
  .nf-link {
    background: none; border: none; padding: 0;
    font-family: 'DM Sans', sans-serif; font-size: inherit;
    color: #009e78; font-weight: 700; cursor: pointer;
    text-decoration: underline; text-decoration-color: transparent;
    transition: text-decoration-color .15s;
  }
  .nf-link:hover { text-decoration-color: #009e78; }
  .nf-terms {
    text-align: center; margin-top: 14px;
    font-size: 11.5px; color: #afc0b8; line-height: 1.6;
  }
  .nf-terms-link {
    background: none; border: none; padding: 0;
    font-family: 'DM Sans', sans-serif; font-size: 11.5px;
    color: #96b0a4; cursor: pointer; text-decoration: underline;
  }

  /* ─ Name row ─ */
  .nf-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

  /* ─ Forgot password ─ */
  .nf-pw-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 5px;
  }

  /* ─ Spinner ─ */
  .nf-spinner {
    width: 17px; height: 17px;
    border: 2.5px solid rgba(255,255,255,.3);
    border-top-color: #fff; border-radius: 50%;
    animation: nf-spin .7s linear infinite;
  }
`;

/* ─── Icons ────────────────────────────────────────────────────── */
function EyeIcon({ visible }) {
  return visible
    ? <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ─── Plane SVG ─────────────────────────────────────────────────── */
function NexPlane() {
  return (
    <svg viewBox="0 0 360 230" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
      {/* shadow */}
      <ellipse cx="178" cy="220" rx="122" ry="9" fill="rgba(0,0,0,0.25)" opacity=".6"/>
      {/* fuselage */}
      <path d="M 30 114 Q 85 84 178 98 Q 272 110 318 102 Q 328 108 318 118 Q 272 128 178 126 Q 85 140 30 114Z" fill="#e8ede9"/>
      <path d="M 62 106 Q 148 90 278 100 Q 308 104 318 101 Q 308 96 278 93 Q 148 83 62 99Z" fill="rgba(255,255,255,.5)"/>
      {/* nose */}
      <path d="M 30 114 Q 8 111 3 115 Q 8 119 30 114Z" fill="#dce2dd"/>
      {/* windows */}
      {[82,106,130,154,178,202,226,250,274].map((x,i)=>(
        <rect key={i} x={x} y={103} width={13} height={9} rx={3} fill="#c8e8ff" opacity=".82"/>
      ))}
      {/* nose window */}
      <ellipse cx="29" cy="112" rx="9" ry="5" fill="#b8deff" opacity=".8"/>
      {/* upper wing */}
      <path d="M 140 107 Q 174 52 246 33 Q 278 24 288 38 Q 278 58 246 64 Q 204 76 180 112Z" fill="#e0e6e1"/>
      <path d="M 140 107 Q 172 57 236 40 Q 260 32 274 41 Q 260 55 236 59 Q 198 71 180 110Z" fill="#eff2ef"/>
      {/* lower wing */}
      <path d="M 150 120 Q 182 175 246 196 Q 278 204 288 190 Q 278 170 246 163 Q 204 154 182 117Z" fill="#e0e6e1"/>
      <path d="M 150 120 Q 180 170 236 187 Q 258 195 272 187 Q 260 170 236 162 Q 200 152 182 117Z" fill="#eff2ef"/>
      {/* winglet upper */}
      <path d="M 286 38 Q 298 32 300 41 Q 293 53 288 51 Q 286 46 286 38Z" fill="#d5dbd6"/>
      {/* winglet lower */}
      <path d="M 286 190 Q 298 196 300 187 Q 293 175 288 177 Q 286 183 286 190Z" fill="#d5dbd6"/>
      {/* tail */}
      <path d="M 304 102 Q 318 60 328 55 Q 333 66 328 88 Q 323 101 318 108Z" fill="#dce2dd"/>
      <path d="M 304 122 Q 320 160 328 167 Q 333 157 328 134 Q 323 122 318 115Z" fill="#dce2dd"/>
      <path d="M 302 108 Q 328 102 338 100 Q 338 108 328 111 Q 318 113 302 111Z" fill="#e8ede9"/>
      <path d="M 302 116 Q 328 122 338 124 Q 338 117 328 114 Q 318 112 302 112Z" fill="#e8ede9"/>
      {/* landing gear */}
      <rect x="205" y="131" width="52" height="19" rx="10" fill="#ccd2cd"/>
      <ellipse cx="205" cy="140" rx="9" ry="9" fill="#bbc2bc"/><ellipse cx="205" cy="140" rx="4.5" ry="4.5" fill="#a4ada5"/>
      <rect x="160" y="131" width="42" height="17" rx="8" fill="#ccd2cd"/>
      <ellipse cx="160" cy="139" rx="8" ry="8" fill="#bbc2bc"/><ellipse cx="160" cy="139" rx="4" ry="4" fill="#a4ada5"/>
      {/* NX livery line */}
      <path d="M 50 108 Q 178 94 308 100" stroke="#00c896" strokeWidth="3.5" fill="none" opacity=".7" strokeLinecap="round"/>
      <text x="296" y="79" fontSize="7" fontWeight="900" fill="#00c896" fontFamily="sans-serif" transform="rotate(-62,296,79)">NX</text>
    </svg>
  );
}

/* ─── Left panel ────────────────────────────────────────────────── */
function LeftPanel({ mode }) {
  return (
    <div className="nf-panel-left">
      {/* subtle grid */}
      <svg className="nf-grid-svg" viewBox="0 0 500 900" preserveAspectRatio="none">
        {Array.from({length:16},(_,i)=><line key={`h${i}`} x1="0" y1={i*60} x2="500" y2={i*60} stroke="#fff" strokeWidth="1"/>)}
        {Array.from({length:9},(_,i)=><line key={`v${i}`} x1={i*65} y1="0" x2={i*65} y2="900" stroke="#fff" strokeWidth="1"/>)}
      </svg>

      {/* orbs */}
      <div className="nf-orb" style={{ width:320, height:320, background:'rgba(0,200,150,.12)', top:'-80px', right:'-60px', animation:'nf-drift1 14s ease-in-out infinite' }}/>
      <div className="nf-orb" style={{ width:240, height:240, background:'rgba(0,80,40,.35)', bottom:'80px', left:'-60px', animation:'nf-drift2 18s ease-in-out infinite' }}/>
      <div className="nf-orb" style={{ width:160, height:160, background:'rgba(0,200,150,.08)', top:'40%', left:'30%', animation:'nf-drift1 22s 3s ease-in-out infinite' }}/>

      {/* route trails */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 500 900" preserveAspectRatio="none">
        <path d="M 50 820 Q 160 550 280 320 Q 380 140 455 65" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="2" strokeDasharray="10 14" style={{ animation:'nf-trail 11s linear infinite', strokeDashoffset:900 }}/>
        <path d="M 450 820 Q 340 620 240 450 Q 150 300 65 160" fill="none" stroke="rgba(0,200,150,.22)" strokeWidth="2" strokeDasharray="8 16" style={{ animation:'nf-trail 15s 3s linear infinite', strokeDashoffset:900 }}/>
      </svg>

      {/* plane */}
      <div className="nf-plane-wrap"><NexPlane /></div>

      {/* location pins */}
      <div className="nf-badge-pin" style={{ bottom:'30%', left:'10%', animation:'nf-pulse 3s ease-in-out infinite' }}>
        <div className="nf-badge-pin-label" style={{ background:'#00c896', color:'#042010' }}>TIA</div>
        <div className="nf-badge-pin-stem" style={{ background:'#00c896' }}/>
        <div className="nf-badge-pin-dot" style={{ background:'#00c896' }}/>
      </div>
      <div className="nf-badge-pin" style={{ top:'15%', right:'8%', animation:'nf-pulse 3s 1.4s ease-in-out infinite' }}>
        <div className="nf-badge-pin-label" style={{ background:'#fbbf24', color:'#422006' }}>MXP</div>
        <div className="nf-badge-pin-stem" style={{ background:'#fbbf24' }}/>
        <div className="nf-badge-pin-dot" style={{ background:'#fbbf24' }}/>
      </div>
      <div className="nf-badge-pin" style={{ top:'44%', left:'6%', animation:'nf-pulse 3s 2.8s ease-in-out infinite' }}>
        <div className="nf-badge-pin-label" style={{ background:'#a78bfa', color:'#1e0a4a' }}>LHR</div>
        <div className="nf-badge-pin-stem" style={{ background:'#a78bfa' }}/>
        <div className="nf-badge-pin-dot" style={{ background:'#a78bfa' }}/>
      </div>

      {/* logo */}
      <div className="nf-panel-left-logo" onClick={()=>window.location.href='/'} style={{cursor:'pointer'}}>
        <div className="nf-logo-mark">N</div>
        <span className="nf-logo-name">nexflow</span>
      </div>

      {/* footer text */}
      <div className="nf-panel-left-footer">
        <div className="nf-left-headline">
          {mode === 'login'
            ? <>Welcome<br/><em>back.</em></>
            : <>Start your<br/><em>journey.</em></>}
        </div>
        <div className="nf-left-sub">
          {mode === 'login'
            ? 'Your freight network is\nwaiting for you.'
            : 'Join thousands of shippers &\ncarriers on NexFlow.'}
        </div>
        <div className="nf-dots">
          <div className="nf-dot" style={{ width: 28, background:'#00c896' }}/>
          <div className="nf-dot" style={{ width: 8, background:'rgba(255,255,255,.22)' }}/>
          <div className="nf-dot" style={{ width: 8, background:'rgba(255,255,255,.22)' }}/>
        </div>
      </div>
    </div>
  );
}

/* ─── Password strength ─────────────────────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const score = password.length < 6 ? 1 : password.length < 10 ? 2 : /[A-Z]/.test(password) && /[0-9!@#$%]/.test(password) ? 4 : 3;
  const colors = ['','#ef4444','#f59e0b','#22c55e','#00c896'];
  const labels = ['','Weak','Fair','Good','Strong'];
  return (
    <div className="nf-strength">
      <div className="nf-strength-bars">
        {[1,2,3,4].map(i=>(
          <div key={i} className="nf-strength-bar" style={{ background: i<=score ? colors[score] : '#e0ede6' }}/>
        ))}
      </div>
      <span className="nf-strength-label" style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
function LoginPageInner() {
  const location = useLocation();
  const [mode, setMode]         = useState(location.search.includes('register') ? 'register' : 'login');
  const [role, setRole]         = useState('shipper');

  // Login state
  const [emailL, setEmailL]     = useState('');
  const [passL,  setPassL]      = useState('');
  const [showL,  setShowL]      = useState(false);
  const [errorL, setErrorL]     = useState('');
  const [loadL,  setLoadL]      = useState(false);

  // Register state
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [emailR,    setEmailR]    = useState('');
  const [passR,     setPassR]     = useState('');
  const [showR,     setShowR]     = useState(false);
  const [errorR,    setErrorR]    = useState('');
  const [successR,  setSuccessR]  = useState('');
  const [loadR,     setLoadR]     = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  // ── Google OAuth handler ──────────────────────────────────────────────────
  // useGoogleLogin uses the Authorization Code flow (popup).
  // On success it gives us a { credential } object (ID token) we forward to
  // our backend which verifies it and returns our own JWT.
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError,   setGoogleError]   = useState('');

  const googleLogin = useGoogleLogin({
    flow: 'implicit',          // returns access_token; we exchange via onSuccess
    onNonOAuthError: (err) => {
      console.error('[NexFlow] Non-OAuth error (popup blocked / origin mismatch?):', err);
      const msg = err.type === 'popup_closed'
        ? 'Popup was closed before completing sign-in.'
        : err.type === 'popup_failed_to_open'
        ? 'Popup was blocked. Please allow popups for this site.'
        : `Google error: ${err.type || JSON.stringify(err)}`;
      setGoogleError(msg);
      setGoogleLoading(false);
    },
    onSuccess: async (tokenResponse) => {
      console.log('[NexFlow] Google onSuccess called, token received');
      // Exchange the access token for user info, then call our backend
      try {
        // Fetch user info from Google using the access token
        const infoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!infoRes.ok) throw new Error('Failed to fetch Google user info');
        const userInfo = await infoRes.json();

        // Send the sub (Google ID) + user info directly to our backend.
        // We pass the access token as credential; backend will use google-auth-library
        // to verify via userinfo endpoint instead.
        // Simpler: use the id_token flow below if you prefer.
        const data = await api.googleAuth(tokenResponse.access_token, role);
        login(data.user, data.token);
        navigate('/dashboard');
      } catch (err) {
        setGoogleError(err.message || 'Google sign-in failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error('Google OAuth error:', err);
      setGoogleError('Google sign-in was cancelled or failed.');
      setGoogleLoading(false);
    },
  });

  function handleGoogleAuth() {
    console.log('[NexFlow] Google button clicked');
    console.log('[NexFlow] GOOGLE_CLIENT_ID present:', !!GOOGLE_CLIENT_ID);
    console.log('[NexFlow] Client ID value:', GOOGLE_CLIENT_ID || '(empty — not configured)');
    if (!GOOGLE_CLIENT_ID) {
      setGoogleError('Google Sign-In is not configured. Set REACT_APP_GOOGLE_CLIENT_ID and rebuild.');
      console.error('[NexFlow] Aborting — no client ID');
      return;
    }
    setGoogleError('');
    setGoogleLoading(true);
    console.log('[NexFlow] Calling googleLogin()...');
    try {
      googleLogin();
    } catch (err) {
      console.error('[NexFlow] googleLogin() threw synchronously:', err);
      setGoogleError('Google Sign-In failed to open: ' + err.message);
      setGoogleLoading(false);
    }
  }

  // Reset errors on tab switch
  function switchMode(m) { setMode(m); setErrorL(''); setErrorR(''); setSuccessR(''); }

  async function handleLogin(e) {
    e.preventDefault(); setErrorL(''); setLoadL(true);
    try {
      const data = await api.login(emailL, passL);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) { setErrorL(err.message); }
    finally { setLoadL(false); }
  }

  async function handleRegister(e) {
    e.preventDefault(); setErrorR(''); setSuccessR(''); setLoadR(true);
    if (passR.length < 6) { setErrorR('Password must be at least 6 characters.'); setLoadR(false); return; }
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await api.register(emailR, passR, role);
      setSuccessR('Account created! Signing you in…');
      setTimeout(async () => {
        try {
          const data = await api.login(emailR, passR);
          login(data.user, data.token);
          navigate('/dashboard');
        } catch { switchMode('login'); }
      }, 900);
    } catch (err) { setErrorR(err.message); }
    finally { setLoadR(false); }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="nf-page">
        <LeftPanel mode={mode} />

        <div className="nf-panel-right">
          <div className="nf-panel-right-bg"/>
          <div className="nf-form-wrap" key={mode}>

            {/* Tabs */}
            <div className="nf-tabs">
              <button className={`nf-tab${mode==='login'?' active':''}`} onClick={()=>switchMode('login')}>Sign In</button>
              <button className={`nf-tab${mode==='register'?' active':''}`} onClick={()=>switchMode('register')}>Create Account</button>
            </div>

            {/* ── LOGIN ── */}
            {mode === 'login' && (
              <>
                <h1 className="nf-heading">Welcome <em>back</em></h1>
                <p className="nf-subhead">Sign in to access your freight dashboard.</p>

                {errorL && <div className="nf-alert error"><span>⚠</span><span>{errorL}</span></div>}

                <form onSubmit={handleLogin}>
                  <div className="nf-field">
                    <label className="nf-label">Email address</label>
                    <input className="nf-input" type="email" placeholder="you@company.com"
                      value={emailL} onChange={e=>setEmailL(e.target.value)} required autoComplete="email"/>
                  </div>
                  <div className="nf-field">
                    <div className="nf-pw-row">
                      <label className="nf-label" style={{marginBottom:0}}>Password</label>
                      <button type="button" className="nf-link" style={{fontSize:12}}>Forgot password?</button>
                    </div>
                    <div className="nf-input-wrap">
                      <input className="nf-input has-icon" type={showL?'text':'password'}
                        placeholder="Enter your password"
                        value={passL} onChange={e=>setPassL(e.target.value)} required autoComplete="current-password"/>
                      <button type="button" className="nf-input-icon-btn" onClick={()=>setShowL(s=>!s)}>
                        <EyeIcon visible={showL}/>
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="nf-btn" disabled={loadL} style={{marginTop:6}}>
                    {loadL ? <><div className="nf-spinner"/>Signing in…</> : <>Sign In →</>}
                  </button>
                </form>

                <div className="nf-divider">or continue with</div>
                <button className="nf-google-btn" type="button" onClick={handleGoogleAuth} disabled={googleLoading}>{googleLoading ? <><div className="nf-spinner" style={{borderTopColor:'#4a6657',borderColor:'rgba(0,0,0,.15)'}}/>Connecting…</> : <><GoogleIcon/>Continue with Google</>}</button>

                <p className="nf-footer-text">
                  Don't have an account?{' '}
                  <button className="nf-link" type="button" onClick={()=>switchMode('register')}>Create one free</button>
                </p>
                <p className="nf-terms">
                  By continuing, you agree to NexFlow's{' '}
                  <button className="nf-terms-link" type="button">Terms</button>{' '}and{' '}
                  <button className="nf-terms-link" type="button">Privacy Policy</button>.
                </p>
              </>
            )}

            {/* ── REGISTER ── */}
            {mode === 'register' && (
              <>
                <h1 className="nf-heading">Create your <em>account</em></h1>
                <p className="nf-subhead">Join thousands of shippers and carriers. Free to start.</p>

                {/* Role picker */}
                <div className="nf-roles">
                  {[['shipper','📦','Shipper','I send freight'],['carrier','🚛','Carrier','I move freight']].map(([r,icon,name,desc])=>(
                    <div key={r} className={`nf-role-card${role===r?' active':''}`} onClick={()=>setRole(r)}>
                      <div className="nf-role-icon">{icon}</div>
                      <div className="nf-role-name">{name}</div>
                      <div className="nf-role-desc">{desc}</div>
                    </div>
                  ))}
                </div>

                {errorR   && <div className="nf-alert error"><span>⚠</span><span>{errorR}</span></div>}
                {successR && <div className="nf-alert success"><span>✓</span><span>{successR}</span></div>}

                <form onSubmit={handleRegister}>
                  <div className="nf-field">
                    <label className="nf-label">Full Name</label>
                    <div className="nf-row2">
                      <input className="nf-input" type="text" placeholder="First name"
                        value={firstName} onChange={e=>setFirstName(e.target.value)} required autoComplete="given-name"/>
                      <input className="nf-input" type="text" placeholder="Last name"
                        value={lastName} onChange={e=>setLastName(e.target.value)} required autoComplete="family-name"/>
                    </div>
                  </div>
                  <div className="nf-field">
                    <label className="nf-label">Email address</label>
                    <input className="nf-input" type="email" placeholder="you@company.com"
                      value={emailR} onChange={e=>setEmailR(e.target.value)} required autoComplete="email"/>
                  </div>
                  <div className="nf-field">
                    <label className="nf-label">Password</label>
                    <div className="nf-input-wrap">
                      <input className="nf-input has-icon" type={showR?'text':'password'}
                        placeholder="Min. 8 characters"
                        value={passR} onChange={e=>setPassR(e.target.value)} required autoComplete="new-password"/>
                      <button type="button" className="nf-input-icon-btn" onClick={()=>setShowR(s=>!s)}>
                        <EyeIcon visible={showR}/>
                      </button>
                    </div>
                    <PasswordStrength password={passR}/>
                  </div>

                  <button type="submit" className="nf-btn" disabled={loadR} style={{marginTop:6}}>
                    {loadR ? <><div className="nf-spinner"/>Creating account…</> : <>Get Started →</>}
                  </button>
                </form>

                <div className="nf-divider">or continue with</div>
                <button className="nf-google-btn" type="button" onClick={handleGoogleAuth} disabled={googleLoading}>{googleLoading ? <><div className="nf-spinner" style={{borderTopColor:'#4a6657',borderColor:'rgba(0,0,0,.15)'}}/>Connecting…</> : <><GoogleIcon/>Continue with Google</>}</button>

                <p className="nf-footer-text">
                  Already have an account?{' '}
                  <button className="nf-link" type="button" onClick={()=>switchMode('login')}>Sign in instead</button>
                </p>
                <p className="nf-terms">
                  By continuing, you agree to NexFlow's{' '}
                  <button className="nf-terms-link" type="button">Terms</button>{' '}and{' '}
                  <button className="nf-terms-link" type="button">Privacy Policy</button>.
                </p>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

// GoogleOAuthProvider must always wrap LoginPageInner because useGoogleLogin
// is called unconditionally inside it. We pass a placeholder when the real
// Client ID isn't configured yet — the button will show a "not configured"
// message instead of crashing.
export default function LoginPage() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || 'not-configured'}>
      <LoginPageInner />
    </GoogleOAuthProvider>
  );
}