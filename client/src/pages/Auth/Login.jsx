import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "../../context/GlobalContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get login function from context
  const { login } = useContext(GlobalContext);

  // Check for prefilled email and success message from registration
  useEffect(() => {
    if (location.state?.prefillEmail) {
      setEmail(location.state.prefillEmail);
    }
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to avoid showing the message again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await login(email, password, rememberMe);
    
    if (success) {
      // Navigate to dashboard after successful login
      setTimeout(() => {
        navigate("/examinee/dashboard");
      }, 1500);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-100 to-orange-200 px-4 py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center mt-12">
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-600">
            Exam App
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Login to your account
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm w-full">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <Link to="/forgot-password" className="text-sm text-orange-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 text-white font-bold rounded-xl transition-colors flex justify-center items-center cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="text-center text-gray-400 my-3 text-sm">OR</div>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
}