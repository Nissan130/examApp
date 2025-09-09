import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-yellow-100 to-orange-200 shadow-md p-4 sm:px-6 z-50">
      <div className="flex justify-between items-center">
        {/* App Name / Logo */}
        <Link
          to={user?.role === "examiner" ? "/examiner/dashboard" : "/exams"}
          className="text-2xl sm:text-3xl font-extrabold text-orange-600 hover:text-orange-700"
        >
          Exam App
        </Link>

        {/* Hamburger button for mobile */}
        <button
          className="sm:hidden text-orange-600 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Links for larger screens */}
        <div className="hidden sm:flex sm:items-center sm:space-x-4">
          {user ? (
            <>
              <p className="text-gray-700 sm:text-gray-800 text-sm sm:text-base">
                Welcome, {user.email}
              </p>
              <button
                onClick={onLogout}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden mt-4 flex flex-col space-y-2">
          {user ? (
            <>
              <p className="text-gray-700 text-sm">Welcome, {user.email}</p>
              <button
                onClick={onLogout}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
