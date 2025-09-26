// admin/src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthRole } from "../hooks/useAuthRole";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import LeadsPage from "../pages/LeadsListPage";

export default function AppRoutes() {
  const { role, loading } = useAuthRole();

  if (loading) return null;

  const isAdmin = role === "admin";

  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard principal (admin) */}
      <Route
        path="/admin"
        element={isAdmin ? <Dashboard /> : <Navigate to="/login" replace />}
      />

      {/* Lista de leads (admin) - usa :type = novos | pendentes | em-tratativa | convertidos | todos */}
      <Route
        path="/leads/:type"
        element={isAdmin ? <LeadsPage /> : <Navigate to="/login" replace />}
      />
      {/* Default para /leads */}
      <Route path="/leads" element={<Navigate to="/leads/todos" replace />} />

      {/* Raiz */}
      <Route
        path="/"
        element={<Navigate to={isAdmin ? "/admin" : "/login"} replace />}
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
