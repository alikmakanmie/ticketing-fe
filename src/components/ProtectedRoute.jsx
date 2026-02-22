import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Bungkus halaman yang butuh login.
 * Jika belum login → redirect ke /login?redirect=<current-path>
 */
export default function ProtectedRoute({ children }) {
    const { user, authLoading } = useAuth();
    const location = useLocation();

    // Tunggu sampai auth state selesai dicek (getMe selesai)
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        // Simpan tujuan asal supaya setelah login bisa kembali
        return (
            <Navigate
                to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
                replace
            />
        );
    }

    return children;
}
