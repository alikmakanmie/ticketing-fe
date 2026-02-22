import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function AdminScanner() {

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false
    );

    const onScanSuccess = async (decodedText) => {
      try {
        const response = await fetch("https://backend-kamu.com/api/validate-ticket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qr_code: decodedText }),
        });

        const data = await response.json();

        alert(data.message);

      } catch (error) {
        alert("Gagal koneksi ke server");
      }
    };

    scanner.render(onScanSuccess);

    return () => {
      scanner.clear().catch(error => console.error(error));
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">QR Scanner Admin</h1>
      <div id="reader" className="w-80"></div>
    </div>
  );
}