const USE_MOCK = true;

const BASE_URL = "http://ticketing.test/api";

export const getSeats = async (sessionId) => {
  if (USE_MOCK) {
    return [
      { id: 1, seat_number: "V1", category: "VIP", status: "available" },
      { id: 2, seat_number: "V2", category: "VIP", status: "booked" },
      { id: 3, seat_number: "A1", category: "Reguler", status: "available" },
      { id: 4, seat_number: "A2", category: "Reguler", status: "locked" },
    ];
  }

  const response = await fetch(`${BASE_URL}/sessions/${sessionId}/seats`);
  return await response.json();
};

export const lockSeats = async (seatIds) => {
  if (USE_MOCK) {
    // Simulasi delay server
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = Math.random() > 0.3;

    if (success) {
      return {
        success: true,
        booking_code: "BOOK123",
        expired_at: "2026-05-12T19:30:00",
      };
    } else {
      throw new Error("Seat already taken");
    }
  }

  const response = await fetch(`${BASE_URL}/bookings/lock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ seat_ids: seatIds }),
  });

  if (!response.ok) {
    throw new Error("Seat already taken");
  }

  return await response.json();
};