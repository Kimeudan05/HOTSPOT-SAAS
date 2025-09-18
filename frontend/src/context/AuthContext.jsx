import { createContext, useContext, useEffect, useState } from "react";

// Create context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null); // User object to store user data (including is_admin)

  // Function to decode JWT token
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT (base64)
      return payload; // Assuming user data is in the token
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Initialize user state
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser); // Set the user data from decoded token
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }

    // Sync the token change across windows/tabs
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedUser = decodeToken(token);
        if (decodedUser) {
          setUser(decodedUser);
          setIsLoggedIn(true);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  // Handle login
  const login = (token) => {
    localStorage.setItem("token", token); // Store token in localStorage
    const decodedUser = decodeToken(token); // Decode token to get user info
    if (decodedUser) {
      setUser(decodedUser); // Store user info
    }
    setIsLoggedIn(true);
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null); // Clear user data
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
