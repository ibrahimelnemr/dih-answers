import { Link, useLocation, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Questions" },
    { to: "/ask", label: "Ask" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DC</span>
                </div>
                <div>
                  <span className="text-white font-semibold text-lg leading-none">DIH Champions</span>
                </div>
              </Link>

              <nav className="hidden sm:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = link.to === "/" ? location.pathname === "/" : location.pathname.startsWith(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-slate-800 text-white"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm hidden sm:block">{user?.username}</span>
              <button
                type="button"
                onClick={signOut}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
