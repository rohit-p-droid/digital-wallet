import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Catch-all Route (Optional) */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}