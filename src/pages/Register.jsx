import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.password_confirmation) {
            return setError("Konfirmasi password tidak cocok.");
        }
        setLoading(true);
        setError(null);
        try {
            const res = await register(form.name, form.email, form.password, form.password_confirmation);
            setUser(res.user ?? res, res.token ?? res.access_token);
            navigate("/");
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-5xl">🎉</span>
                    <h1 className="text-2xl font-bold text-white mt-3">Buat Akun TiketIn</h1>
                    <p className="text-gray-400 text-sm mt-1">Gratis! Mulai beli tiket sekarang.</p>
                </div>

                <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-8">
                    {error && (
                        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm mb-5">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { label: "Nama Lengkap", field: "name", type: "text", placeholder: "Nama kamu" },
                            { label: "Email", field: "email", type: "email", placeholder: "kamu@email.com" },
                            { label: "Password", field: "password", type: "password", placeholder: "Min. 8 karakter" },
                            { label: "Konfirmasi Password", field: "password_confirmation", type: "password", placeholder: "Ulangi password" },
                        ].map(({ label, field, type, placeholder }) => (
                            <div key={field}>
                                <label className="text-gray-300 text-sm font-medium block mb-1.5">{label}</label>
                                <input
                                    type={type}
                                    required
                                    value={form[field]}
                                    onChange={update(field)}
                                    className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                                    placeholder={placeholder}
                                />
                            </div>
                        ))}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-colors mt-2"
                        >
                            {loading ? "Mendaftar..." : "Daftar Sekarang"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Sudah punya akun?{" "}
                        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
                            Masuk
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
