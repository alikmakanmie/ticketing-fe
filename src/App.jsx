import { Routes, Route } from "react-router-dom";
import SeatMap from "./components/SeatMap.jsx";
import Checkout from "./pages/checkout.jsx";
import Payment from "./pages/Payment.jsx";
import Success from "./pages/Success.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <Routes>
        <Route path="/" element={<SeatMap />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </div>
  );
}

export default App;