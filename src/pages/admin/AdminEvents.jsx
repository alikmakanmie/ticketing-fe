import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminGetEvents, adminDeleteEvent } from "../../services/api";

export default function AdminEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const fetch = () => {
        setLoading(true);
        adminGetEvents()
            .then(setEvents)
            .catch((e) => alert(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetch(); }, []);

    const handleDelete = async (event) => {
        if (!confirm(`Hapus event "${event.name}"? Aksi ini tidak bisa dibatalkan.`)) return;
        setDeletingId(event.id);
        try {
            await adminDeleteEvent(event.id);
            setEvents((prev) => prev.filter((e) => e.id !== event.id));
        } catch (e) {
            alert(e.message);
        } finally {
            setDeletingId(null);
        }
    };

    const statusColor = {
        published: "bg-green-500/20 text-green-400",
        draft: "bg-yellow-500/20 text-yellow-400",
        ended: "bg-gray-500/20 text-gray-400",
        cancelled: "bg-red-500/20 text-red-400",
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">🎪 Manajemen Event</h1>
                    <p className="text-gray-400 text-sm mt-1">Buat, edit, dan kelola semua event</p>
                </div>
                <button
                    onClick={() => navigate("/admin/events/create")}
                    className="bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2"
                >
                    + Buat Event Baru
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : events.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-5xl mb-4">📭</p>
                    <p>Belum ada event. Buat yang pertama!</p>
                </div>
            ) : (
                <div className="bg-gray-800/60 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-900/60 text-gray-400 text-xs uppercase tracking-widest">
                            <tr>
                                <th className="text-left px-5 py-3">Event</th>
                                <th className="text-left px-5 py-3">Lokasi</th>
                                <th className="text-left px-5 py-3">Sesi</th>
                                <th className="text-left px-5 py-3">Status</th>
                                <th className="text-right px-5 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-5 py-4">
                                        <p className="text-white font-medium">{event.name}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{event.city}</p>
                                    </td>
                                    <td className="px-5 py-4 text-gray-300">{event.venue ?? "-"}</td>
                                    <td className="px-5 py-4 text-gray-300">{event.sessions?.length ?? 0} sesi</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColor[event.status] ?? "bg-gray-600 text-gray-300"}`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/events/${event.id}/sessions`)}
                                                className="bg-violet-600/80 hover:bg-violet-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                🗓️ Sesi
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                                                className="bg-blue-600/80 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event)}
                                                disabled={deletingId === event.id}
                                                className="bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                                            >
                                                {deletingId === event.id ? "..." : "Hapus"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
