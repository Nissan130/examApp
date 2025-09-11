import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { GlobalContext } from "../context/GlobalContext";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();

  // Get user & logout from global context
  const { user, setUser, logout } = useContext(GlobalContext);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = () => {
    logout(); // clears token & user
    navigate("/login"); // redirect AFTER clearing
  };

  // Switch role between examinee <-> examiner
  const handleRoleSwitch = (role) => {
    setUser({ ...user, role });
    if (role === "examiner") {
      navigate("/examiner/dashboard");
    } else {
      navigate("/examinee/dashboard");
    }
  };

  // Navigate when title clicked
  const handleTitleClick = () => {
    if (!user) {
      navigate("/"); // landing page
    } else if (user.role === "examiner") {
      navigate("/examiner/dashboard");
    } else {
      navigate("/examinee/dashboard");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-yellow-100 to-orange-200 shadow-md p-4 sm:px-6 z-50">
      <div className="flex justify-between items-center">
        {/* App Title */}
        <button
          onClick={handleTitleClick}
          className="text-2xl sm:text-3xl font-extrabold text-orange-600 hover:text-orange-700 cursor-pointer"
        >
          Exam App
        </button>

        {/* Links / Profile */}
        <div className="flex items-center space-x-4">
          {!user && (
            <>
              <Link
                to="/login"
                className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base"
              >
                Register
              </Link>
            </>
          )}
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition"
              >
                <User size={20} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-2">
                  <p className="px-4 py-2 text-sm text-gray-700">
                    Hello, {user?.email ? user.email.split("@")[0] : "User"}
                  </p>
                  <hr />
                  <button
                    onClick={() => handleRoleSwitch("examinee")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                      user.role === "examinee"
                        ? "font-bold text-orange-500"
                        : "text-gray-700"
                    }`}
                  >
                    Examinee Role
                  </button>
                  <button
                    onClick={() => handleRoleSwitch("examiner")}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition ${
                      user.role === "examiner"
                        ? "font-bold text-orange-500"
                        : "text-gray-700"
                    }`}
                  >
                    Examiner Role
                  </button>
                  <hr />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
