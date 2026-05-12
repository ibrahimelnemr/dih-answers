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
          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm mb-3">Backend is starting up...</p>
            <a
              href="https://dih-answers-backend.onrender.com/health"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-sm underline"
            >
              Check Backend Health ↗
            </a>
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
