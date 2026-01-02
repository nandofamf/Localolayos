import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Package, History, Plus, Store } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/pos", icon: ShoppingCart, label: "Punto de Venta" },
  { path: "/productos", icon: Package, label: "Productos" },
  { path: "/agregar-producto", icon: Plus, label: "Agregar Producto" },
  { path: "/historial", icon: History, label: "Historial" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border shadow-card hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Olayo's POS</h1>
              <p className="text-xs text-muted-foreground capitalize">{today}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Store className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Olayo's POS</span>
          </div>
        </div>
        <nav className="flex overflow-x-auto px-2 pb-2 gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground bg-muted hover:bg-accent"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:pt-0 pt-28">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
