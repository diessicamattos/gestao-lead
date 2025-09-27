// rep/src/App.tsx
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useAuth, AuthProvider } from "./hooks/useAuth";
import Dashboard from "./pages/Dashboard";
import LeadsListPage from "./pages/LeadsListPage";
import LeadDetailsPage from "./pages/LeadDetailsPage";
import Login from "./pages/Login";
import { Protected } from "./routes";

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

function AppInner() {
  const { setUser } = useAuth();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, [setUser]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      <Route
        path="/leads/:type"
        element={
          <Protected>
            <LeadsListPage />
          </Protected>
        }
      />
      <Route
        path="/lead/:id"
        element={
          <Protected>
            <LeadDetailsPage />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
