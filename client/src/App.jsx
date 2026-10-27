import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AppNavbar from "./components/AppNavbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserHome from "./pages/UserHome";
import MyBookings from "./pages/MyBookings";
import AdminHome from "./pages/AdminHome";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />

      <main className="flex-grow-1">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Ordinary user pages */}
          <Route
            path="/userhome"
            element={<ProtectedRoute role="ordinary"><UserHome /></ProtectedRoute>}
          />
          <Route
            path="/bookings"
            element={<ProtectedRoute role="ordinary"><MyBookings /></ProtectedRoute>}
          />

          {/* Admin page */}
          <Route
            path="/adminhome"
            element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>}
          />

          {/* Unknown URL -> Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}

export default App;