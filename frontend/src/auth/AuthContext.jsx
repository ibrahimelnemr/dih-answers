import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { ensureCsrfToken, login as loginRequest, logout as logoutRequest, me, register as registerRequest } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function bootstrap() {
      try {
        await ensureCsrfToken();
        const currentUser = await me();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
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
    }),
    [error, loading, user]
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
