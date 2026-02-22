import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Route yang hanya bisa diakses oleh role tertentu.
 * Props: roles = ['admin'] atau ['finance'] dll.
 */
export default function RoleRoute({ children, roles }) {
    const { user, authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (roles && !roles.includes(user.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div>
                    <p className="text-6xl mb-4">🚫</p>
                    <h1 className="text-2xl font-bold text-white mb-2">Akses Ditolak</h1>
                    <p className="text-gray-400">Halaman ini hanya untuk role: <span className="text-violet-300">{roles.join(", ")}</span></p>
                    <p className="text-gray-500 text-sm mt-1">Kamu login sebagai: <span className="text-yellow-300">{user.role}</span></p>
                </div>
            </div>
        );
    }

    return children;
}
