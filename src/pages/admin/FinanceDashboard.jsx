import { useState, useEffect } from "react";
import { financeGetOrders, financeVerify } from "../../services/api";

const STATUS_COLOR = {
    pending_payment: "bg-yellow-500/20 text-yellow-300",
    paid: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
    expired: "bg-gray-500/20 text-gray-400",
};

export default function FinanceDashboard() {
    const [orders, setOrders] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [verifyingCode, setVerifyingCode] = useState(null);

    const fetchOrders = (p) => {
        setLoading(true);
        financeGetOrders(p)
            .then((res) => {
                setOrders(res.data?.data ?? res.data ?? []);
                setMeta(res.data);
            })
            .catch((e) => alert(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchOrders(page); }, [page]);

    const handleVerify = async (orderCode) => {
        if (!confirm(`Verifikasi pembayaran "${orderCode}"?`)) return;
        setVerifyingCode(orderCode);
        try {
            await financeVerify(orderCode);
            fetchOrders(page); // refresh
        } catch (e) {
            alert(e.message);
        } finally {
            setVerifyingCode(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">💰 Dashboard Keuangan</h1>
                <p className="text-gray-400 text-sm mt-1">Verifikasi pembayaran dan pantau status order</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Order", value: meta?.total ?? "—", color: "text-white" },
                    { label: "Pending", value: orders.filter(o => o.status === "pending_payment").length, color: "text-yellow-300" },
                    { label: "Lunas", value: orders.filter(o => o.status === "paid").length, color: "text-green-400" },
                    { label: "Halaman", value: `${page} / ${meta?.last_page ?? 1}`, color: "text-gray-300" },
                ].map(({ label, value, color }) => (
                    <div key={label} className="bg-gray-800/60 border border-white/10 rounded-2xl p-4">
                        <p className="text-gray-400 text-xs mb-1">{label}</p>
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-5xl mb-4">📭</p>
                    <p>Tidak ada order ditemukan.</p>
                </div>
            ) : (
                <>
                    <div className="bg-gray-800/60 border border-white/10 rounded-2xl overflow-hidden mb-4">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-900/60 text-gray-400 text-xs uppercase tracking-widest">
                                <tr>
                                    <th className="text-left px-5 py-3">Kode Order</th>
                                    <th className="text-left px-5 py-3">Pembeli</th>
                                    <th className="text-left px-5 py-3">Event</th>
                                    <th className="text-left px-5 py-3">Total</th>
                                    <th className="text-left px-5 py-3">Metode</th>
                                    <th className="text-left px-5 py-3">Status</th>
                                    <th className="text-right px-5 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-5 py-4 font-mono text-violet-300 text-xs">{order.order_code}</td>
                                        <td className="px-5 py-4">
                                            <p className="text-white">{order.user?.name ?? "—"}</p>
                                            <p className="text-gray-500 text-xs">{order.user?.email}</p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-300 text-xs">
                                            {order.session?.event?.name ?? "—"}
                                        </td>
                                        <td className="px-5 py-4 text-white font-semibold">
                                            Rp {Number(order.total_amount ?? 0).toLocaleString("id-ID")}
                                        </td>
                                        <td className="px-5 py-4 text-gray-300 capitalize text-xs">
                                            {order.payment?.payment_method?.replace("_", " ") ?? "—"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[order.status] ?? "bg-gray-600 text-gray-300"}`}>
                                                {order.status?.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {order.status === "pending_payment" ? (
                                                <button
                                                    onClick={() => handleVerify(order.order_code)}
                                                    disabled={verifyingCode === order.order_code}
                                                    className="bg-green-600/80 hover:bg-green-500 disabled:opacity-50 text-white text-xs px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    {verifyingCode === order.order_code ? "..." : "✅ Verifikasi"}
                                                </button>
                                            ) : (
                                                <span className="text-gray-600 text-xs">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="px-4 py-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white disabled:opacity-40 transition-colors text-sm"
                        >
                            ←
                        </button>
                        <span className="px-4 py-2 text-gray-400 text-sm">Hal {page}</span>
                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!meta?.next_page_url}
                            className="px-4 py-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white disabled:opacity-40 transition-colors text-sm"
                        >
                            →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
