import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/api";

const ROLE_MENU = {
    admin: [{ to: "/admin/events", label: "🎪 Event" }, { to: "/admin/finance", label: "💰 Keuangan" }, { to: "/admin/scanner", label: "🔍 Scanner" }],
    finance: [{ to: "/admin/finance", label: "💰 Keuangan" }],
    gate_officer: [{ to: "/admin/scanner", label: "🔍 Scanner" }],
    buyer: [],
};

export default function Navbar() {
    const { user, clearUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try { await logout(); } catch (_) { }
        clearUser();
        navigate("/login");
    };

    const staffMenu = ROLE_MENU[user?.role] ?? [];

    return (
        <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-white/10 shadow-xl">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group shrink-0">
                    <span className="text-2xl">🎟️</span>
                    <span className="text-white font-bold text-lg tracking-tight group-hover:text-violet-400 transition-colors">
                        TiketIn
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-1 flex-1">
                    <Link to="/" className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        Events
                    </Link>

                    {/* Role-based menu */}
                    {staffMenu.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Auth */}
                <div className="flex items-center gap-3 shrink-0">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                                <span className="text-xs text-gray-400">👤</span>
                                <span className="text-xs text-white font-medium">{user.name}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${user.role === "admin" ? "bg-red-500/20 text-red-300" :
                                        user.role === "finance" ? "bg-green-500/20 text-green-300" :
                                            user.role === "gate_officer" ? "bg-blue-500/20 text-blue-300" :
                                                "bg-violet-500/20 text-violet-300"
                                    }`}>
                                    {user.role}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600/80 hover:bg-red-500 text-white text-sm px-4 py-1.5 rounded-full transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="bg-violet-600 hover:bg-violet-500 text-white text-sm px-4 py-1.5 rounded-full transition-colors font-medium">
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
