import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { checkout } from "../services/api";

const PAYMENT_METHODS = [
  { id: "bank_transfer", label: "Transfer Bank", icon: "🏦", desc: "BCA, Mandiri, BNI, BRI" },
  { id: "midtrans", label: "Midtrans", icon: "💳", desc: "Kartu kredit, GoPay, OVO, dll." },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { booking, setBooking } = useBooking();
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!booking) navigate("/");
  }, [booking, navigate]);

  // Countdown timer
  useEffect(() => {
    if (!booking?.lockedUntil) return;
    const interval = setInterval(() => {
      const diff = new Date(booking.lockedUntil).getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        alert("Waktu kunci kursi habis!");
        navigate("/");
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s < 10 ? "0" : ""}${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [booking?.lockedUntil, navigate]);

  if (!booking) return null;

  const serviceFee = 2500;
  // Recalculate subtotal from seats directly to guarantee numeric addition
  const subtotal = booking.seats.reduce((sum, s) => sum + Number(s.price ?? 0), 0);
  const total = subtotal + serviceFee;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await checkout(booking.sessionId, booking.seatIds, paymentMethod);
      setBooking({
        ...booking,
        orderCode: res.data.order_code,
        totalAmount: res.data.total_amount,
        paymentDeadline: res.data.payment_deadline,
        paymentMethod,
      });
      navigate("/payment");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">🛒 Checkout</h1>

      {/* Timer */}
      {timeLeft && (
        <div className="bg-yellow-900/40 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3 mb-6">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="text-yellow-300 font-semibold text-sm">Selesaikan dalam</p>
            <p className="text-yellow-100 font-bold text-xl">{timeLeft}</p>
          </div>
        </div>
      )}

      {/* Order Summary */}
      <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Rincian Pesanan</h2>
        <div className="space-y-3 mb-4">
          {booking.seats.map((seat) => (
            <div key={seat.id} className="flex justify-between text-sm">
              <div>
                <span className="text-white font-medium">{seat.seat_code}</span>
                <span className="text-gray-400 ml-2">· {seat.category_name}</span>
              </div>
              <span className="text-gray-300">
                Rp {Number(seat.price ?? 0).toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Biaya Layanan</span>
            <span>Rp {serviceFee.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-white/10">
            <span>Total</span>
            <span className="text-violet-300">Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Metode Pembayaran</h2>
        <div className="space-y-3">
          {PAYMENT_METHODS.map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === m.id
                ? "border-violet-500 bg-violet-600/10"
                : "border-white/10 hover:border-white/30"
                }`}
            >
              <input
                type="radio"
                name="payment"
                value={m.id}
                checked={paymentMethod === m.id}
                onChange={() => setPaymentMethod(m.id)}
                className="accent-violet-500"
              />
              <span className="text-2xl">{m.icon}</span>
              <div>
                <p className="text-white font-medium text-sm">{m.label}</p>
                <p className="text-gray-400 text-xs">{m.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-4 rounded-2xl transition-colors text-base"
      >
        {loading ? "Membuat Order..." : "Konfirmasi & Lanjutkan →"}
      </button>
    </div>
  );
}