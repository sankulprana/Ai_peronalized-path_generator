import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("pathai_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("pathai_token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("pathai_token", token);
      api.auth
        .getProfile()
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            localStorage.setItem("pathai_user", JSON.stringify(res.user));
          }
        })
        .catch((err) => {
          console.warn("Session expired or offline fallback active:", err.message);
        });
    } else {
      localStorage.removeItem("pathai_token");
      localStorage.removeItem("pathai_user");
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      if (res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem("pathai_token", res.token);
        localStorage.setItem("pathai_user", JSON.stringify(res.user));
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, targetGoal) => {
    setLoading(true);
    try {
      const res = await api.auth.register({ name, email, password, targetGoal });
      if (res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem("pathai_token", res.token);
        localStorage.setItem("pathai_user", JSON.stringify(res.user));
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const nextUser = { ...(prev || {}), ...updatedFields };
      localStorage.setItem("pathai_user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("pathai_token");
    localStorage.removeItem("pathai_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
