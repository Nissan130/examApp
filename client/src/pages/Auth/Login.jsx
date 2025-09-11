import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "../../context/GlobalContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login , user} = useContext(GlobalContext);

  useEffect(() => {
  if (user) {
    // Redirect based on role
    if (user.role === "examiner") navigate("/examiner/dashboard");
    else navigate("/examinee/dashboard");
  }
}, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password, rememberMe);

    if (success) {
      navigate("/examinee/dashboard");
    } else {
      setError("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-100 to-orange-200 px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center mt-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-600 mb-2">Exam App</h1>
        <p className="text-gray-500 text-sm sm:text-base mb-4">Login to continue</p>

        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-orange-600 hover:underline">Forgot password?</Link>
          </div>

          <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors">
            Login
          </button>

          <p className="text-center text-gray-600 text-sm mt-2">
            Don&apos;t have an account? <Link to="/register" className="text-orange-600 font-medium hover:underline">Register</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
