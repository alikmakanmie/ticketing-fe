import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

function Success() {
  const navigate = useNavigate();
  const { booking } = useBooking();

  useEffect(() => {
    if (!booking) {
      navigate("/");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const { seats, total } = booking;

  const ticketData = JSON.stringify({
    event: "Kancah Seni 2026",
    seats: seats.map((seat) => seat.seat_number),
    total,
    issued_at: new Date().toISOString(),
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-green-600">
        Pembayaran Berhasil 🎉
      </h1>

      <div className="bg-white p-6 rounded shadow-md max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">E-Ticket</h2>

        <QRCodeCanvas value={ticketData} size={200} />

        <div className="mt-4">
          <p className="font-semibold">
            Kursi: {seats.map((seat) => seat.seat_number).join(", ")}
          </p>

          <p className="mt-2">
            Total: Rp {total.toLocaleString("id-ID")}
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kembali ke Home
        </button>
      </div>
    </div>
  );
}

export default Success;