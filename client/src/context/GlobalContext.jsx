// context/GlobalContext.jsx
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

// Create context
export const GlobalContext = createContext();

// Provider component
export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null); // store full user object
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage/sessionStorage on app init
 useEffect(() => {
  const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

  if (storedToken) setToken(storedToken);
  if (storedUser) setUser(JSON.parse(storedUser)); // Parse JSON!
  setLoading(false); // finished checking storage
}, []);


  // Save token & user whenever they change
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
      sessionStorage.removeItem("user");
    }
  }, [token, user]);

  // Login function
  const login = async (email, password, rememberMe) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Invalid email or password");
        return false;
      }

      const userWithRole = { ...data.user, role: "examinee" };

      setUser(userWithRole);
      setToken(data.token);

      // Save token to localStorage or sessionStorage based on rememberMe
      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userWithRole));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(userWithRole));
      }

      toast.success("✅ Successfully logged in!", { position: "top-right", autoClose: 2000 });
      return true;
    } catch (err) {
      console.error("Error connecting to backend:", err);
      toast.error("Cannot connect to server. Try again later.");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        login,
        logout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
