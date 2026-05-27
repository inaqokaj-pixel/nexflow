import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.getNotifications(user.id)
      .then(r => setNotifications(r.notifications || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user.id]);

  const getIcon = (subject) => {
    if (subject?.includes('Payment')) return { icon: '💳', bg: 'var(--success-light)', color: 'var(--success)' };
    if (subject?.includes('Cancel')) return { icon: '❌', bg: 'var(--danger-light)', color: 'var(--danger)' };
    if (subject?.includes('Update') || subject?.includes('Status')) return { icon: '🔄', bg: 'var(--info-light)', color: 'var(--info)' };
    if (subject?.includes('Welcome')) return { icon: '👋', bg: 'var(--warning-light)', color: 'var(--warning)' };
    return { icon: '📦', bg: 'var(--primary-light)', color: 'var(--primary)' };
  };

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Notifications</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>{notifications.length} messages in your inbox</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
          <div className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card empty-state">
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <h3>No notifications yet</h3>
          <p>Notifications appear here when you book or pay for a shipment</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {notifications.map(n => {
            const { icon, bg, color } = getIcon(n.subject);
            const isOpen = expanded === n.id;
            return (
              <div key={n.id} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setExpanded(isOpen ? null : n.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{n.subject}</div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(n.created_at).toLocaleString()}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
                        background: n.status === 'sent' ? 'var(--success-light)' : 'var(--bg-2)',
                        color: n.status === 'sent' ? 'var(--success)' : 'var(--text-muted)',
                        textTransform: 'uppercase', letterSpacing: '0.04em',
                      }}>{n.status}</span>
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'none', fontSize: 16 }}>▾</span>
                </div>
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px', background: 'var(--bg)', animation: 'fadeIn 0.2s ease' }}>
                    <pre style={{
                      fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)',
                      lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0,
                      background: '#fff', padding: '14px 16px', borderRadius: 8,
                      border: '1px solid var(--border)',
                    }}>
                      {n.message.trim()}
                    </pre>
                    {n.metadata?.booking_id && (
                      <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        Booking: {n.metadata.booking_id}
                        {n.metadata.transaction_id && ` · TX: ${n.metadata.transaction_id}`}
                      </div>
                    )}
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
