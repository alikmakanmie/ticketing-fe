const BASE_URL = "http://localhost:8000/api";

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------
const getHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `Error ${res.status}`);
  }
  return json;
};

// ------------------------------------------------------------------
// AUTH
// ------------------------------------------------------------------
export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const register = async (name, email, password, passwordConfirmation) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
  return handleResponse(res);
};

export const logout = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getMe = async () => {
  const res = await fetch(`${BASE_URL}/user`, { headers: getHeaders() });
  return handleResponse(res);
};

// ------------------------------------------------------------------
// EVENTS  —  GET /api/events  &  GET /api/events/:slug
// ------------------------------------------------------------------
export const getEvents = async () => {
  try {
    const res = await fetch(`${BASE_URL}/events`, { headers: getHeaders() });
    const json = await handleResponse(res);
    return json.data ?? [];
  } catch (err) {
    console.error("getEvents error:", err);
    return [];
  }
};

export const getEventBySlug = async (slug) => {
  const res = await fetch(`${BASE_URL}/events/${slug}`, {
    headers: getHeaders(),
  });
  const json = await handleResponse(res);
  return json.data;
};

// ------------------------------------------------------------------
// SEATS  —  GET /api/sessions/:sessionId/seats
// ------------------------------------------------------------------
export const getSeats = async (sessionId) => {
  try {
    const res = await fetch(`${BASE_URL}/sessions/${sessionId}/seats`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!json.success || !json.data?.seats) return { seats: [], categories: [], session: null };

    // Flatten grouped seats: { 'A': [...], 'V': [...] } → flat array
    const grouped = json.data.seats;
    const seats = Object.values(grouped).flat().map((s) => ({
      id: s.id,
      seat_code: s.seat_code,
      category_name: s.category_name,
      price: Number(s.price ?? 0),   // pastikan number, bukan string
      color_hex: s.color_hex,
      status: s.status ?? "available",
    }));

    return {
      seats,
      categories: json.data.categories ?? [],
      session: json.data.session ?? null,
    };
  } catch (err) {
    console.error("getSeats error:", err);
    return { seats: [], categories: [], session: null };
  }
};

// ------------------------------------------------------------------
// LOCK SEATS  —  POST /api/sessions/:sessionId/lock-seat
// ------------------------------------------------------------------
export const lockSeats = async (sessionId, seatIds) => {
  const res = await fetch(`${BASE_URL}/sessions/${sessionId}/lock-seat`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ seat_ids: seatIds }),
  });
  return handleResponse(res);
};

// ------------------------------------------------------------------
// CHECKOUT  —  POST /api/checkout
// ------------------------------------------------------------------
export const checkout = async (sessionId, seatIds, paymentMethod) => {
  const res = await fetch(`${BASE_URL}/checkout`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      session_id: sessionId,
      seat_ids: seatIds,
      payment_method: paymentMethod,
    }),
  });
  return handleResponse(res);
};

// ------------------------------------------------------------------
// VERIFY PAYMENT  —  POST /api/orders/:orderCode/verify
// ------------------------------------------------------------------
export const verifyPayment = async (orderCode) => {
  const res = await fetch(`${BASE_URL}/orders/${orderCode}/verify`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// ------------------------------------------------------------------
// GATE SCAN  —  POST /api/gate/scan
// ------------------------------------------------------------------
export const gateScan = async (qrCode, deviceId = null) => {
  const res = await fetch(`${BASE_URL}/gate/scan`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ qr_code: qrCode, device_id: deviceId }),
  });
  return handleResponse(res);
};

// ------------------------------------------------------------------
// ADMIN — CRUD Event  /api/admin/events
// ------------------------------------------------------------------
export const adminGetEvents = async () => {
  const res = await fetch(`${BASE_URL}/admin/events`, { headers: getHeaders() });
  const json = await handleResponse(res);
  return json.data ?? [];
};

export const adminGetEvent = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/events/${id}`, { headers: getHeaders() });
  const json = await handleResponse(res);
  return json.data;
};

export const adminCreateEvent = async (payload) => {
  const res = await fetch(`${BASE_URL}/admin/events`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const adminUpdateEvent = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/admin/events/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const adminDeleteEvent = async (id) => {
  const res = await fetch(`${BASE_URL}/admin/events/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// ------------------------------------------------------------------
// FINANCE — Daftar & Verifikasi Order  /api/finance/orders
// ------------------------------------------------------------------
export const financeGetOrders = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/finance/orders?page=${page}`, { headers: getHeaders() });
  return handleResponse(res);
};

export const financeVerify = async (orderCode) => {
  const res = await fetch(`${BASE_URL}/orders/${orderCode}/verify`, {
    method: "POST",
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// ------------------------------------------------------------------
// ADMIN — CRUD Sesi  /api/admin/events/:eventId/sessions
// ------------------------------------------------------------------
export const adminGetSessions = async (eventId) => {
  const res = await fetch(`${BASE_URL}/admin/events/${eventId}/sessions`, { headers: getHeaders() });
  const json = await handleResponse(res);
  return json.data; // { event, sessions }
};

export const adminGetSession = async (sessionId) => {
  const res = await fetch(`${BASE_URL}/admin/sessions/${sessionId}`, { headers: getHeaders() });
  const json = await handleResponse(res);
  return json.data;
};

export const adminCreateSession = async (eventId, payload) => {
  const res = await fetch(`${BASE_URL}/admin/events/${eventId}/sessions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const adminUpdateSession = async (sessionId, payload) => {
  const res = await fetch(`${BASE_URL}/admin/sessions/${sessionId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
};

export const adminDeleteSession = async (sessionId) => {
  const res = await fetch(`${BASE_URL}/admin/sessions/${sessionId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
};