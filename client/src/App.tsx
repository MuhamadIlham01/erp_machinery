import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { useAuth } from "./features/auth/AuthContext";
import { LoginPage } from "./features/auth/LoginPage";
import { Placeholder } from "./features/Placeholder";

function Protected({
  adminOnly = false,
  children,
}: {
  adminOnly?: boolean;
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  if (loading)
    return <div className="p-6 text-sm text-gray-500">Memuat...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <Protected>
            <AppShell />
          </Protected>
        }
      >
        <Route index element={<Placeholder title="Dashboard" />} />
        <Route path="customers" element={<Placeholder title="Customers" />} />
        <Route path="suppliers" element={<Placeholder title="Suppliers" />} />
        <Route
          path="projects"
          element={<Placeholder title="Projects / Deals" />}
        />
        <Route path="finance" element={<Placeholder title="Finance" />} />
        <Route
          path="settings"
          element={
            <Protected adminOnly>
              <Placeholder title="Settings" />
            </Protected>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
