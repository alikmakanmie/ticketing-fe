import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { gateScan } from "../services/api";

export default function AdminScanner() {
  const scannerRef = useRef(null);
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);
    scannerRef.current = scanner;

    const onSuccess = async (decodedText) => {
      scanner.pause(true);
      setScanning(false);
      try {
        const data = await gateScan(decodedText);
        setResult({ ok: data.success, message: data.message, alert: data.alert, info: data.data });
      } catch (e) {
        setResult({ ok: false, message: e.message, alert: "danger" });
      }
    };

    scanner.render(onSuccess, (err) => console.warn(err));

    return () => {
      scanner.clear().catch(() => { });
    };
  }, []);

  const handleReset = () => {
    setResult(null);
    setScanning(true);
    scannerRef.current?.resume();
  };

  const alertStyle = {
    success: "bg-green-900/50 border-green-500/50 text-green-300",
    danger: "bg-red-900/50 border-red-500/50 text-red-300",
    warning: "bg-yellow-900/40 border-yellow-500/40 text-yellow-300",
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white">🔍 Gate Scanner</h1>
        <p className="text-gray-400 text-sm mt-1">Scan QR tiket pengunjung untuk memverifikasi akses masuk.</p>
      </div>

      {/* Scanner container */}
      <div className="bg-gray-800/60 border border-white/10 rounded-2xl overflow-hidden mb-6">
        <div id="qr-reader" className="w-full" />
      </div>

      {/* Result */}
      {result && (
        <div
          className={`border rounded-2xl p-5 mb-4 ${alertStyle[result.alert ?? (result.ok ? "success" : "danger")]
            }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {result.alert === "success" ? "✅" : result.alert === "warning" ? "⚠️" : "❌"}
            </span>
            <div>
              <p className="font-bold text-base">{result.message}</p>
              {result.info && (
                <div className="mt-2 space-y-1 text-sm opacity-80">
                  {result.info.event && <p>🎪 {result.info.event}</p>}
                  {result.info.session && <p>🗓️ {result.info.session}</p>}
                  {result.info.time && <p>⏰ {result.info.time}</p>}
                  {result.info.category && <p>🏷️ {result.info.category}</p>}
                  {result.info.seat && <p>💺 Kursi {result.info.seat}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!scanning && (
        <button
          onClick={handleReset}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-2xl transition-colors"
        >
          🔄 Scan Berikutnya
        </button>
      )}
    </div>
  );
}