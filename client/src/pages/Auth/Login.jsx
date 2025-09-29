import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "../../context/GlobalContext";
import { BookOpen, Check, CheckCircle } from "lucide-react";

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
    <div className="min-h-screen flex">
      {/* Left Side - Brand/Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden mt-15">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 w-full">
          <div className="mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome to
              <span className="block bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                ExamPro
              </span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Professional examination platform trusted by educators and institutions worldwide.
            </p>
          </div>
          
          {/* Feature List */}
          <div className="space-y-4 mt-8">
            <div className="flex items-center text-slate-300">
              <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center mr-3">
                <Check className="text-teal-400" size={14} />
              </div>
              <span>Secure & encrypted exams</span>
            </div>
            <div className="flex items-center text-slate-300">
              <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center mr-3">
                <Check className="text-teal-400" size={14} />
              </div>
              <span>Real-time progress tracking</span>
            </div>
            <div className="flex items-center text-slate-300">
              <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center mr-3">
                <Check className="text-teal-400" size={14} />
              </div>
              <span>Professional analytics</span>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold text-slate-900">ExamPro</span>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
              <p className="text-slate-600 mt-2">Sign in to your account</p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl text-teal-700 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {successMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white placeholder-slate-400"
                  placeholder="Enter your email"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white placeholder-slate-400"
                  placeholder="Enter your password"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  disabled={isSubmitting}
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-700">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex justify-center items-center cursor-pointer transform hover:-translate-y-0.5 disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in to account"
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-center text-slate-600 text-sm">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}