import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "../../context/GlobalContext";
import { BookOpen, Shield, Users, BarChart3 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Get register function from context
  const { register } = useContext(GlobalContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await register(name, email, password);
    
    if (success) {
      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            prefillEmail: email,
            message: "Registration successful! Please log in."
          } 
        });
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
            Join
            <span className="block bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              ExamPro Today
            </span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            Start creating and taking professional exams with our secure platform designed for educators and learners.
          </p>
        </div>
        
        {/* Feature List */}
        <div className="space-y-4 mt-8">
          <div className="flex items-center text-slate-300">
            <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center mr-3">
              <Shield className="text-teal-400" size={14} />
            </div>
            <span>Secure account protection</span>
          </div>
          <div className="flex items-center text-slate-300">
            <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center mr-3">
              <Users className="text-teal-400" size={14} />
            </div>
            <span>Dual role support</span>
          </div>
          <div className="flex items-center text-slate-300">
            <div className="w-6 h-6 bg-teal-500/20 rounded-full flex items-center justify-center mr-3">
              <BarChart3 className="text-teal-400" size={14} />
            </div>
            <span>Advanced analytics</span>
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

    {/* Right Side - Register Form */}
    <div className="flex-1 flex items-center justify-center px-6 py-8 bg-white pt-20 lg:pt-10">
      <div className="w-full max-w-md">
        
        {/* Form Container */}
        <div className="bg-white rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
            <p className="text-slate-600 mt-2">Get started with your free account</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white placeholder-slate-400"
                placeholder="Enter your full name"
                required
                disabled={isSubmitting}
              />
            </div>

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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-white placeholder-slate-400"
                placeholder="Create a strong password"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-slate-500 mt-2">
                Use 8+ characters with a mix of letters, numbers & symbols
              </p>
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
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-slate-600 text-sm">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Terms Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <ToastContainer />
  </div>
);
}