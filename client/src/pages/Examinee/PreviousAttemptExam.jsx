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
    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap transition-opacity duration-200 z-50 shadow-lg">
      {text}
    </span>
  </div>
);

// Score indicator component
const ScoreIndicator = ({ score, total }) => {
  const percentage = (score / total) * 100;
  let colorClass = "";

  if (percentage >= 80) colorClass = "text-green-700 bg-green-100 border-green-200";
  else if (percentage >= 60) colorClass = "text-blue-700 bg-blue-100 border-blue-200";
  else if (percentage >= 40) colorClass = "text-yellow-700 bg-yellow-100 border-yellow-200";
  else colorClass = "text-red-700 bg-red-100 border-red-200";

  return (
    <div className={`px-3 py-1 rounded-full font-semibold border ${colorClass}`}>
      Marks: {score}/{total}
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
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} min ${seconds} sec`;
    } else if (minutes > 0) {
      return `${minutes} min ${seconds} sec`;
    } else {
      return `${seconds} sec`;
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
        <div className="text-center mb-10 pt-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            My Attempted Exams
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Review all exams you have attempted and track your progress
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8 max-w-3xl mx-auto">
            {error}
          </div>
        )}

        {exams.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-2xl mx-auto">
            <div className="text-gray-300 mb-5">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">No exams attempted yet</h3>
            <p className="text-gray-600 mb-6">You haven't attempted any exams yet. Your attempts will appear here once you complete an exam.</p>
            <Link
              to="/examinee/dashboard"
              className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg"
            >
              Join New Exam
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {exams.map((exam) => (
                <div
                  key={exam.attempt_exam_id}
                  className="bg-white shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
                >
                  {/* Exam Header with gradient */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-5 text-white">
                    <h3 className="text-xl font-bold line-clamp-2 text-center">{exam.exam_name}</h3>
                    <p className="text-blue-100 text-sm text-center mt-1">
                      {exam.chapter} - {exam.subject} - {exam.class_name}
                    </p>
                  </div>

                  {/* Centered Score & Stats */}
                  <div className="p-5 flex flex-col items-center justify-center gap-3">
                    <div className="text-gray-600 text-sm">Obtained Score</div>
                    <div className="text-2xl font-bold text-gray-800">{exam.score}</div>
                    <div className="text-gray-500 text-sm">Total Questions: {exam.total_questions}</div>
                  </div>

                  {/* Stats */}
                  <div className="p-5 flex justify-around">
                    <div className="bg-purple-50 p-3 rounded-xl text-center flex-1 mx-1">
                      <div className="text-xs text-purple-600 mb-1">TIME TAKEN</div>
                      <div className="font-bold text-gray-800 text-lg">{formatTimeTaken(exam.time_taken_seconds)}</div>
                    </div>
                  </div>

                  {/* Attempted Date */}
                  <div className="px-5 pb-5 text-sm text-gray-500 text-center">
                    Attempted on: {formatDate(exam.created_at)}
                  </div>

                  {/* Action Buttons */}
                  <div className="px-5 pb-5 flex gap-3">
                    <Tooltip text="View Exam Details">
                      <Link
                        to={`/examinee/previous-attempt-exam/${exam.attempt_exam_id}`}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                      >
                        <Eye size={18} className="mr-2" />
                        Details
                      </Link>
                    </Tooltip>
                    <Tooltip text="View Results">
                      <Link
                        to={`/examinee/attempt-exam-result/leaderboard/${exam.exam_id}`}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                      >
                        <BarChart size={18} className="mr-2" />
                        Leaderboard
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