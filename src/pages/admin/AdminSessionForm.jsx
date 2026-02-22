import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    adminGetSession,
    adminCreateSession,
    adminUpdateSession,
} from "../../services/api";

const STATUSES = ["upcoming", "open", "sold_out", "ongoing", "ended"];
const EMPTY = { name: "", event_date: "", start_time: "", end_time: "", status: "upcoming" };

export default function AdminSessionForm() {
    // /admin/events/:eventId/sessions/create  → create mode
    // /admin/sessions/:sessionId/edit         → edit mode
    const { eventId, sessionId } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(sessionId);

    const [form, setForm] = useState(EMPTY);
    const [eventName, setEventName] = useState("");
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEdit) return;
        adminGetSession(sessionId)
            .then((data) => {
                setForm({
                    name: data.name ?? "",
                    event_date: data.event_date?.slice(0, 10) ?? "",
                    start_time: data.start_time?.slice(0, 5) ?? "",
                    end_time: data.end_time?.slice(0, 5) ?? "",
                    status: data.status ?? "upcoming",
                });
                setEventName(data.event?.name ?? "");
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [sessionId, isEdit]);

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (isEdit) {
                const data = await adminUpdateSession(sessionId, form);
                // navigate back to event's session list
                navigate(`/admin/events/${data.data?.event_id ?? ""}/sessions`);
            } else {
                await adminCreateSession(eventId, form);
                navigate(`/admin/events/${eventId}/sessions`);
            }
        } catch (err) {
            setError(err.message);
            setSaving(false);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );

    return (
        <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Back */}
            <button
                onClick={() => navigate(-1)}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6 group transition-colors"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali
            </button>

            <h1 className="text-2xl font-bold text-white mb-1">
                {isEdit ? "✏️ Edit Sesi" : "➕ Tambah Sesi Baru"}
            </h1>
            {eventName && (
                <p className="text-violet-300 text-sm mb-8">Event: {eventName}</p>
            )}

            {error && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300 text-sm">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 space-y-5">
                {/* Name */}
                <div>
                    <label className="text-gray-300 text-sm font-medium block mb-1.5">Nama Sesi *</label>
                    <input
                        required value={form.name} onChange={update("name")}
                        className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        placeholder="Malam 1 - Pembukaan"
                    />
                </div>

                {/* Date */}
                <div>
                    <label className="text-gray-300 text-sm font-medium block mb-1.5">Tanggal Event *</label>
                    <input
                        required type="date" value={form.event_date} onChange={update("event_date")}
                        className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                    />
                </div>

                {/* Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1.5">Jam Mulai *</label>
                        <input
                            required type="time" value={form.start_time} onChange={update("start_time")}
                            className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1.5">Jam Selesai *</label>
                        <input
                            required type="time" value={form.end_time} onChange={update("end_time")}
                            className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Status */}
                <div>
                    <label className="text-gray-300 text-sm font-medium block mb-1.5">Status</label>
                    <select
                        value={form.status} onChange={update("status")}
                        className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s} className="capitalize">{s.replace("_", " ")}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                    {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Sesi"}
                </button>
            </form>
        </div>
    );
}
