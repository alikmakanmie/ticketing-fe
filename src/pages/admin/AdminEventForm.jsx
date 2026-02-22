import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminGetEvent, adminCreateEvent, adminUpdateEvent } from "../../services/api";

const EMPTY = { name: "", description: "", venue: "", venue_address: "", city: "", status: "draft" };
const STATUSES = ["draft", "published", "ended", "cancelled"];

export default function AdminEventForm() {
    const { id } = useParams(); // undefined = create mode
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(EMPTY);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEdit) return;
        adminGetEvent(id)
            .then((data) => setForm({
                name: data.name ?? "",
                description: data.description ?? "",
                venue: data.venue ?? "",
                venue_address: data.venue_address ?? "",
                city: data.city ?? "",
                status: data.status ?? "draft",
            }))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, [id, isEdit]);

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            if (isEdit) {
                await adminUpdateEvent(id, form);
            } else {
                await adminCreateEvent(form);
            }
            navigate("/admin/events");
        } catch (err) {
            setError(err.message);
        } finally {
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
            <button
                onClick={() => navigate("/admin/events")}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-6 group transition-colors"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Kembali
            </button>

            <h1 className="text-2xl font-bold text-white mb-8">
                {isEdit ? "✏️ Edit Event" : "➕ Buat Event Baru"}
            </h1>

            {error && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300 text-sm">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-800/60 border border-white/10 rounded-2xl p-6 space-y-5">
                {/* Name */}
                <div>
                    <label className="text-gray-300 text-sm font-medium block mb-1.5">Nama Event *</label>
                    <input
                        required value={form.name} onChange={update("name")}
                        className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        placeholder="Kancah Seni 2026"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="text-gray-300 text-sm font-medium block mb-1.5">Deskripsi</label>
                    <textarea
                        rows={4} value={form.description} onChange={update("description")}
                        className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                        placeholder="Deskripsi singkat event..."
                    />
                </div>

                {/* Venue + City */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1.5">Nama Venue</label>
                        <input
                            value={form.venue} onChange={update("venue")}
                            className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                            placeholder="Gedung Kesenian Jakarta"
                        />
                    </div>
                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1.5">Kota</label>
                        <input
                            value={form.city} onChange={update("city")}
                            className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                            placeholder="Jakarta"
                        />
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="text-gray-300 text-sm font-medium block mb-1.5">Alamat Venue</label>
                    <input
                        value={form.venue_address} onChange={update("venue_address")}
                        className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                        placeholder="Jl. Pos No.1, Jakarta Pusat"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="text-gray-300 text-sm font-medium block mb-1.5">Status</label>
                    <select
                        value={form.status} onChange={update("status")}
                        className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                    {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Event"}
                </button>
            </form>
        </div>
    );
}
