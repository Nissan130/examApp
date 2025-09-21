import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Eye, BarChart, Clock, Loader, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

// Score indicator component with circular progress
const ScoreIndicator = ({ score, total }) => {
  const percentage = (score / total) * 100;
  const radius = 42;
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
          className="text-red-200 stroke-current"
          strokeWidth="8"
          cx="52"
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
        <span className="text-base font-bold text-gray-800 sm:text-lg">{score}</span>
        <span className="text-xs text-gray-500 sm:text-sm">of {total}</span>
      </div>
    </div>
  );
};

// Use a consistent color for all cards
const getCardBgColor = () => {
  return "bg-gradient-to-br from-blue-50 to-cyan-50";
};

// Use a consistent color for all headers
const getHeaderBgColor = () => {
  return "bg-gradient-to-r from-blue-100 to-blue-200";
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
          <p className="text-gray-600 text-lg">Loading your exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto sm:mt-14">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 mt-15">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 sm:text-4xl">
            Exam <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">History</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Review your performance and track progress
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6 max-w-3xl mx-auto sm:p-5 sm:mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-base text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {exams.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-2xl mx-auto sm:p-10">
            <div className="text-gray-300 mb-6">
              <BookOpen className="w-16 h-16 mx-auto sm:w-20 sm:h-20" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 sm:text-2xl">No exams attempted yet</h3>
            <p className="text-gray-600 mb-8 text-base sm:text-lg">
              You haven't completed any exams yet.
            </p>
            <Link
              to="/examinee/dashboard"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-base sm:px-7 sm:py-3.5 sm:text-lg"
            >
              Start Your First Exam
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {exams.map((exam, index) => (
                <div
                  key={exam.attempt_exam_id}
                  className={`${getCardBgColor()} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden`}
                >
                  {/* Card Header */}
                  <div className={`p-4 border-b border-gray-200 ${getHeaderBgColor()} sm:p-5`}>
                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 sm:text-lg">
                      {exam.exam_name}
                    </h3>
                    <p className="text-sm text-gray-600 sm:text-base">
                      {exam.chapter} - {exam.subject}
                    </p>
                  </div>

                  {/* Score Display */}
                  <div className="p-4 flex flex-col items-center justify-center sm:p-5">
                    <div className="text-sm text-gray-500 font-medium mb-3">Obtained Marks</div>
                    <ScoreIndicator score={exam.score} total={exam.total_questions} />
                  </div>

                  {/* Stats */}
                  <div className="px-4 pb-3 grid grid-cols-2 gap-3 sm:px-5 sm:pb-4">
                    <div className="text-center bg-red-50 bg-opacity-70 rounded-lg p-2 backdrop-blur-sm sm:p-3">
                      <div className="text-base font-bold text-gray-800 sm:text-lg">{exam.total_questions}</div>
                      <div className="text-xs text-gray-600 sm:text-sm">Questions</div>
                    </div>
                    <div className="text-center bg-red-50 bg-opacity-70 rounded-lg p-2 backdrop-blur-sm sm:p-3">
                      <div className="text-base font-bold text-gray-800 sm:text-lg">
                        {formatTimeTaken(exam.time_taken_seconds)}
                      </div>
                      <div className="text-xs text-gray-600 sm:text-sm">Taken Time</div>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="px-4 pb-3 sm:px-5 sm:pb-4">
                    <div className="flex items-center text-sm text-gray-600 sm:text-base">
                      <Clock size={14} className="mr-1 text-gray-500 sm:size-4" />
                      {formatDate(exam.created_at)}
                    </div>
                  </div>

                  {/* Action Buttons - Fixed tooltip isolation */}
                  <div className="p-3 border-t border-gray-200 bg-white bg-opacity-50 flex justify-between backdrop-blur-sm sm:p-4">
                    <div className="flex-1 mr-2 relative group">
                      <Link
                        to={`/examinee/previous-attempt-exam/${exam.attempt_exam_id}`}
                        className="flex items-center justify-center w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm shadow-sm sm:px-4 sm:py-2.5 sm:text-base"
                      >
                        <Eye size={16} className="mr-1 sm:mr-2 sm:size-5" />
                        Details
                      </Link>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity duration-200 z-50 shadow-lg font-medium sm:mb-3 sm:px-3 sm:py-1.5 sm:text-sm">
                        View detailed results
                      </span>
                    </div>
                    
                    <div className="flex-1 ml-2 relative group">
                      <Link
                        to={`/examinee/attempt-exam-result/leaderboard/${exam.exam_id}`}
                        className="flex items-center justify-center w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm shadow-sm sm:px-4 sm:py-2.5 sm:text-base"
                      >
                        <BarChart size={16} className="mr-1 sm:mr-2 sm:size-5" />
                        Rank
                      </Link>
                      <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap transition-opacity duration-200 z-50 shadow-lg font-medium sm:mb-3 sm:px-3 sm:py-1.5 sm:text-sm">
                        Compare with others
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center mt-8 sm:mt-10">
                <nav className="flex items-center space-x-2 bg-white rounded-lg shadow-sm p-2 border border-gray-200 sm:space-x-3 sm:p-3">
                  <button
                    onClick={() => fetchMyExams(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                    className="flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-gray-700 text-sm sm:px-4 sm:py-2.5 sm:text-base"
                  >
                    <ChevronLeft size={16} className="mr-1 sm:mr-2 sm:size-5" />
                    <span className="hidden xs:inline">Prev</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => fetchMyExams(pageNum)}
                          className={`px-3 py-2 rounded-md border transition-colors text-sm font-medium sm:px-4 sm:py-2.5 sm:text-base ${
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
                      <span className="px-2 py-2 text-gray-500 text-sm sm:px-3 sm:py-2.5">...</span>
                    )}
                  </div>

                  <button
                    onClick={() => fetchMyExams(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="flex items-center justify-center px-3 py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-gray-700 text-sm sm:px-4 sm:py-2.5 sm:text-base"
                  >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight size={16} className="ml-1 sm:ml-2 sm:size-5" />
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