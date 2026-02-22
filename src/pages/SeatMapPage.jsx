import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSeats, lockSeats } from "../services/api";
import { useBooking } from "../context/BookingContext";
import { useAuth } from "../context/AuthContext";

export default function SeatMapPage() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { setBooking } = useBooking();
    const { user } = useAuth();

    const [data, setData] = useState({ seats: [], categories: [], session: null });
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBookingLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const fetchSeats = () => {
        setLoading(true);
        getSeats(sessionId)
            .then(setData)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchSeats(); }, [sessionId]);

    const toggleSeat = (seat) => {
        if (seat.status !== "available") return;
        const already = selectedSeats.find((s) => s.id === seat.id);
        if (already) {
            setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
        } else {
            if (selectedSeats.length >= 4) return alert("Maksimal 4 kursi per transaksi.");
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleBook = async () => {
        if (!selectedSeats.length) return;

        // Guard: harus login dulu sebelum melanjutkan ke checkout
        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        setBookingLoading(true);
        try {
            const seatIds = selectedSeats.map((s) => s.id);
            const res = await lockSeats(Number(sessionId), seatIds);

            setBooking({
                sessionId: Number(sessionId),
                seats: selectedSeats,
                seatIds,
                lockedUntil: res.data?.locked_until,
                total: selectedSeats.reduce((s, seat) => s + (seat.price ?? 0), 0),
            });
            navigate("/checkout");
        } catch (e) {
            alert(e.message);
            fetchSeats();
        } finally {
            setBookingLoading(false);
        }
    };

    const totalPrice = selectedSeats.reduce((s, seat) => s + (seat.price ?? 0), 0);

    if (loading)
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400">Memuat denah kursi...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-center">
                <div>
                    <p className="text-5xl mb-4">⚠️</p>
                    <p className="text-red-400 font-semibold">{error}</p>
                    <button onClick={() => navigate(-1)} className="mt-4 text-violet-400 hover:underline text-sm">
                        ← Kembali
                    </button>
                </div>
            </div>
        );

    // Group by category for legend
    const categoryMap = {};
    data.categories.forEach((c) => { categoryMap[c.id] = c; });

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2 group transition-colors">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali
            </button>

            {/* Session Header */}
            {data.session && (
                <div className="mb-8 bg-gray-800/60 border border-white/10 rounded-2xl p-5">
                    <h1 className="text-xl font-bold text-white">{data.session.name}</h1>
                    <p className="text-gray-400 text-sm mt-1">📅 {data.session.event_date}</p>
                </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-300">
                <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-green-500 inline-block" /> Tersedia
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-violet-500 inline-block" /> Dipilih
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-yellow-500 inline-block" /> Dikunci
                </span>
                <span className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-gray-600 inline-block" /> Terjual
                </span>
            </div>

            {/* STAGE */}
            <div className="mb-8 text-center">
                <div className="inline-block bg-gray-700/60 border border-white/10 rounded-xl px-16 py-2 text-gray-400 text-sm tracking-widest">
                    ▸ PANGGUNG ◂
                </div>
            </div>

            {/* Seat Grid */}
            {data.seats.length === 0 ? (
                <p className="text-gray-500 text-center py-10">Tidak ada data kursi untuk sesi ini.</p>
            ) : (
                <div className="flex flex-wrap gap-2 justify-center mb-10">
                    {data.seats.map((seat) => {
                        const isSelected = selectedSeats.find((s) => s.id === seat.id);
                        const colors = {
                            available: isSelected ? "bg-violet-600 border-violet-400 text-white scale-110" : `bg-green-600/80 border-green-500 text-white hover:bg-green-500`,
                            locked: "bg-yellow-500/70 border-yellow-400 text-gray-900 cursor-not-allowed",
                            booked: "bg-gray-600/60 border-gray-500 text-gray-400 cursor-not-allowed",
                        };
                        const cls = colors[seat.status] ?? colors.available;
                        return (
                            <button
                                key={seat.id}
                                title={`${seat.seat_code} - ${seat.category_name} - Rp ${(seat.price ?? 0).toLocaleString("id-ID")}`}
                                onClick={() => toggleSeat(seat)}
                                disabled={seat.status !== "available"}
                                className={`w-11 h-11 text-xs font-bold rounded-md border transition-all duration-150 ${cls}`}
                            >
                                {seat.seat_code}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Bottom Bar */}
            <div className="sticky bottom-4 bg-gray-900/95 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
                <div>
                    <p className="text-gray-400 text-sm">
                        Kursi dipilih: <span className="text-white font-semibold">{selectedSeats.length}</span>
                        {selectedSeats.length > 0 && (
                            <span className="ml-2 text-gray-500">
                                ({selectedSeats.map((s) => s.seat_code).join(", ")})
                            </span>
                        )}
                    </p>
                    {selectedSeats.length > 0 && (
                        <p className="text-violet-300 font-bold text-lg mt-0.5">
                            Total: Rp {totalPrice.toLocaleString("id-ID")}
                        </p>
                    )}
                </div>
                <button
                    onClick={handleBook}
                    disabled={selectedSeats.length === 0 || booking}
                    className="bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                >
                    {booking ? "Mengunci kursi..." : "Pesan Sekarang →"}
                </button>
            </div>

            {/* Modal: Login Required */}
            {showLoginPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                        <div className="text-5xl mb-4">🔐</div>
                        <h2 className="text-white font-bold text-xl mb-2">Login Diperlukan</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Kamu harus login dulu sebelum memesan tiket.
                            Kursi pilihanmu akan tersimpan.
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)}
                                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-xl transition-colors"
                            >
                                Login Sekarang
                            </button>
                            <button
                                onClick={() => navigate(`/register?redirect=${encodeURIComponent(location.pathname)}`)}
                                className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-semibold py-3 rounded-xl transition-colors"
                            >
                                Belum punya akun? Daftar
                            </button>
                            <button
                                onClick={() => setShowLoginPrompt(false)}
                                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                            >
                                Batalkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
