import { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Eye, BarChart, Clock, Award, BookOpen, ChevronLeft, Check, X, HelpCircle, Calendar, Printer, Trophy, Loader } from "lucide-react";
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

  const handlePrintResults = () => {
    window.print();
  };

  const handleViewLeaderboard = () => {
    if (exam) {
      navigate(`/examinee/attempt-exam-result/leaderboard/${exam.exam_id}`, { 
        state: { examName: exam.exam_name, examId: exam.exam_id } 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 text-teal-600 mx-auto mb-4">
            <Loader className="absolute inset-0 m-auto text-teal-600" size={28} />
          </div>
          <p className="text-slate-600">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Link to="/examinee/previous-attempts" className="inline-flex items-center text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-slate-300 hover:border-teal-300 mb-6">
            <ChevronLeft size={16} className="mr-2" />
            Back to Exam History
          </Link>
          
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-200">
            <div className="text-rose-500 mb-4">
              <X className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Unable to load exam details</h3>
            <p className="text-slate-600 mb-6">{error || "Exam not found"}</p>
            <Link
              to="/examinee/previous-attempts"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl font-semibold"
            >
              Return to Exam History
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
  const scorePercentage = questions.length > 0 ? Math.round((correctAnswers / questions.length) * 100) : 0;

  // Filter questions based on active tab
  const filteredQuestions = questions.filter(question => {
    if (activeTab === "all") return true;
    if (activeTab === "correct") return question.is_correct;
    if (activeTab === "incorrect") return !question.is_correct && question.selected_answer;
    if (activeTab === "unanswered") return !question.selected_answer;
    return true;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return "from-teal-500 to-cyan-500";
    if (score >= 60) return "from-teal-400 to-cyan-400";
    if (score >= 40) return "from-amber-500 to-orange-500";
    return "from-rose-500 to-pink-500";
  };

  const getPerformanceMessage = (score) => {
    if (score >= 80) return "Excellent Performance!";
    if (score >= 60) return "Great Job!";
    if (score >= 40) return "Good Attempt";
    return "Keep Practicing!";
  };

  const getOptionColor = (optionLetter, question) => {
    if (optionLetter === question.correct_answer) return "bg-teal-50 border-teal-300 shadow-sm";
    if (optionLetter === question.selected_answer && !question.is_correct) return "bg-rose-50 border-rose-300 shadow-sm";
    if (optionLetter === question.selected_answer) return "bg-cyan-50 border-cyan-300 shadow-sm";
    return "bg-slate-50 border-slate-200 hover:border-slate-300";
  };

  const getOptionTextColor = (optionLetter, question) => {
    if (optionLetter === question.correct_answer) return "text-teal-800 font-semibold";
    if (optionLetter === question.selected_answer && !question.is_correct) return "text-rose-800 font-semibold";
    if (optionLetter === question.selected_answer) return "text-cyan-800 font-semibold";
    return "text-slate-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 mt-12 sm:mt-15">
          {/* Top Buttons - Only show on desktop */}
          <div className="hidden sm:flex justify-between items-center mb-6">
            <Link
              to="/previous-attempt-exam"
              className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-slate-300 hover:border-teal-300"
            >
              <ChevronLeft size={16} className="mr-2" />
              Back to Exam History
            </Link>

            <div className="flex gap-3">
              <button
                onClick={handleViewLeaderboard}
                className="inline-flex items-center text-sm bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-teal-300 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <Trophy size={16} className="mr-2" />
                View Leaderboard
              </button>

              <button
                onClick={handlePrintResults}
                className="inline-flex items-center text-sm bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-teal-300 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <Printer size={16} className="mr-2" />
                Print Results
              </button>
            </div>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl">
            <Award className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Exam Results
          </h1>
          <span className="text-lg sm:text-xl text-slate-600 mb-3 sm:mb-4 px-1">{exam.exam_name}</span> 
          (<span className="text-lg sm:text-xl text-slate-600 mb-3 sm:mb-4 px-1">{exam.class_name}</span>) -

          <span className="text-lg sm:text-xl text-slate-600 mb-3 sm:mb-4 px-1">{exam.subject}</span> 
          (<span className="text-lg sm:text-xl text-slate-600 mb-3 sm:mb-4 px-1">{exam.chapter}</span>) 
          <div className="mt-3 sm:mt-4">
            <span className="inline-block bg-gradient-to-r from-teal-100 to-cyan-100 text-slate-800 text-sm font-semibold px-4 py-2 rounded-full border border-teal-200">
              {getPerformanceMessage(scorePercentage)}
            </span>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-8 mb-6 sm:mb-8 border border-slate-200 hover:border-teal-300 transition-all duration-300">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 text-center">Result Summary</h2>

          {/* Marks and Percentage - Side by Side */}
          <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Marks Obtained */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-teal-200 flex-1 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {correctAnswers}<span className="text-xl sm:text-2xl text-slate-600">/{questions.length}</span>
              </div>
              <div className="text-sm sm:text-base text-slate-700 font-semibold">Marks Obtained</div>
            </div>

            {/* Percentage Score */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 flex-1 text-center hover:shadow-lg transition-all duration-300">
              <div className={`text-2xl sm:text-4xl font-bold bg-gradient-to-r ${getScoreColor(scorePercentage)} bg-clip-text text-transparent mb-2`}>
                {scorePercentage}%
              </div>
              <div className="text-sm sm:text-base text-slate-700 font-semibold">Marks Percentage</div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-6">
            <div className="text-center p-3 sm:p-4 bg-teal-50 rounded-xl sm:rounded-2xl border border-teal-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg sm:text-2xl font-bold text-teal-600 mb-1 sm:mb-2">
                {correctAnswers}
              </div>
              <div className="text-xs sm:text-sm text-teal-700 font-semibold">Correct</div>
            </div>

            <div className="text-center p-3 sm:p-4 bg-rose-50 rounded-xl sm:rounded-2xl border border-rose-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg sm:text-2xl font-bold text-rose-600 mb-1 sm:mb-2">
                {wrongAnswers}
              </div>
              <div className="text-xs sm:text-sm text-rose-700 font-semibold">Wrong</div>
            </div>

            <div className="text-center p-3 sm:p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="text-lg sm:text-2xl font-bold text-slate-600 mb-1 sm:mb-2">
                {unansweredQuestions}
              </div>
              <div className="text-xs sm:text-sm text-slate-700 font-semibold">Unanswered</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm sm:text-base text-slate-600 bg-slate-50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-slate-200">
            <span className="font-medium">Time Taken: {formatTimeTaken(exam.time_taken_seconds)}</span>
            <span className="font-medium">Attempted on: {formatDate(exam.created_at)}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-200 hover:border-teal-300 transition-all duration-300">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 text-center">Question Review</h3>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl hover:scale-105 ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-lg sm:shadow-2xl"
                  : "bg-white text-slate-700 border border-slate-300 hover:border-teal-300"
              }`}
            >
              All ({questions.length})
            </button>

            <button
              onClick={() => setActiveTab("correct")}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl hover:scale-105 ${
                activeTab === "correct"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg sm:shadow-2xl"
                  : "bg-white text-slate-700 border border-slate-300 hover:border-teal-300"
              }`}
            >
              Correct ({correctAnswers})
            </button>

            <button
              onClick={() => setActiveTab("incorrect")}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl hover:scale-105 ${
                activeTab === "incorrect"
                  ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg sm:shadow-2xl"
                  : "bg-white text-slate-700 border border-slate-300 hover:border-teal-300"
              }`}
            >
              Wrong ({wrongAnswers})
            </button>

            <button
              onClick={() => setActiveTab("unanswered")}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl hover:scale-105 ${
                activeTab === "unanswered"
                  ? "bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg sm:shadow-2xl"
                  : "bg-white text-slate-700 border border-slate-300 hover:border-teal-300"
              }`}
            >
              Unanswered ({unansweredQuestions})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6 sm:space-y-8">
          {filteredQuestions.map((question, index) => (
            <div key={question.question_id || index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8 border border-slate-200 hover:border-teal-300 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-3">
                <div className="flex items-center">
                  <span className="text-lg sm:text-xl font-bold text-slate-900 mr-3 sm:mr-4">Q{index + 1}</span>
                  {question.is_correct ? (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-teal-100 text-teal-800 text-xs sm:text-sm font-semibold rounded-full border border-teal-200">
                      <Check size={12} className="mr-1 sm:mr-1" />
                      Correct
                    </span>
                  ) : question.selected_answer ? (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-rose-100 text-rose-800 text-xs sm:text-sm font-semibold rounded-full border border-rose-200">
                      <X size={12} className="mr-1 sm:mr-1" />
                      Incorrect
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold rounded-full border border-slate-200">
                      Unanswered
                    </span>
                  )}
                </div>

                <div className="text-xs sm:text-sm text-slate-600 bg-slate-50 px-2 sm:px-3 py-1 rounded-lg font-medium">
                  Marks: {question.is_correct ? "1" : "0"}
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-slate-900 text-base sm:text-lg font-semibold leading-relaxed">{question.question_text}</p>
                {question.question_image_url && (
                  <div className="mt-3 sm:mt-4 max-w-md mx-auto">
                    <img 
                      src={question.question_image_url} 
                      alt="Question" 
                      className="max-w-full h-auto max-h-48 sm:max-h-60 object-contain rounded-lg sm:rounded-xl border border-slate-200 mx-auto shadow-sm"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {question.options && Object.entries(question.options).map(([key, option]) => (
                  <div 
                    key={key} 
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${getOptionColor(key, question)} hover:shadow-md`}
                  >
                    <div className="flex items-start">
                      <span className={`font-bold text-base sm:text-lg mr-3 sm:mr-4 ${getOptionTextColor(key, question)}`}>
                        {key}.
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm sm:text-base leading-relaxed ${getOptionTextColor(key, question)}`}>
                          {option.text}
                        </p>
                        {option.image_url && (
                          <div className="mt-2 sm:mt-3 max-w-xs">
                            <img 
                              src={option.image_url} 
                              alt={`Option ${key}`} 
                              className="max-w-full h-auto max-h-32 sm:max-h-40 object-contain rounded-lg border border-slate-200 mx-auto shadow-sm"
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

        {/* Action Buttons - Show only on mobile */}
        <div className="sm:hidden flex flex-col gap-4 mt-8">
          <button
            onClick={handleViewLeaderboard}
            className="w-full inline-flex items-center justify-center bg-gradient-to-r from-teal-600 to-cyan-700 text-white px-6 py-4 rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl font-bold text-base"
          >
            <Trophy size={20} className="mr-3" />
            View Leaderboard
          </button>

          <button
            onClick={handlePrintResults}
            className="w-full inline-flex items-center justify-center bg-white text-slate-700 border border-slate-300 px-6 py-4 rounded-xl hover:scale-105 hover:shadow-lg hover:border-teal-300 transition-all duration-300 shadow-md font-bold text-base"
          >
            <Printer size={20} className="mr-3" />
            Print Results
          </button>
        </div>

        {/* Back to Exam History Button - Show only on mobile */}
        <div className="sm:hidden mt-6">
          <Link
            to="/examinee/previous-attempts"
            className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl font-bold text-base"
          >
            Back to Exam History
          </Link>
        </div>
      </div>
    </div>
  );
}