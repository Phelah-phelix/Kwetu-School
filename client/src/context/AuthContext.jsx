import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("kwetu_token");
    const storedUser = localStorage.getItem("kwetu_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function signIn(data) {
    localStorage.setItem("kwetu_token", data.token);
    localStorage.setItem("kwetu_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function signOut() {
    localStorage.removeItem("kwetu_token");
    localStorage.removeItem("kwetu_user");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
