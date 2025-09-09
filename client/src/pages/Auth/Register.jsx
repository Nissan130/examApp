import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, UserCheck } from "lucide-react"; // optional icons for roles

export default function Register({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("examinee");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const user = { name, email, role };
    onRegister(user);
    navigate(role === "examiner" ? "/examiner/dashboard" : "/exams");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-100 to-orange-200 px-4 py-8">

      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-gradient-to-r from-yellow-100 to-orange-200 shadow-md fixed top-0 z-50">
        <h1 className="text-2xl font-bold text-orange-600">Exam App</h1>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-700 hover:text-orange-600 font-medium transition">Login</Link>
          <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition">Register</Link>
        </div>
      </nav>

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

          {/* Role Selector - Smaller Cards */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-sm">Select Role</label>
            <div className="grid grid-cols-2 gap-3">
              {/* Examinee Card */}
              <div
                onClick={() => setRole("examinee")}
                className={`cursor-pointer p-3 rounded-lg border transition shadow flex flex-col items-center justify-center text-sm
                  ${role === "examinee" ? "bg-orange-100 border-orange-400" : "bg-white border-gray-300 hover:bg-orange-50"}
                `}
              >
                <User size={20} className="text-orange-500 mb-1" />
                <span className="font-medium text-gray-800">Examinee</span>
              </div>

              {/* Examiner Card */}
              <div
                onClick={() => setRole("examiner")}
                className={`cursor-pointer p-3 rounded-lg border transition shadow flex flex-col items-center justify-center text-sm
                  ${role === "examiner" ? "bg-orange-100 border-orange-400" : "bg-white border-gray-300 hover:bg-orange-50"}
                `}
              >
                <UserCheck size={20} className="text-orange-500 mb-1" />
                <span className="font-medium text-gray-800">Examiner</span>
              </div>
            </div>
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
