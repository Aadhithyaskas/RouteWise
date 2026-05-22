// context/AuthContext.js
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const STORAGE_KEY = "routewise_user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on refresh
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);

        // Normalize structure
        setUser({
          id: parsed.user_id || parsed.id,
          role: parsed.role
        });
      }
    } catch (err) {
      console.error("Auth restore failed:", err);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (data) => {
    const userData = {
      id: data.user_id,
      role: data.role
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
