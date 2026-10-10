import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Briefcase,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Truck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/projects", label: "Projects / Deals", icon: Briefcase },
  { to: "/finance", label: "Finance", icon: Wallet },
  { to: "/settings", label: "Settings", icon: Settings, adminOnly: true },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-accent-50 text-accent-700"
      : "text-gray-600 hover:bg-gray-100"
  }`;

export function AppShell() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Kunci scroll body saat sidebar mobile terbuka
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  const links = nav
    .filter((n) => !n.adminOnly || user?.role === "ADMIN")
    .map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        onClick={() => setOpen(false)}
        className={navLinkClass}
      >
        <Icon size={18} />
        {label}
      </NavLink>
    ));

  return (
    <div className="min-h-screen lg:flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          <span className="font-semibold">ERP Machinery</span>
          <button
            type="button"
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">{links}</nav>

        <div className="border-t border-gray-200 p-3">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="mb-2 text-xs text-gray-500">
            {user?.role === "ADMIN" ? "Admin" : "User"}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Konten */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
          >
            <Menu size={22} />
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
