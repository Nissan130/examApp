import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Dummy user object (later you’ll save it in backend DB)
    const user = { name, email };
    onRegister(user);

    // After register → always go to /exams (default dashboard for examinee)
    navigate("/exams");
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
            Create your account to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="w-full space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">Email</label>
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
            <label className="block mb-1 font-medium text-gray-700 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors"
          >
            Register
          </button>

          {/* Divider */}
          <div className="text-center text-gray-400 my-3 text-sm">OR</div>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
