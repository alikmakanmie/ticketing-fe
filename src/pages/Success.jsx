import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { QRCodeCanvas } from "qrcode.react";

export default function Success() {
  const navigate = useNavigate();
  const { booking, setBooking } = useBooking();

  useEffect(() => {
    if (!booking) navigate("/");
  }, [booking, navigate]);

  if (!booking) return null;

  const qrData = booking.orderCode ?? JSON.stringify({
    seats: booking.seats.map((s) => s.seat_code),
  });

  const handleGoHome = () => {
    setBooking(null);
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
        <span className="text-4xl">✅</span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Pemesanan Berhasil!</h1>
      <p className="text-gray-400 mb-8">
        {booking.simulated
          ? "Simulasi pembayaran selesai. Di produksi tiket diterbitkan setelah admin verifikasi."
          : "Pembayaran sedang diverifikasi oleh tim kami."}
      </p>

      {/* E-Ticket Card */}
      <div className="bg-gray-800/60 border border-white/10 rounded-3xl p-6 mb-6 text-left">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">E-Ticket</p>
            <p className="text-white font-bold text-lg">🎟️ TiketIn</p>
          </div>
          <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-semibold">
            ISSUED
          </span>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-5 bg-white rounded-2xl p-4 w-fit mx-auto">
          <QRCodeCanvas value={qrData} size={160} />
        </div>
        <p className="text-center text-xs text-gray-500 mb-4">Tunjukkan QR ini di gate masuk</p>

        {/* Ticket Details */}
        <div className="space-y-2 text-sm">
          {booking.orderCode && (
            <div className="flex justify-between">
              <span className="text-gray-400">Kode Order</span>
              <span className="text-white font-mono font-bold">{booking.orderCode}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-400">Kursi</span>
            <span className="text-white font-semibold">
              {booking.seats.map((s) => s.seat_code).join(", ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Bayar</span>
            <span className="text-violet-300 font-bold">
              Rp {(booking.totalAmount ?? booking.total ?? 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleGoHome}
        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-2xl transition-colors"
      >
        Kembali ke Beranda
      </button>
    </div>
  );
}