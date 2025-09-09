import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, UserCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-orange-100">
      
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center bg-gradient-to-r from-yellow-100 to-orange-200 shadow-md fixed top-0 z-50">
        <h1 className="text-2xl font-bold text-orange-600">Exam App</h1>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-700 hover:text-orange-600 font-medium transition">Login</Link>
          <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition">Register</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto pt-28 px-6 md:px-12">
        
        {/* Text */}
        <div className="md:w-1/2 mt-10 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-6">
            Welcome to Exam App
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            A smart platform for both Examinees and Examiners. Create exams, attempt tests, and track results—all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition">
              Get Started
            </Link>
            <Link to="/exams" className="bg-white border border-orange-500 text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-orange-50 transition">
              Explore Exams
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2 flex justify-center">
          <img 
            src="https://img.freepik.com/free-vector/online-exam-concept-illustration_114360-1285.jpg?w=740&t=st=1694265188~exp=1694265788~hmac=1dbeb8f11d70ed8d83322f39ab282e81d5c0b1502d4a80f1a92aa3e4be037b70" 
            alt="Online Exam" 
            className="w-full max-w-md rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 px-6 md:px-12 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <BookOpen size={40} className="mx-auto text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Create Exams</h3>
            <p className="text-gray-600 text-sm">
              Examiners can easily create and manage exams with questions and time limits.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <CheckCircle size={40} className="mx-auto text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Attempt Tests</h3>
            <p className="text-gray-600 text-sm">
              Examinees can attempt exams online with a smooth, user-friendly interface.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
            <UserCheck size={40} className="mx-auto text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Track Results</h3>
            <p className="text-gray-600 text-sm">
              Both examinees and examiners can track scores and exam statistics easily.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-20 bg-orange-50 py-16 px-6 text-center rounded-2xl mx-6 md:mx-12">
        <h2 className="text-3xl font-bold text-orange-600 mb-4">Ready to get started?</h2>
        <p className="text-gray-700 mb-6">
          Join thousands of users improving their exam experience with Exam App.
        </p>
        <Link to="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition">
          Sign Up Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-20 py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Exam App. All rights reserved.
      </footer>
    </div>
  );
}
