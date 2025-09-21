import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Eye, BarChart, Clock, Award, BookOpen, ChevronLeft, Check, X, HelpCircle, Calendar, Clock as TimeIcon, FileText, BarChart3, Printer, Trophy } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

export default function PreviousAttemptExamDetails() {
  const { attemptExamId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(GlobalContext);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "correct", "incorrect", "unanswered"

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchExamDetails();
  }, [attemptExamId]);

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/examinee/previous-attempt-exam/${attemptExamId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setExam(response.data.exam);
        setQuestions(response.data.exam.questions || []);
      } else {
        setError("Failed to fetch exam details");
      }
    } catch (err) {
      console.error("Error fetching exam details:", err);
      setError(err.response?.data?.message || "Failed to fetch exam details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handlePrintResults = () => {
    window.print();
  };

  const handleViewLeaderboard = () => {
    navigate(`/examinee/attempt-exam-result/leaderboard/${exam.exam_id}`, { 
      state: { examName: exam.exam_name, examId: exam.exam_id } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4">
            <Clock className="w-full h-full" />
          </div>
          <p className="text-gray-600">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Link to="/examinee/previous-attempts" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ChevronLeft size={20} className="mr-1" /> Back to My Exams
          </Link>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-red-500 mb-4">
              <X className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">Unable to load exam details</h3>
            <p className="text-gray-600 mb-6">{error || "Exam not found"}</p>
            <Link
              to="/examinee/previous-attempts"
              className="inline-flex items-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-md hover:shadow-lg"
            >
              Return to My Exams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate values based on the exam data
  const correctAnswers = exam.correct_answers || questions.filter(q => q.is_correct).length;
  const wrongAnswers = exam.wrong_answers || questions.filter(q => !q.is_correct && q.selected_answer).length;
  const unansweredQuestions = exam.unanswered_questions || questions.filter(q => !q.selected_answer).length;
  const scorePercentage = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;

  // Filter questions based on active tab
  const filteredQuestions = questions.filter(question => {
    if (activeTab === "all") return true;
    if (activeTab === "correct") return question.is_correct;
    if (activeTab === "incorrect") return !question.is_correct && question.selected_answer;
    if (activeTab === "unanswered") return !question.selected_answer;
    return true;
  });

  const getPerformanceMessage = (score) => {
    if (score >= 80) return "Excellent!";
    if (score >= 60) return "Good job!";
    if (score >= 40) return "Fair attempt";
    return "Keep practicing!";
  };

  const getOptionColor = (optionLetter, question) => {
    if (optionLetter === question.correct_answer) return "bg-green-100 border-green-300";
    if (optionLetter === question.selected_answer && !question.is_correct) return "bg-red-100 border-red-300";
    if (optionLetter === question.selected_answer) return "bg-blue-100 border-blue-300";
    return "bg-gray-50 border-gray-200";
  };

  const getOptionTextColor = (optionLetter, question) => {
    if (optionLetter === question.correct_answer) return "text-green-800";
    if (optionLetter === question.selected_answer && !question.is_correct) return "text-red-800";
    if (optionLetter === question.selected_answer) return "text-blue-800";
    return "text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-15">
          <div className="flex justify-between items-center mb-4">
            <Link
              to="/examinee/previous-attempts"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to My Exams
            </Link>
            
            <div className="flex gap-2">
              <button
                onClick={handleViewLeaderboard}
                className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-md"
              >
                <Trophy size={16} className="mr-1" />
                View Leaderboard
              </button>
              
              <button
                onClick={handlePrintResults}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md"
              >
                <Printer size={16} className="mr-1" />
                Print Results
              </button>
            </div>
          </div>
          
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Exam Attempt Details</h1>
          <p className="text-lg text-gray-600">{exam.exam_name}</p>
          <div className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {getPerformanceMessage(scorePercentage)}
            </span>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">Attempt Summary</h2>
          
          {/* Marks and Percentage - Side by Side */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
            {/* Marks Obtained */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 flex-1 text-center">
              <div className="text-3xl font-bold text-blue-700 mb-1">
                {correctAnswers}<span className="text-lg">/{questions.length}</span>
              </div>
              <div className="text-sm text-blue-800 font-medium">Marks Obtained</div>
            </div>
            
            {/* Percentage Score */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 flex-1 text-center">
              <div className="text-3xl font-bold text-purple-700 mb-1">
                {scorePercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-purple-800 font-medium">Score Percentage</div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-xl border border-green-100">
              <div className="text-xl font-bold text-green-600 mb-1">
                {correctAnswers}
              </div>
              <div className="text-xs text-green-700 font-medium">Correct</div>
            </div>

            <div className="text-center p-3 bg-red-50 rounded-xl border border-red-100">
              <div className="text-xl font-bold text-red-600 mb-1">
                {wrongAnswers}
              </div>
              <div className="text-xs text-red-700 font-medium">Wrong</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-xl font-bold text-gray-600 mb-1">
                {unansweredQuestions}
              </div>
              <div className="text-xs text-gray-700 font-medium">Unanswered</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Time Taken: {formatTime(exam.time_taken_seconds)}</span>
            <span>Attempted on: {formatDate(exam.created_at)}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">Question Review</h3>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Questions ({questions.length})
            </button>
            
            <button
              onClick={() => setActiveTab("correct")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "correct" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Correct ({correctAnswers})
            </button>
            
            <button
              onClick={() => setActiveTab("incorrect")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "incorrect" 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Incorrect ({wrongAnswers})
            </button>
            
            <button
              onClick={() => setActiveTab("unanswered")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "unanswered" 
                  ? "bg-gray-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Unanswered ({unansweredQuestions})
            </button>
          </div>

          <p className="text-center text-sm text-gray-500">
            {filteredQuestions.length} question(s) found
          </p>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((question, index) => (
            <div key={question.question_id || index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-700 mr-3">Q{index + 1}</span>
                  {question.is_correct ? (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      <Check size={12} className="mr-1" />
                      Correct
                    </span>
                  ) : question.selected_answer ? (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      <X size={12} className="mr-1" />
                      Incorrect
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                      Unanswered
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-500">
                  Marks: {question.is_correct ? "1" : "0"}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-800 font-medium">{question.question_text}</p>
                {question.question_image_url && (
                  <div className="mt-2 max-w-md mx-auto">
                    <img 
                      src={question.question_image_url} 
                      alt="Question" 
                      className="max-w-full h-auto max-h-60 object-contain rounded-lg border border-gray-200 mx-auto"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {question.options && Object.entries(question.options).map(([key, option]) => (
                  <div 
                    key={key} 
                    className={`p-3 rounded-lg border ${getOptionColor(key, question)}`}
                  >
                    <div className="flex items-start">
                      <span className={`font-semibold mr-3 ${getOptionTextColor(key, question)}`}>
                        {key}.
                      </span>
                      <div className="flex-1">
                        <p className={getOptionTextColor(key, question)}>
                          {option.text}
                        </p>
                        {option.image_url && (
                          <div className="mt-2 max-w-xs">
                            <img 
                              src={option.image_url} 
                              alt={`Option ${key}`} 
                              className="max-w-full h-auto max-h-40 object-contain rounded border border-gray-200 mx-auto"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Link
            to="/examinee/previous-attempts"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md font-semibold"
          >
            Back to My Exams
          </Link>
          
          <button
            onClick={handleViewLeaderboard}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md font-semibold"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}