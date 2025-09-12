import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  LogOut, 
  Settings, 
  UserCheck, 
  UserCog, 
  ChevronDown,
  Shield,
  BookOpen,
  ClipboardCheck
} from "lucide-react";
import { GlobalContext } from "../context/GlobalContext";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();

  // Get user & logout from global context
  const { user, currentRole, changeRole, logout } = useContext(GlobalContext);

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
    logout();
    navigate("/login");
    setProfileOpen(false);
  };

  // Switch role between examinee <-> examiner
  const handleRoleSwitch = (role) => {
    changeRole(role);
    navigate(`/${role}/dashboard`);
    setProfileOpen(false);
  };

  // Navigate when title clicked
  const handleTitleClick = () => {
    if (!user) {
      navigate("/");
    } else {
      navigate(`/${currentRole}/dashboard`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-yellow-100 to-orange-200 shadow-md p-4 sm:px-6 z-50">
      <div className="flex justify-between items-center">
        {/* App Title */}
        <button
          onClick={handleTitleClick}
          className="text-2xl sm:text-3xl font-extrabold text-orange-600 hover:text-orange-700 cursor-pointer transition-transform hover:scale-105"
        >
          Exam App
        </button>

        {/* Links / Profile */}
        <div className="flex items-center space-x-4">
          {!user && (
            <>
              <Link
                to="/login"
                className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg"
              >
                Register
              </Link>
            </>
          )}
          {user && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full pl-3 pr-2 py-1.5 border border-orange-200 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-white cursor-pointer"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full text-white">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name?.split(' ')[0] || user?.email?.split("@")[0] || "User"}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-3 z-50 backdrop-blur-sm bg-white-95">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full text-white">
                        <User size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Role Badge */}
                  <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 mx-3 rounded-lg mb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-blue-800">Current Mode</span>
                      <div className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold capitalize">
                        {currentRole === "examinee" ? (
                          <span className="flex items-center">
                            <BookOpen size={12} className="mr-1" /> Examinee
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <ClipboardCheck size={12} className="mr-1" /> Examiner
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Role Switching */}
                  <div className="px-3 py-2">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide px-2 mb-2">Switch Mode</p>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleRoleSwitch("examinee")}
                        className={`w-full flex items-center cursor-pointer px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                          currentRole === "examinee"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                        }`}
                      >
                        <UserCheck size={16} className="mr-3" />
                        <span>Examinee Mode</span>
                        {currentRole === "examinee" && (
                          <Shield size={14} className="ml-auto text-orange-500" />
                        )}
                      </button>
                      <button
                        onClick={() => handleRoleSwitch("examiner")}
                        className={`w-full flex items-center px-3 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200 ${
                          currentRole === "examiner"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                        }`}
                      >
                        <UserCog size={16} className="mr-3" />
                        <span>Examiner Mode</span>
                        {currentRole === "examiner" && (
                          <Shield size={14} className="ml-auto text-orange-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Settings (Optional - for future use) */}
                  <div className="px-3 py-2 border-t border-gray-100">
                    <button className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 cursor-pointer">
                      <Settings size={16} className="mr-3" />
                      <span>Settings</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="px-3 py-2 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                    >
                      <LogOut size={16} className="mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}