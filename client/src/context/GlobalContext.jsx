// context/GlobalContext.jsx
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useCustomAlert } from "./CustomAlertContext";
import {API_BASE_URL} from '../utils/api'

// Create context
export const GlobalContext = createContext();

// Provider component
export const GlobalProvider = ({ children }) => {
  const custom_alert = useCustomAlert();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentRole, setCurrentRole] = useState("examinee");
  const [loading, setLoading] = useState(true);

  // Load from storage on app init
  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    const storedRole = localStorage.getItem("currentRole") || sessionStorage.getItem("currentRole");

    if (storedToken) setToken(storedToken);
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedRole) setCurrentRole(storedRole);
    
    // Add a small delay to ensure all state is set before hiding loader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      sessionStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("currentRole");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("currentRole");
    }
    
    if (currentRole && user) {
      localStorage.setItem("currentRole", currentRole);
      sessionStorage.setItem("currentRole", currentRole);
    }
  }, [token, user, currentRole]);

  // Change role function
  const changeRole = (newRole) => {
    setCurrentRole(newRole);
    custom_alert.success(`Role changed to ${newRole}`);
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        custom_alert.error(data.error || "Failed to register user");
        return false;
      }

      custom_alert.success("Registration successful! Please log in.");
      return true;
    } catch (err) {
      console.error("Error connecting to backend:", err);
      custom_alert.error("Cannot connect to server. Try again later.");
      return false;
    }
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
     const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        custom_alert.error(data.error || "Invalid email or password");
        return false;
      }

      const userWithRole = { ...data.user, role: "examinee" };

      setUser(userWithRole);
      setToken(data.token);
      setCurrentRole("examinee"); // Reset to default role on login

      // Save token to localStorage or sessionStorage based on rememberMe
      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userWithRole));
        localStorage.setItem("currentRole", "examinee");
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(userWithRole));
        sessionStorage.setItem("currentRole", "examinee");
      }

      custom_alert.success("Successfully logged in!");
      return true;
    } catch (err) {
      console.error("Error connecting to backend:", err);
      custom_alert.error("Cannot connect to server. Try again later.");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setCurrentRole("examinee"); // Reset to default role on logout
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentRole");
    
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("currentRole");
    
    custom_alert.info("Logged out successfully");
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        currentRole,
        setCurrentRole,
        changeRole,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};