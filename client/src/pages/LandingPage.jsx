import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, UserCheck, Shield, Clock, Award, ArrowRight, Play, BarChart3, Users } from "lucide-react";

export default function LandingPage() {
  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

    {/* Hero Section */}
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-teal-50 border border-teal-200 rounded-full text-teal-700 text-sm font-medium mb-6">
                <Shield className="w-4 h-4 mr-2" />
                Trusted by 10+ examiners & examinees
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                Modern
                <span className="block bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Exam Platform
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mt-6 max-w-2xl">
                Revolutionize your assessment process with our AI-powered platform. 
                Create secure exams, deliver seamless testing experiences, and gain actionable insights.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="bg-white border-2 border-slate-300 hover:border-teal-500 text-slate-700 hover:text-teal-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center justify-center"
              >
                View Demo
                <Play className="ml-2 w-5 h-5" />
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">50K+</div>
                <div className="text-sm text-slate-600">Exams Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">98%</div>
                <div className="text-sm text-slate-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">24/7</div>
                <div className="text-sm text-slate-600">Support</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 border border-slate-200">
              <img
                src="/public/images/hero_image.webp"
                alt="Modern Exam Platform Dashboard"
                className="w-full rounded-2xl"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-slate-200 z-20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                  <Award className="text-teal-600 w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Top Rated</div>
                  <div className="text-sm text-slate-500">By educators</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-teal-600 to-cyan-700 rounded-2xl shadow-xl p-4 text-white z-20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold">Real-time</div>
                  <div className="text-sm text-teal-100">Results & Analytics</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything You Need for
            <span className="block bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Modern Assessments
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive tools for exam creation, delivery, and analysis in one integrated platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: "Smart Exam Builder",
              description: "Create professional exams with AI-assisted question generation and advanced security features.",
              color: "teal"
            },
            {
              icon: CheckCircle,
              title: "Seamless Testing",
              description: "Deliver smooth exam experiences with auto-save, real-time monitoring, and instant results.",
              color: "cyan"
            },
            {
              icon: UserCheck,
              title: "Advanced Analytics",
              description: "Gain deep insights with comprehensive performance analytics and detailed reporting.",
              color: "teal"
            },
            {
              icon: Shield,
              title: "Enterprise Security",
              description: "Bank-level security with encryption, anti-cheating measures, and secure browser lockdown.",
              color: "cyan"
            },
            {
              icon: BarChart3,
              title: "Performance Tracking",
              description: "Monitor progress with detailed analytics and personalized improvement recommendations.",
              color: "teal"
            },
            {
              icon: Users,
              title: "Collaborative Tools",
              description: "Work together with team members, share question banks, and manage multiple examiners.",
              color: "cyan"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="group bg-slate-50 hover:bg-white rounded-3xl p-8 transition-all duration-300 border border-slate-200 hover:border-teal-300 hover:shadow-2xl"
            >
              <div className={`w-16 h-16 bg-${feature.color}-100 group-hover:bg-${feature.color}-200 rounded-2xl flex items-center justify-center mb-6 transition-colors`}>
                <feature.icon className={`text-${feature.color}-600 w-8 h-8`} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Assessment Process?
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Join thousands of educators and institutions using ExamPro to create better assessment experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 inline-flex items-center justify-center"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            to="/contact"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur-sm"
          >
            Schedule Demo
          </Link>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white" size={18} />
            </div>
            <span className="text-xl font-bold text-white">ExamPro</span>
          </div>
          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} ExamPro. All rights reserved.</p>
            <p className="mt-2 text-slate-500">Professional Assessment Platform</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
);
}