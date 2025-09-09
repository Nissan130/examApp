import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy login logic
    // Replace this with API call later
    let role = "examinee"; // default role
    if (email.endsWith("@examiner.com")) role = "examiner";

    const user = { email, rememberMe, role };
    onLogin(user);

    // Redirect based on role
    if (role === "examiner") {
      navigate("/examiner/dashboard");
    } else {
      navigate("/examinee/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-100 to-orange-200 px-4 py-8">
      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 flex flex-col items-center mt-12">
        {/* App Name */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-600">
            Exam App
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Login to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
          </div>

          {/* Remember Me + Forgot Password */}
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
            <Link
              to="/forgot-password"
              className="text-orange-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors cursor-pointer mt-2"
          >
            Login
          </button>

          {/* Divider */}
          <div className="text-center text-gray-400 text-sm my-2">OR</div>

          {/* Register Link */}
          <p className="text-center text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-orange-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
