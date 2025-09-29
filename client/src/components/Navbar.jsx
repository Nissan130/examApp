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
  ClipboardCheck,
  Menu,
  X
} from "lucide-react";
import { GlobalContext } from "../context/GlobalContext";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    setMobileMenuOpen(false);
  };

  // Switch role between examinee <-> examiner
  const handleRoleSwitch = (role) => {
    changeRole(role);
    navigate(`/${role}/dashboard`);
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  // Navigate when title clicked
  const handleTitleClick = () => {
    if (!user) {
      navigate("/");
    } else {
      navigate(`/${currentRole}/dashboard`);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* App Title & Logo */}
          <button
            onClick={handleTitleClick}
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <BookOpen size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900">ExamPro</span>
              <span className="text-xs text-teal-600 font-medium">Professional</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-teal-600 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
             

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-3 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm hover:shadow-md transition-all duration-200 hover:border-teal-300 group cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full text-white shadow-md">
                      <User size={16} />
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-sm font-medium text-slate-900 leading-none">
                        {user?.name?.split(' ')[0] || user?.email?.split("@")[0] || "User"}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{currentRole}</p>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`text-slate-400 transition-transform duration-200 ${
                        profileOpen ? 'rotate-180' : ''
                      } group-hover:text-teal-600`} 
                    />
                  </button>
                  
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-50 backdrop-blur-sm">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full text-white shadow-md">
                            <User size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {user?.name || "User"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Current Role Status */}
                      <div className="px-4 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 mx-3 rounded-xl mb-2 border border-teal-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-teal-700">Current Mode</span>
                          <div className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold capitalize flex items-center">
                            {currentRole === "examinee" ? (
                              <>
                                <BookOpen size={12} className="mr-1" /> Examinee
                              </>
                            ) : (
                              <>
                                <ClipboardCheck size={12} className="mr-1" /> Examiner
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="px-3 py-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleRoleSwitch("examinee")}
                            className={`flex items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                              currentRole === "examinee"
                                ? "bg-teal-50 border-teal-200 text-teal-700"
                                : "border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600"
                            }`}
                          >
                            <UserCheck size={18} className="mr-2" />
                            <span className="text-sm font-medium">Examinee</span>
                          </button>
                          <button
                            onClick={() => handleRoleSwitch("examiner")}
                            className={`flex items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                              currentRole === "examiner"
                                ? "bg-teal-50 border-teal-200 text-teal-700"
                                : "border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-600"
                            }`}
                          >
                            <UserCog size={18} className="mr-2" />
                            <span className="text-sm font-medium">Examiner</span>
                          </button>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="px-1 py-2">
                        <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition-colors duration-200 cursor-pointer">
                          <Settings size={18} className="mr-3 text-slate-400" />
                          <span>Account Settings</span>
                        </button>
                        <button className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition-colors duration-200 cursor-pointer">
                          <Shield size={18} className="mr-3 text-slate-400" />
                          <span>Privacy & Security</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="px-3 py-2 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                        >
                          <LogOut size={18} className="mr-3" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-teal-600 hover:bg-slate-50 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 bg-white/95 backdrop-blur-sm">
            {!user ? (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center text-slate-700 hover:text-teal-600 font-medium py-3 rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-medium py-3 rounded-xl shadow-lg transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>

                {/* Role Switcher */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleRoleSwitch("examinee")}
                    className={`flex items-center justify-center p-3 rounded-xl border transition-all ${
                      currentRole === "examinee"
                        ? "bg-teal-50 border-teal-200 text-teal-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <UserCheck size={18} className="mr-2" />
                    <span className="text-sm font-medium">Examinee</span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch("examiner")}
                    className={`flex items-center justify-center p-3 rounded-xl border transition-all ${
                      currentRole === "examiner"
                        ? "bg-teal-50 border-teal-200 text-teal-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <UserCog size={18} className="mr-2" />
                    <span className="text-sm font-medium">Examiner</span>
                  </button>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} className="mr-2" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}