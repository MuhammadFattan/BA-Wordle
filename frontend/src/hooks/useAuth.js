import { useCallback, useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3001";
const TOKEN_KEY = "ba_wordle_token";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  const fetchMe = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetchMe(token);
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const loginWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  const handleCallback = useCallback(
    (token) => {
      localStorage.setItem(TOKEN_KEY, token);
      fetchMe(token);
    },
    [fetchMe],
  );

  return {
    user,
    loading,
    loginWithGoogle,
    logout,
    getToken,
    handleCallback,
    isLoggedIn: !!user,
  };
}
