import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Eye, BarChart, Clock, Loader, BookOpen, ChevronLeft, ChevronRight, TrendingUp, Target, Calendar, Hash } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

// Enhanced Score indicator with modern design
const ScoreIndicator = ({ score, total }) => {
  const percentage = (score / total) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  let strokeColor = "";
  let bgColor = "";
  
  if (percentage >= 80) {
    strokeColor = "stroke-teal-500";
    bgColor = "from-teal-50 to-emerald-50";
  } else if (percentage >= 60) {
    strokeColor = "stroke-cyan-500";
    bgColor = "from-cyan-50 to-blue-50";
  } else if (percentage >= 40) {
    strokeColor = "stroke-amber-500";
    bgColor = "from-amber-50 to-orange-50";
  } else {
    strokeColor = "stroke-rose-500";
    bgColor = "from-rose-50 to-pink-50";
  }
  
  return (
    <div className={`relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br ${bgColor} rounded-2xl border border-slate-200 p-2`}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="stroke-slate-200"
          strokeWidth="8"
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
        />
        <circle
          className={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-slate-900 sm:text-xl">{score}</span>
        <span className="text-xs text-slate-600 sm:text-sm">/{total}</span>

      </div>
    </div>
  );
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

const formatTimeTaken = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };


// Modern card with glass morphism effect
const ExamCard = ({ exam, index }) => (
  <div
    className="group relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200/60 hover:border-teal-300/80 overflow-hidden"
    style={{
      animationDelay: `${index * 100}ms`,
      animation: 'fadeInUp 0.6s ease-out forwards'
    }}
  >
    {/* Background gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Card Content */}
    <div className="relative z-10">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 p-5 border-b border-slate-200/60">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
              {exam.exam_name} - {exam.class_name}
            </h3>
            <div className="flex items-center text-slate-600 text-sm">
              <BookOpen size={14} className="mr-1" />
              <span>{exam.chapter} - {exam.subject}</span>
            </div>
          </div>
          <div className="flex-shrink-0 ml-3">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              #{index + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Score Display */}
          <div className="col-span-2 flex justify-center">
            <ScoreIndicator score={exam.score} total={exam.total_questions} />
          </div>

          {/* Stats Grid */}
          <div className="space-y-3">
            <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
              <div className="flex items-center text-slate-600 mb-1">
                <Hash size={14} className="mr-2" />
                <span className="text-xs font-medium">Total Questions</span>
              </div>
              <div className="text-lg font-bold text-slate-900">{exam.total_questions}</div>
            </div>
            
            <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
              <div className="flex items-center text-slate-600 mb-1">
                <Target size={14} className="mr-2" />
                <span className="text-xs font-medium">Marks Percentage</span>
              </div>
              <div className="text-lg font-bold text-slate-900">
                {((exam.score / exam.total_questions) * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
              <div className="flex items-center text-slate-600 mb-1">
                <Clock size={14} className="mr-2" />
                <span className="text-xs font-medium">Time Taken</span>
              </div>
              <div className="text-lg font-bold text-slate-900">
                {formatTimeTaken(exam.time_taken_seconds)}
              </div>
            </div>
            
            <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/60">
              <div className="flex items-center text-slate-600 mb-1">
                <Calendar size={14} className="mr-2" />
                <span className="text-xs font-medium">Exam Date</span>
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatDate(exam.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            to={`/examinee/previous-attempt-exam/${exam.attempt_exam_id}`}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300 group/btn shadow-md"
          >
            <Eye size={16} className="mr-2 group-hover/btn:scale-110 transition-transform" />
            <span className="font-semibold">Details</span>
          </Link>
          
          <Link
            to={`/examinee/attempt-exam-result/leaderboard/${exam.exam_id}`}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-white text-slate-700 border border-slate-300 rounded-xl hover:scale-105 hover:shadow-lg hover:border-teal-300 transition-all duration-300 group/btn shadow-sm"
          >
            <TrendingUp size={16} className="mr-2 group-hover/btn:scale-110 transition-transform" />
            <span className="font-semibold">Rank</span>
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Stats Overview Component
const StatsOverview = ({ exams }) => {
  const totalExams = exams.length;
  const totalQuestions = exams.reduce((sum, exam) => sum + exam.total_questions, 0);
  const totalScore = exams.reduce((sum, exam) => sum + exam.score, 0);
  const avgScore = totalExams > 0 ? (totalScore / totalQuestions * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-5 border border-teal-200/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 font-medium">Total Exams</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalExams}</p>
          </div>
          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
            <BookOpen size={20} className="text-white" />
          </div>
        </div>
      </div>

  
    </div>
  );
};

export default function PreviousAttemptExam() {
  const { user, token } = useContext(GlobalContext);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 12,
    total_pages: 1,
    total_exams: 0,
    has_next: false,
    has_prev: false
  });

  useEffect(() => {
    fetchMyExams();
  }, []);

  const fetchMyExams = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/examinee/previous-attempt-exam?page=${page}&per_page=${pagination.per_page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setExams(response.data.exams);
        setPagination(response.data.pagination);
      } else {
        setError("Failed to fetch exams");
      }
    } catch (err) {
      console.error("Error fetching exams:", err);
      setError(err.response?.data?.message || "Failed to fetch exams");
      } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeTaken = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-15 w-15 text-teal-600 mx-auto mb-4">
            <Loader className="absolute inset-0 m-auto text-teal-600" size={28} />
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading your exam history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl shadow-2xl mb-6">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-4xl font-bold text-slate-900 mb-4">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Exam History
            </span>
          </h1>
          <p className=" text-slate-600 max-w-xl mx-auto leading-relaxed">
            Track your learning journey and monitor performance trends
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 max-w-3xl mx-auto shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {exams.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center max-w-2xl mx-auto border border-slate-200/60">
            <div className="w-24 h-24 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No exams attempted yet</h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Start your learning journey by taking your first exam
            </p>
            <Link
              to="/examinee/dashboard"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-700 text-white font-bold rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-lg text-lg"
            >
              Start Your First Exam
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <StatsOverview exams={exams} />

            {/* Modern Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {exams.map((exam, index) => (
                <ExamCard key={exam.attempt_exam_id} exam={exam} index={index} />
              ))}
            </div>

            {/* Enhanced Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-slate-200/60">
                  <button
                    onClick={() => fetchMyExams(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                    className="flex items-center justify-center px-4 py-3 rounded-xl border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:scale-105 transition-all duration-300 text-slate-700 font-medium"
                  >
                    <ChevronLeft size={18} className="mr-2" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchMyExams(pageNum)}
                          className={`px-4 py-3 rounded-xl border transition-all duration-300 font-medium min-w-[3rem] ${
                            pagination.page === pageNum
                              ? "bg-gradient-to-r from-teal-600 to-cyan-700 text-white border-teal-600 shadow-lg scale-105"
                              : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:scale-105"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => fetchMyExams(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="flex items-center justify-center px-4 py-3 rounded-xl border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 hover:scale-105 transition-all duration-300 text-slate-700 font-medium"
                  >
                    <span>Next</span>
                    <ChevronRight size={18} className="ml-2" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}