import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Eye, BarChart, Copy, Check, Plus, Loader, Trash2 } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import ConfirmDialog from "../../components/CustomConfirm";
import { useCustomAlert } from "../../context/CustomAlertContext";

// Reusable Tooltip Component
const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap transition-opacity duration-200 z-50">
      {text}
    </span>
  </div>
);

export default function AllCreatedExams() {
  const { user, token } = useContext(GlobalContext);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedExamId, setCopiedExamId] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 9,
    total_pages: 1,
    total_exams: 0,
    has_next: false,
    has_prev: false
  });

 // Add these state variables for the confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const custom_alert = useCustomAlert();

  useEffect(() => {
    fetchMyExams();
  }, []);

  const fetchMyExams = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://127.0.0.1:5000/api/exam/my-created-exams?page=${page}&per_page=${pagination.per_page}`,
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

  const copyExamLink = (examId) => {
    const link = `${window.location.origin}/exam/${examId}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopiedExamId(examId);
        setTimeout(() => setCopiedExamId(null), 2000);
      })
      .catch(() => alert("Failed to copy link."));
  };


 
  const confirmDelete = (examId, examName) => {
    setExamToDelete({ id: examId, name: examName });
    setShowDeleteConfirm(true);
  };

  const deleteExam = async () => {
    if (!examToDelete) return;

    try {
      setDeleting(true);
      const response = await axios.delete(
        `http://127.0.0.1:5000/api/exam/my-created-exams/delete-exam/${examToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        custom_alert.success("Exam deleted successfully!");
        // Refresh the exams list
        fetchMyExams(pagination.page);
      } else {
        custom_alert.error("Failed to delete exam: " + response.data.message);
      }
    } catch (err) {
      console.error("Error deleting exam:", err);
      custom_alert.error("Failed to delete exam. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
      setExamToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setExamToDelete(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

      {/* Add the confirmation dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={deleteExam}
        title="Delete Exam"
        message={`Are you sure you want to delete the exam "${examToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={deleting}
      />


      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            My Created Exams
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and manage all your created exams in one place.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Create New Exam Button */}
        {exams.length > 0 ? <div className="mb-6 text-center">
          <Link
            to="/examiner/create-exam"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition transform hover:scale-105 duration-300"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create New Exam
          </Link>
        </div> : ""}

        {exams.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams created yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first exam.</p>
            <Link
              to="/examiner/create-exam"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Exam
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {exams.map((exam) => (
                <div
                  key={exam.exam_id}
                  className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {exam.exam_name}
                  </h3>

                  <p className="text-gray-600 mb-3 text-sm">
                    {exam.subject} - {exam.chapter} ({exam.class_name})
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4 text-sm">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      Marks: {exam.total_marks}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      Time: {exam.total_time_minutes} min
                    </span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                      Qs: {exam.question_count}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Created: {formatDate(exam.created_at)}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between mt-4 flex-wrap gap-2">
                    <Tooltip text="View Exam">
                      <Link
                        to={`/examiner/my-created-exam/view-created-exam/${exam.exam_id}`}
                        className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                      >
                        <Eye size={18} />
                      </Link>
                    </Tooltip>

                    <Tooltip text="View Results">
                      <Link
                        to={`/examiner/results/${exam.exam_id}`}
                        className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                      >
                        <BarChart size={18} />
                      </Link>
                    </Tooltip>

                    <Tooltip text="Copy Exam Link">
                      <button
                        onClick={() => copyExamLink(exam.exam_id)}
                        className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center cursor-pointer"
                      >
                        {copiedExamId === exam.exam_id ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </Tooltip>

                    <Tooltip text="Delete Exam">
                      <button
                        onClick={() => confirmDelete(exam.exam_id, exam.exam_name)}
                        className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() => fetchMyExams(pagination.page - 1)}
                    disabled={!pagination.has_prev}
                    className="px-4 py-2 bg-white rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>

                  {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => fetchMyExams(pageNum)}
                      className={`px-4 py-2 rounded-lg border ${pagination.page === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => fetchMyExams(pagination.page + 1)}
                    disabled={!pagination.has_next}
                    className="px-4 py-2 bg-white rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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