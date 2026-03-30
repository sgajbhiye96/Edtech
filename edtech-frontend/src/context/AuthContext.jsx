import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const username = localStorage.getItem("username");

    const token = localStorage.getItem("token");

    if (username && token) setUser(username);

  }, []);

  const login = (username, token) => {

    localStorage.setItem("username", username);

    localStorage.setItem("token", token);

    setUser(username);

  };

  const logout = () => {

    localStorage.removeItem("username");

    localStorage.removeItem("token");

    setUser(null);

  };

  return (
<AuthContext.Provider value={{ user, login, logout }}>

      {children}
</AuthContext.Provider>

  );

}
