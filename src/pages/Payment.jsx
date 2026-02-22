import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { useEffect, useState } from "react";

function Payment() {
  const navigate = useNavigate();
  const { booking } = useBooking();
  const [loading, setLoading] = useState(false);

  // Redirect kalau tidak ada booking
  useEffect(() => {
    if (!booking) {
      navigate("/");
    }
  }, [booking, navigate]);

  if (!booking) return null;

  const { seats, total } = booking;

const handlePayment = () => {
  console.log("Tombol diklik");

  setLoading(true);

  setTimeout(() => {
    console.log("Navigating to success");
    navigate("/success");
  }, 1500);
};

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pembayaran</h1>

      <div className="bg-white p-6 rounded shadow-md max-w-md">
        <p className="mb-4">Total yang harus dibayar:</p>

        <p className="text-xl font-semibold mb-6">
          Rp {total.toLocaleString("id-ID")}
        </p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Memproses Pembayaran..." : "Bayar Sekarang"}
        </button>
      </div>
    </div>
  );
}

export default Payment;