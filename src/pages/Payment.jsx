import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export default function Payment() {
  const navigate = useNavigate();
  const { booking, setBooking } = useBooking();
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!booking) navigate("/");
  }, [booking, navigate]);

  // Countdown to payment deadline
  useEffect(() => {
    if (!booking?.paymentDeadline) return;
    const interval = setInterval(() => {
      const diff = new Date(booking.paymentDeadline).getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(interval);
        alert("Batas waktu pembayaran habis. Pesanan dibatalkan.");
        navigate("/");
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m}:${s < 10 ? "0" : ""}${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [booking?.paymentDeadline, navigate]);

  if (!booking) return null;

  const bankInfo = {
    bank_transfer: { name: "BCA", number: "1234567890", holder: "PT TiketIn Indonesia" },
    midtrans: null,
  };

  const bankDetails = bankInfo[booking.paymentMethod ?? "bank_transfer"];

  // Simulate marking as paid (in real app, admin verifies via /orders/:code/verify)
  const handleSimulatePaid = () => {
    // Navigate to success with order info
    setBooking({ ...booking, simulated: true });
    navigate("/success");
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-2">💳 Pembayaran</h1>
      <p className="text-gray-400 text-sm mb-8">
        Kode Order: <span className="text-violet-300 font-mono font-bold">{booking.orderCode}</span>
      </p>

      {/* Deadline */}
      {timeLeft && (
        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 mb-6">
          <span className="text-2xl">⏰</span>
          <div>
            <p className="text-red-300 font-semibold text-sm">Batas Waktu Pembayaran</p>
            <p className="text-red-100 font-bold text-2xl">{timeLeft}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-1">Jumlah yang Harus Dibayar</h2>
        <p className="text-3xl font-bold text-violet-300 mt-2">
          Rp {(booking.totalAmount ?? booking.total ?? 0).toLocaleString("id-ID")}
        </p>
      </div>

      {/* Bank Transfer Info */}
      {bankDetails ? (
        <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 mb-6 space-y-4">
          <h2 className="text-white font-semibold">Informasi Rekening Transfer</h2>
          <div className="bg-gray-900/60 rounded-xl p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Bank</span>
              <span className="text-white font-semibold">{bankDetails.bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">No. Rekening</span>
              <span className="text-white font-mono font-bold">{bankDetails.number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Atas Nama</span>
              <span className="text-white">{bankDetails.holder}</span>
            </div>
          </div>
          <p className="text-yellow-400 text-xs bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-3">
            ⚠️ Pastikan nominal transfer <strong>harus tepat</strong> sesuai jumlah di atas agar pembayaran terverifikasi otomatis.
          </p>
        </div>
      ) : (
        <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 mb-6 text-center">
          <p className="text-4xl mb-3">💳</p>
          <p className="text-gray-300 text-sm">Kamu akan diarahkan ke halaman Midtrans untuk menyelesaikan pembayaran.</p>
        </div>
      )}

      {/* Simulate paid button (development) */}
      <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 mb-6 text-xs text-blue-300">
        🛈 <strong>Mode Development:</strong> Klik tombol di bawah untuk mensimulasikan pembayaran berhasil. Di produksi, Admin akan memverifikasi transfer melalui dashboard.
      </div>

      <button
        onClick={handleSimulatePaid}
        className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-4 rounded-2xl transition-colors text-base"
      >
        ✅ Simulasi Pembayaran Berhasil
      </button>
    </div>
  );
}