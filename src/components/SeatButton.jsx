function SeatButton({ seat, selectedSeats, toggleSeat }) {
  const getSeatColor = () => {
    if (seat.status === "booked")
      return "bg-gray-400 cursor-not-allowed";
    if (seat.status === "locked")
      return "bg-yellow-400 cursor-not-allowed";
    if (selectedSeats.includes(seat.id))
      return "bg-blue-600 text-white";
    return "bg-green-500 text-white";
  };

  return (
    <button
      onClick={() => toggleSeat(seat)}
      className={`w-12 h-12 rounded font-semibold ${getSeatColor()}`}
    >
      {seat.seat_number}
    </button>
  );
}

export default SeatButton;