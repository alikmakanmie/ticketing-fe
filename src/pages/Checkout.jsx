import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { useEffect, useState } from "react";

function Checkout() {
  const navigate = useNavigate();
  const { booking } = useBooking();

  const [timeLeft, setTimeLeft] = useState("");

  // Redirect kalau tidak ada booking
  useEffect(() => {
    if (!booking) {
      navigate("/");
    }
  }, [booking, navigate]);

  // Jangan render apa-apa dulu kalau booking belum ada
  if (!booking) return null;

  const { seats, total, expiredAt } = booking;

  // Timer
  useEffect(() => {
    if (!expiredAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(expiredAt).getTime();
      const distance = expiry - now;

      if (distance <= 0) {
        clearInterval(interval);
        alert("Waktu pemesanan habis!");
        navigate("/");
        return;
      }

      const minutes = Math.floor(distance / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);

      setTimeLeft(
        `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [expiredAt, navigate]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="mb-4 p-3 bg-yellow-100 rounded">
        <p className="font-semibold">
          Selesaikan pembayaran dalam: {timeLeft}
        </p>
      </div>

      <div className="bg-white p-6 rounded shadow-md max-w-md">
        <h2 className="text-xl font-semibold mb-4">Detail Pesanan</h2>

        <ul className="list-disc ml-6 mb-4">
          {seats.map((seat) => (
            <li key={seat.id}>{seat.seat_number}</li>
          ))}
        </ul>

        <p className="font-semibold mb-4">
          Total: Rp {total.toLocaleString("id-ID")}
        </p>

        <button
          onClick={() => navigate("/payment")}
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Lanjut ke Pembayaran
        </button>
      </div>
    </div>
  );
}

export default Checkout;