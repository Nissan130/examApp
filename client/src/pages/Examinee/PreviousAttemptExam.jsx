import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Eye, BarChart, Clock, Loader, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

// Score indicator component with circular progress
const ScoreIndicator = ({ score, total }) => {
  const percentage = (score / total) * 100;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  let strokeColor = "";
  
  if (percentage >= 80) strokeColor = "stroke-green-500";
  else if (percentage >= 60) strokeColor = "stroke-blue-500";
  else if (percentage >= 40) strokeColor = "stroke-yellow-500";
  else strokeColor = "stroke-red-500";
  
  return (
    <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-gray-200 stroke-current"
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
        <span className="text-sm font-bold text-gray-800 sm:text-lg">{score}</span>
        <span className="text-[10px] text-gray-500 sm:text-xs">of {total}</span>
      </div>
    </div>
  );
};

// Function to generate different card background colors based on index
const getCardBgColor = (index) => {
  const colors = [
    "bg-gradient-to-br from-blue-50 to-cyan-50",
    "bg-gradient-to-br from-purple-50 to-pink-50",
    "bg-gradient-to-br from-green-50 to-emerald-50",
    "bg-gradient-to-br from-orange-50 to-amber-50",
    "bg-gradient-to-br from-indigo-50 to-blue-50",
    "bg-gradient-to-br from-pink-50 to-rose-50",
    "bg-gradient-to-br from-teal-50 to-cyan-50",
    "bg-gradient-to-br from-yellow-50 to-orange-50"
  ];
  return colors[index % colors.length];
};

// Function to generate different header colors based on index
const getHeaderBgColor = (index) => {
  const colors = [
    "bg-gradient-to-r from-blue-100 to-blue-200",
    "bg-gradient-to-r from-purple-100 to-purple-200",
    "bg-gradient-to-r from-green-100 to-green-200",
    "bg-gradient-to-r from-orange-100 to-orange-200",
    "bg-gradient-to-r from-indigo-100 to-indigo-200",
    "bg-gradient-to-r from-pink-100 to-pink-200",
    "bg-gradient-to-r from-teal-100 to-teal-200",
    "bg-gradient-to-r from-amber-100 to-amber-200"
  ];
  return colors[index % colors.length];
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-3 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto sm:mt-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 sm:text-3xl ">
            Exam <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">History</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Review your performance and track progress
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg mb-4 max-w-3xl mx-auto sm:p-4 sm:mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {exams.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 text-center max-w-2xl mx-auto sm:p-8">
            <div className="text-gray-300 mb-4">
              <BookOpen className="w-12 h-12 mx-auto sm:w-16 sm:h-16" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 sm:text-xl">No exams attempted yet</h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              You haven't completed any exams yet.
            </p>
            <Link
              to="/examinee/dashboard"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm sm:px-5 sm:py-2.5 sm:text-base"
            >
              Start Your First Exam
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {exams.map((exam, index) => (
                <div
                  key={exam.attempt_exam_id}
                  className={`${getCardBgColor(index)} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden `}
                >
                  {/* Card Header */}
                  <div className={`p-3 border-b border-gray-200 ${getHeaderBgColor(index)} sm:p-4`}>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 sm:text-base">
                      {exam.exam_name}
                    </h3>
                    <p className="text-xs text-gray-600 sm:text-xs">
                      {exam.subject} • {exam.chapter}
                    </p>
                  </div>

                  {/* Score Display */}
                  <div className="p-3 flex flex-col items-center justify-center sm:p-4">
                    <div className="text-xs text-gray-500 font-medium mb-2">SCORE</div>
                    <ScoreIndicator score={exam.score} total={exam.total_questions} />
                  </div>

                  {/* Stats */}
                  <div className="px-3 pb-2 grid grid-cols-2 gap-2 sm:px-4 sm:pb-3">
                    <div className="text-center bg-white bg-opacity-70 rounded-lg p-1.5 backdrop-blur-sm sm:p-2">
                      <div className="text-xs font-bold text-gray-800 sm:text-sm">{exam.total_questions}</div>
                      <div className="text-[10px] text-gray-600 sm:text-xs">Questions</div>
                    </div>
                    <div className="text-center bg-white bg-opacity-70 rounded-lg p-1.5 backdrop-blur-sm sm:p-2">
                      <div className="text-xs font-bold text-gray-800 sm:text-sm">
                        {formatTimeTaken(exam.time_taken_seconds)}
                      </div>
                      <div className="text-[10px] text-gray-600 sm:text-xs">Time</div>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="px-3 pb-2 sm:px-4 sm:pb-3">
                    <div className="flex items-center text-[10px] text-gray-600 sm:text-xs">
                      <Clock size={10} className="mr-1 text-gray-500 sm:size-3" />
                      {formatDate(exam.created_at)}
                    </div>
                  </div>

                  {/* Action Buttons - Fixed tooltip isolation */}
                  <div className="p-2 border-t border-gray-200 bg-white bg-opacity-50 flex justify-between backdrop-blur-sm sm:p-3">
                    <div className="flex-1 mr-1 relative group sm:mr-2">
                      <Link
                        to={`/examinee/previous-attempt-exam/${exam.attempt_exam_id}`}
                        className="flex items-center justify-center w-full px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-[10px] shadow-sm sm:px-3 sm:py-1.5 sm:text-xs"
                      >
                        <Eye size={12} className="mr-0.5 sm:mr-1 sm:size-4" />
                        Details
                      </Link>
                      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] px-1.5 py-1 rounded whitespace-nowrap transition-opacity duration-200 z-50 shadow-lg font-medium sm:mb-2 sm:px-2 sm:py-1 sm:text-xs">
                        View detailed results
                      </span>
                    </div>
                    
                    <div className="flex-1 ml-1 relative group sm:ml-2">
                      <Link
                        to={`/examinee/attempt-exam-result/leaderboard/${exam.exam_id}`}
                        className="flex items-center justify-center w-full px-2 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-[10px] shadow-sm sm:px-3 sm:py-1.5 sm:text-xs"
                      >
                        <BarChart size={12} className="mr-0.5 sm:mr-1 sm:size-4" />
                        Rank
                      </Link>
                      <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-[10px] px-1.5 py-1 rounded whitespace-nowrap transition-opacity duration-200 z-50 shadow-lg font-medium sm:mb-2 sm:px-2 sm:py-1 sm:text-xs">
                        Compare with others
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <nav className="flex items-center space-x-1 bg-white rounded-lg shadow-sm p-1.5 border border-gray-200 sm:space-x-2 sm:p-2">
                  <button
                    onClick={() => fetchMyExams(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                    className="flex items-center justify-center px-2 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-gray-700 text-xs sm:px-3 sm:py-1.5 sm:text-sm"
                  >
                    <ChevronLeft size={14} className="mr-0.5 sm:mr-1 sm:size-4" />
                    <span className="hidden xs:inline">Prev</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchMyExams(pageNum)}
                          className={`px-2 py-1 rounded-md border transition-colors text-xs font-medium sm:px-3 sm:py-1.5 sm:text-sm ${
                            pagination.page === pageNum
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {pagination.total_pages > 5 && (
                      <span className="px-1 py-1 text-gray-500 text-xs sm:px-2 sm:py-1.5">...</span>
                    )}
                  </div>

                  <button
                    onClick={() => fetchMyExams(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="flex items-center justify-center px-2 py-1 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-gray-700 text-xs sm:px-3 sm:py-1.5 sm:text-sm"
                  >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight size={14} className="ml-0.5 sm:ml-1 sm:size-4" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}