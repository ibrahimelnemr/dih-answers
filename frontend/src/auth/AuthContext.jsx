import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { ensureCsrfToken, login as loginRequest, logout as logoutRequest, me, register as registerRequest } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [backendReady, setBackendReady] = useState(null); // null = checking, false = down, true = up

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        await ensureCsrfToken();
        // CSRF succeeded → backend is up
        if (!cancelled) setBackendReady(true);
        try {
          const currentUser = await me();
          if (!cancelled) setUser(currentUser);
        } catch {
          // 403 = not logged in, that's expected
          if (!cancelled) setUser(null);
        }
      } catch {
        // Network error or backend truly down
        if (!cancelled) {
          setBackendReady(false);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();

    return () => { cancelled = true; };
  }, []);

  async function signIn(credentials) {
    setError("");
    await ensureCsrfToken();
    const currentUser = await loginRequest(credentials);
    setUser(currentUser);
  }

  async function signUp(credentials) {
    setError("");
    await ensureCsrfToken();
    const currentUser = await registerRequest(credentials);
    setUser(currentUser);
  }

  async function signOut() {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      setError,
      signIn,
      signUp,
      signOut,
      isAuthenticated: Boolean(user),
      backendReady,
    }),
    [backendReady, error, loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
