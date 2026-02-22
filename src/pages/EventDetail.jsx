import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventBySlug } from "../services/api";

export default function EventDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getEventBySlug(slug)
            .then(setEvent)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading)
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400">Memuat detail event...</p>
                </div>
            </div>
        );

    if (error || !event)
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-center">
                <div>
                    <p className="text-5xl mb-4">😕</p>
                    <p className="text-red-400 font-semibold">Event tidak ditemukan</p>
                    <p className="text-gray-500 text-sm mt-2">{error}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="mt-6 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2 rounded-full text-sm transition-colors"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        );

    return (
        <div className="max-w-5xl mx-auto px-6 py-10">
            {/* Back */}
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Kembali ke Semua Event
            </button>

            {/* Header Banner */}
            <div className="relative rounded-2xl overflow-hidden mb-8 h-56 md:h-72 bg-gradient-to-br from-violet-900 via-purple-800 to-pink-900">
                {event.banner_url && (
                    <img
                        src={event.banner_url}
                        alt={event.name}
                        className="w-full h-full object-cover opacity-60"
                    />
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-transparent">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.name}</h1>
                    <p className="text-gray-300 text-sm flex items-center gap-2">
                        <span>📍</span> {event.venue ?? "Lokasi menyusul"}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left: Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-5">
                        <h3 className="text-white font-semibold mb-3">Info Event</h3>
                        <div className="space-y-3 text-sm text-gray-300">
                            <div className="flex gap-3">
                                <span className="text-lg">🎪</span>
                                <div>
                                    <p className="text-gray-500 text-xs">Kategori</p>
                                    <p>{event.category ?? "Umum"}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-lg">📍</span>
                                <div>
                                    <p className="text-gray-500 text-xs">Tempat</p>
                                    <p>{event.venue ?? "-"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-5">
                        <h3 className="text-white font-semibold mb-3">Deskripsi</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {event.description ?? "Tidak ada deskripsi."}
                        </p>
                    </div>
                </div>

                {/* Right: Sessions */}
                <div className="md:col-span-2">
                    <h2 className="text-white font-bold text-xl mb-4">Pilih Sesi</h2>
                    {!event.sessions || event.sessions.length === 0 ? (
                        <div className="bg-gray-800/40 border border-white/10 rounded-2xl p-10 text-center text-gray-500">
                            <p className="text-4xl mb-3">📅</p>
                            <p>Belum ada sesi tersedia untuk event ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {event.sessions.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onSelect={() => navigate(`/sessions/${session.id}/seats`)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SessionCard({ session, onSelect }) {
    const isOpen = session.status === "open";
    return (
        <div
            className={`bg-gray-800/60 border rounded-2xl p-5 flex items-center justify-between gap-4 transition-all duration-200 ${isOpen
                    ? "border-white/10 hover:border-violet-500/50 hover:shadow-violet-900/20 hover:shadow-lg"
                    : "border-white/5 opacity-60"
                }`}
        >
            <div className="flex items-start gap-4">
                <div className="bg-violet-600/20 rounded-xl p-3 text-2xl">🗓️</div>
                <div>
                    <p className="text-white font-semibold">{session.name}</p>
                    <p className="text-gray-400 text-sm mt-0.5">
                        {session.event_date} &nbsp;·&nbsp; {session.start_time?.slice(0, 5)} – {session.end_time?.slice(0, 5)}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 capitalize">
                        Status: <span className={isOpen ? "text-green-400" : "text-yellow-400"}>{session.status}</span>
                    </p>
                </div>
            </div>
            <button
                onClick={onSelect}
                disabled={!isOpen}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${isOpen
                        ? "bg-violet-600 hover:bg-violet-500 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
            >
                {isOpen ? "Pilih Kursi →" : "Tutup"}
            </button>
        </div>
    );
}
