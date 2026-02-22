import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SeatButton from "./SeatButton";
import { getSeats, lockSeats } from "../services/api";
import { useBooking } from "../context/BookingContext";

function SeatMap() {
  const [loading, setLoading] = useState(false);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();
  const { setBooking } = useBooking();

  useEffect(() => {
    const loadSeats = async () => {
      const data = await getSeats(1); // session id sementara
      setSeats(data);
    };

    loadSeats();
  }, []);

  const toggleSeat = (seat) => {
    if (seat.status !== "available") return;

    const exists = selectedSeats.find((s) => s.id === seat.id);

    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
      return;
    }

    if (selectedSeats.length >= 4) {
      alert("Maksimal 4 kursi per transaksi.");
      return;
    }

    setSelectedSeats([...selectedSeats, seat]);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;

    try {
      setLoading(true);

      const seatIds = selectedSeats.map((seat) => seat.id);
      const response = await lockSeats(1, seatIds);

      setBooking({
        seats: selectedSeats,
        total: selectedSeats.length * 100000,
        bookingCode: response.booking_code,
        expiredAt: response.expired_at,
      });

      navigate("/checkout");

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Seat Map</h1>

      <p className="text-sm text-gray-600 mb-4">
        Maksimal 4 kursi per transaksi
      </p>

      <div className="flex gap-4 flex-wrap">
        {seats.map((seat) => (
          <SeatButton
            key={seat.id}
            seat={seat}
            selectedSeats={selectedSeats}
            toggleSeat={toggleSeat}
          />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Selected Seats:</h2>
        <p>
          {selectedSeats.length > 0
            ? selectedSeats.map((seat) => seat.seat_number).join(", ")
            : "None"}
        </p>
      </div>

      <button
        onClick={handleBooking}
        disabled={selectedSeats.length === 0 || loading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Memproses..." : "Pesan Sekarang"}
      </button>
    </div>
  );
}

export default SeatMap;