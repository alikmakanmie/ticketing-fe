import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../services/api";

export default function EventList() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getEvents()
            .then(setEvents)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading)
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400">Memuat event...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center text-red-400">
                    <p className="text-5xl mb-4">⚠️</p>
                    <p className="font-semibold">Gagal memuat event</p>
                    <p className="text-sm text-gray-500 mt-1">{error}</p>
                    <p className="text-xs text-gray-600 mt-2">Pastikan backend Laravel sudah berjalan di port 8000</p>
                </div>
            </div>
        );

    if (events.length === 0)
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-center">
                <div>
                    <p className="text-6xl mb-4">🎭</p>
                    <p className="text-gray-400 text-lg">Belum ada event aktif saat ini.</p>
                </div>
            </div>
        );

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            {/* Hero */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Temukan <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">Event</span> Favoritmu
                </h1>
                <p className="text-gray-400 text-lg">Beli tiket online, masuk dengan QR. Mudah & modern.</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}

function EventCard({ event }) {
    return (
        <Link
            to={`/events/${event.slug}`}
            className="group block bg-gray-800/60 border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/50 hover:shadow-violet-900/30 hover:shadow-xl transition-all duration-300"
        >
            {/* Banner */}
            <div className="h-44 bg-gradient-to-br from-violet-900 via-purple-800 to-pink-900 relative overflow-hidden">
                {event.banner_url ? (
                    <img
                        src={event.banner_url}
                        alt={event.name}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl opacity-40">🎪</span>
                    </div>
                )}
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-violet-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {event.category ?? "Event"}
                </span>
            </div>

            {/* Info */}
            <div className="p-5">
                <h2 className="text-white font-semibold text-lg mb-1 group-hover:text-violet-300 transition-colors line-clamp-2">
                    {event.name}
                </h2>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>

                <div className="space-y-1.5 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{event.sessions?.[0]?.event_date ?? "Lihat sesi"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="truncate">{event.venue ?? "-"}</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-violet-400 text-sm font-semibold">Lihat Tiket →</span>
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-medium">
                        Tersedia
                    </span>
                </div>
            </div>
        </Link>
    );
}
