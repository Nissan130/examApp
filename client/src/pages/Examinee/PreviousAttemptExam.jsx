import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Eye, BarChart, Link as LinkIcon, Plus, Loader, Trash2, Clock, Award, BookOpen } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

// Reusable Tooltip Component
const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap transition-opacity duration-200 z-50">
      {text}
    </span>
  </div>
);

// Score indicator component
const ScoreIndicator = ({ score, total }) => {
  const percentage = (score / total) * 100;
  let colorClass = "";
  
  if (percentage >= 80) colorClass = "bg-green-100 text-green-700";
  else if (percentage >= 60) colorClass = "bg-blue-100 text-blue-700";
  else if (percentage >= 40) colorClass = "bg-yellow-100 text-yellow-700";
  else colorClass = "bg-red-100 text-red-700";
  
  return (
    <div className={`px-3 py-1 rounded-full font-semibold ${colorClass}`}>
      {score}/{total}
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
    per_page: 9,
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
      return `${hours}h ${minutes}m ${seconds}s`;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            My Attempted Exams
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Review all exams you have attempted and track your progress
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 max-w-3xl mx-auto">
            {error}
          </div>
        )}

        {exams.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams attempted yet</h3>
            <p className="text-gray-600 mb-4">You haven't attempted any exams yet. Your attempts will appear here once you complete an exam.</p>
            <Link
              to="/examinee/dashboard"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              Join New Exam
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {exams.map((exam) => (
                <div
                  key={exam.attempt_exam_id}
                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 flex flex-col"
                >
                  {/* Exam Header */}
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                      {exam.exam_name}
                    </h3>
                    <p className="text-gray-600 text-sm text-center">
                      {exam.chapter} - {exam.subject} - {exam.class_name}
                    </p>
                  </div>

                  {/* Score Display - Centered */}
                  <div className="flex flex-col items-center justify-center py-4 mb-4">
                    <div className="text-sm text-gray-500 mb-2">Your Score</div>
                    <ScoreIndicator score={exam.score} total={exam.total_questions} />
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-2 mb-4 text-sm">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      Questions: {exam.total_questions}
                    </span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                      Time: {formatTimeTaken(exam.time_taken_seconds)}
                    </span>
                  </div>

                  {/* Attempted Date */}
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Clock size={14} className="mr-2" />
                    Attempted on: {formatDate(exam.created_at)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-auto flex-wrap gap-2">
                    <Tooltip text="View Exam Details">
                      <Link
                        to={`/examinee/previous-attempt-exam/${exam.attempt_exam_id}`}
                        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                      >
                        <Eye size={18} />
                      </Link>
                    </Tooltip>

                    <Tooltip text="View Leaderboard">
                      <Link
                        to={`/examinee/attempt-exam-result/leaderboard/${exam.exam_id}`}
                        className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                      >
                        <BarChart size={18} />
                      </Link>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm">
                  <button
                    onClick={() => fetchMyExams(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                    className="px-4 py-2 bg-white rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>

                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => fetchMyExams(pageNum)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${pagination.page === pageNum
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => fetchMyExams(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="px-4 py-2 bg-white rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
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