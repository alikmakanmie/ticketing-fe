import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminGetSessions, adminDeleteSession } from "../../services/api";

const STATUS_COLOR = {
    open: "bg-green-500/20 text-green-400",
    upcoming: "bg-blue-500/20 text-blue-300",
    sold_out: "bg-red-500/20 text-red-400",
    ongoing: "bg-yellow-500/20 text-yellow-300",
    ended: "bg-gray-500/20 text-gray-400",
};

export default function AdminSessions() {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetch = () => {
        setLoading(true);
        adminGetSessions(eventId)
            .then((data) => {
                setEvent(data.event);
                setSessions(data.sessions ?? []);
            })
            .catch((e) => alert(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetch(); }, [eventId]);

    const handleDelete = async (session) => {
        if (!confirm(`Hapus sesi "${session.name}"?`)) return;
        setDeletingId(session.id);
        try {
            await adminDeleteSession(session.id);
            setSessions((prev) => prev.filter((s) => s.id !== session.id));
        } catch (e) {
            alert(e.message);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <button
                onClick={() => navigate("/admin/events")}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6 group transition-colors"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Semua Event
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        🗓️ Sesi Event
                    </h1>
                    {event && (
                        <p className="text-violet-300 text-sm mt-1 font-medium">{event.name}</p>
                    )}
                </div>
                <button
                    onClick={() => navigate(`/admin/events/${eventId}/sessions/create`)}
                    className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
                >
                    + Tambah Sesi
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : sessions.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-5xl mb-4">📭</p>
                    <p>Belum ada sesi. Tambahkan sesi pertama!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="bg-gray-800/60 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-violet-600/20 rounded-xl p-3 text-xl shrink-0">🗓️</div>
                                <div>
                                    <p className="text-white font-semibold">{session.name}</p>
                                    <p className="text-gray-400 text-sm mt-0.5">
                                        📅 {session.event_date} &nbsp;·&nbsp;
                                        ⏰ {session.start_time?.slice(0, 5)} – {session.end_time?.slice(0, 5)}
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        💺 {session.available_seats}/{session.total_seats} kursi tersedia
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLOR[session.status] ?? "bg-gray-600 text-gray-300"}`}>
                                    {session.status?.replace("_", " ")}
                                </span>
                                <button
                                    onClick={() => navigate(`/admin/sessions/${session.id}/edit`)}
                                    className="bg-blue-600/80 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(session)}
                                    disabled={deletingId === session.id}
                                    className="bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    {deletingId === session.id ? "..." : "Hapus"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
