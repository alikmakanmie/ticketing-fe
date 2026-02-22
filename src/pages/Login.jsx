import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { login } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/";
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await login(form.email, form.password);
            // Laravel Sanctum returns: { token: "...", user: {...} }
            setUser(res.user ?? res, res.token ?? res.access_token);
            navigate(redirectTo, { replace: true });
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-5xl">🎟️</span>
                    <h1 className="text-2xl font-bold text-white mt-3">Masuk ke TiketIn</h1>
                    <p className="text-gray-400 text-sm mt-1">Beli tiket, scan gate, nikmati event!</p>
                </div>

                <div className="bg-gray-800/60 border border-white/10 rounded-2xl p-8">
                    {error && (
                        <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm mb-5">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-gray-300 text-sm font-medium block mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                                placeholder="kamu@email.com"
                            />
                        </div>

                        <div>
                            <label className="text-gray-300 text-sm font-medium block mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full bg-gray-900/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-colors"
                        >
                            {loading ? "Masuk..." : "Masuk"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Belum punya akun?{" "}
                        <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
