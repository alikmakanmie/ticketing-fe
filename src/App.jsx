import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// Public pages
import EventList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import SeatMapPage from "./pages/SeatMapPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Buyer flow
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Success from "./pages/Success";

// Admin pages
import AdminEvents from "./pages/admin/AdminEvents";
import AdminEventForm from "./pages/admin/AdminEventForm";
import AdminSessions from "./pages/admin/AdminSessions";
import AdminSessionForm from "./pages/admin/AdminSessionForm";

// Finance pages
import FinanceDashboard from "./pages/admin/FinanceDashboard";

// Gate officer
import AdminScanner from "./pages/AdminScanner";

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <main>
        <Routes>
          {/* ── Publik ─────────────────────────────────────── */}
          <Route path="/" element={<EventList />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/sessions/:sessionId/seats" element={<SeatMapPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Buyer: Butuh Login ──────────────────────────── */}
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />

          {/* ── Admin: CRUD Event ───────────────────────────── */}
          <Route
            path="/admin/events"
            element={<RoleRoute roles={["admin"]}><AdminEvents /></RoleRoute>}
          />
          <Route
            path="/admin/events/create"
            element={<RoleRoute roles={["admin"]}><AdminEventForm /></RoleRoute>}
          />
          <Route
            path="/admin/events/:id/edit"
            element={<RoleRoute roles={["admin"]}><AdminEventForm /></RoleRoute>}
          />
          <Route
            path="/admin/events/:eventId/sessions"
            element={<RoleRoute roles={["admin"]}><AdminSessions /></RoleRoute>}
          />
          <Route
            path="/admin/events/:eventId/sessions/create"
            element={<RoleRoute roles={["admin"]}><AdminSessionForm /></RoleRoute>}
          />
          <Route
            path="/admin/sessions/:sessionId/edit"
            element={<RoleRoute roles={["admin"]}><AdminSessionForm /></RoleRoute>}
          />

          {/* ── Finance: Kelola Pembayaran ──────────────────── */}
          <Route
            path="/admin/finance"
            element={<RoleRoute roles={["finance", "admin"]}><FinanceDashboard /></RoleRoute>}
          />

          {/* ── Gate Officer: Scan QR ───────────────────────── */}
          <Route
            path="/admin/scanner"
            element={<RoleRoute roles={["gate_officer", "admin"]}><AdminScanner /></RoleRoute>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;