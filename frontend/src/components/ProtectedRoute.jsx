import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, backendReady } = useAuth();
  const location = useLocation();

  if (loading || backendReady === null) {
    const isStarting = backendReady === false;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full" />
        {isStarting && (
          <div className="mt-6 flex flex-col gap-3 w-64">
            <a
              href="https://dih-answers-backend.onrender.com/health"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all text-center text-sm"
            >
              Wake Up Backend ↗
            </a>
            <a
              href="https://mailpit-o5ht.onrender.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-all text-center text-sm"
            >
              Wake Up Mailpit ↗
            </a>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all border border-white/20 text-sm"
            >
              Retry Connection
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
