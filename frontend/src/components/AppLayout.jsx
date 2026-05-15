import { useEffect, useRef, useState } from "react";
import { HiOutlineUser } from "react-icons/hi2";
import { Link, useLocation, Outlet } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home", exact: true },
    { to: "/questions", label: "Questions" },
    { to: "/ask", label: "Ask" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <header className="bg-gray-900 dark:bg-gray-950 border-b border-gray-800 dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DC</span>
                </div>
                <span className="text-white font-semibold text-lg leading-none">DIH Champions</span>
              </Link>

              <nav className="hidden sm:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = link.exact
                    ? location.pathname === link.to
                    : location.pathname.startsWith(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-brand-600/20 text-brand-400"
                          : "text-gray-300 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right side: theme toggle + user menu */}
            <div className="flex items-center gap-3">
              {/* Dark / light toggle */}
              <button
                type="button"
                onClick={toggle}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {dark ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" /></svg>
                )}
              </button>

              {/* User avatar dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    menuOpen
                      ? "bg-brand-500 text-white ring-2 ring-brand-400"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                  }`}
                >
                  <HiOutlineUser className="w-5 h-5" />
                </button>

                {menuOpen && (
                  <div className="animate-slideDown absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || "No email set"}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Settings
                      </Link>
                      <Link
                        to={`/users/${user?.username}`}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        View Profile
                      </Link>
                      {user?.is_staff && (
                        <Link
                          to="/admin/sql"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          SQL Console
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-gray-100 dark:border-gray-800 py-1">
                      <button
                        type="button"
                        onClick={signOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
