const BASE = '';

function getToken() {
  return localStorage.getItem('nf_token');
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  register: (email, password, role) =>
    request('POST', '/api/customers/register', { email, password, role }),
  login: (email, password) =>
    request('POST', '/api/customers/login', { email, password }),
  googleAuth: (credential, role) =>
    request('POST', '/api/customers/auth/google', { credential, role }),
  profile: () =>
    request('GET', '/api/customers/profile'),

  // Bookings
  getBookings: (shipper_id) =>
    request('GET', `/api/bookings?shipper_id=${shipper_id}`),
  getAllBookings: () =>
    request('GET', '/api/bookings'),
  createBooking: (data) =>
    request('POST', '/api/bookings', data),
  updateStatus: (id, status, shipper_id) =>
    request('PUT', `/api/bookings/${id}/status`, { status, shipper_id }),
  cancelBooking: (id) =>
    request('DELETE', `/api/bookings/${id}`),

  // Resources
  getFleet: () =>
    request('GET', '/api/resources/fleet/available'),
  addVehicle: (data) =>
    request('POST', '/api/resources/fleet', data),

  // Payments
  processPayment: (data) =>
    request('POST', '/api/payments/process', data),
  getPayment: (bookingId) =>
    request('GET', `/api/payments/booking/${bookingId}`),

  // Admin
  adminGetUsers: () =>
    request('GET', '/api/customers/admin/users'),
  adminDeleteUser: (id) =>
    request('DELETE', `/api/customers/admin/users/${id}`),

  // Notifications
  getNotifications: (userId) =>
    request('GET', `/api/notifications/user/${userId}`),

  // Tracking
  getTracking: (bookingId) =>
    request('GET', `/api/tracking/${bookingId}`),
  getActiveLocations: () =>
    request('GET', '/api/tracking/active/latest'),
  postLocationUpdate: (bookingId, data) =>
    request('POST', `/api/tracking/${bookingId}/update`, data),
  getTrackingETA: (bookingId) =>
    request('GET', `/api/tracking/${bookingId}/eta`),
  getTrackingStats: () =>
    request('GET', '/api/tracking/stats'),
  getTrackingSummary: () =>
    request('GET', '/api/tracking/all/summary'),
};
