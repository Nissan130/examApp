import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ExamAttemptResultDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examResult, examDetails, questions, timeTaken } = location.state || {};
  const [activeTab, setActiveTab] = useState("all"); // "all", "correct", "incorrect", "unanswered"

  // Add this useEffect to scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Add this useEffect to scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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

  // Use examDetails if available, otherwise fall back to examResult for backward compatibility
  const examName = examDetails?.exam_name || examResult?.exam_name;
  const exam_id = examDetails?.exam_id || examResult?.exam_id;
  const attemptId = examResult?.attempt_id;

  // Calculate score and counts if not provided directly
  const score = examResult?.score
  const score_percentage = Math.round(((score / questions?.length) * 100), 2)
  const correctAnswers = examResult?.correct_answers || (questions?.filter(q => q.is_correct).length) || 0;
  const wrongAnswers = examResult?.wrong_answers || (questions?.filter(q => !q.is_correct && q.selected_answer).length) || 0;
  const unansweredQuestions = examResult?.unanswered_questions || (questions?.filter(q => !q.selected_answer).length) || 0;

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
        <div className="text-center bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full border border-slate-200 hover:border-teal-300 transition-all duration-300">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">No Details Found</h2>
          <p className="text-slate-600 text-base mb-6">Please complete an exam to view details.</p>
          <button
            onClick={() => navigate('/examinee/dashboard')}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl font-semibold"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

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

  const getOptionColor = (option, question) => {
    if (option.option_letter === question.correct_answer) return "bg-teal-50 border-teal-300 shadow-sm";
    if (option.option_letter === question.selected_answer && !question.is_correct) return "bg-rose-50 border-rose-300 shadow-sm";
    if (option.option_letter === question.selected_answer) return "bg-cyan-50 border-cyan-300 shadow-sm";
    return "bg-slate-50 border-slate-200 hover:border-slate-300";
  };

  const getOptionTextColor = (option, question) => {
    if (option.option_letter === question.correct_answer) return "text-teal-800 font-semibold";
    if (option.option_letter === question.selected_answer && !question.is_correct) return "text-rose-800 font-semibold";
    if (option.option_letter === question.selected_answer) return "text-cyan-800 font-semibold";
    return "text-slate-700";
  };

  const handleViewLeaderboard = () => {
    navigate(`/examinee/attempt-exam-result/leaderboard/${exam_id}`);
  };

  const handlePrintResults = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 mt-12 sm:mt-15">
          {/* Top Buttons - Only show on desktop */}
          <div className="hidden sm:flex justify-between items-center mb-6">
            <button
              onClick={() => navigate('/examinee/dashboard')}
              className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-slate-300 hover:border-teal-300 cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleViewLeaderboard}
                className="inline-flex items-center text-sm bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-teal-300 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Leaderboard
              </button>

              <button
                onClick={handlePrintResults}
                className="inline-flex items-center text-sm bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-teal-300 px-4 py-2 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
                Print Results
              </button>
            </div>
          </div>

          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-2xl">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Exam Results
          </h1>
          <span className="text-lg sm:text-xl text-slate-600 mb-3 sm:mb-4 px-1">{examDetails.exam_name}</span> 
          (<span className="text-lg sm:text-xl text-slate-600 mb-3 sm:mb-4 px-1">{examDetails.class_name}</span>) -

          <span className="text-lg sm:text-xl text-slate-600 mb-3 sm:mb-4 px-1">{examDetails.subject}</span> 
          (<span className="text-lg sm:text-xl text-slate-600 mb-3 sm:mb-4 px-1">{examDetails.chapter}</span>) 

          <div className="mt-3 sm:mt-4">
            <span className="inline-block bg-gradient-to-r from-teal-100 to-cyan-100 text-slate-800 text-sm font-semibold px-4 py-2 rounded-full border border-teal-200">
              {getPerformanceMessage(score_percentage)}
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
                {score}<span className="text-xl sm:text-2xl text-slate-600">/{questions.length}</span>
              </div>
              <div className="text-sm sm:text-base text-slate-700 font-semibold">Marks Obtained</div>
            </div>

            {/* Percentage Score */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 flex-1 text-center hover:shadow-lg transition-all duration-300">
              <div className={`text-2xl sm:text-4xl font-bold bg-gradient-to-r ${getScoreColor(score_percentage)} bg-clip-text text-transparent mb-2`}>
                {score_percentage}%
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
            <span className="font-medium">Time Taken: {formatTimeTaken(timeTaken)}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-slate-200 hover:border-teal-300 transition-all duration-300">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 text-center">Question Review</h3>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl hover:scale-105 ${activeTab === "all"
                ? "bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-lg sm:shadow-2xl"
                : "bg-white text-slate-700 border border-slate-300 hover:border-teal-300"
                }`}
            >
              All ({questions.length})
            </button>

            <button
              onClick={() => setActiveTab("correct")}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl hover:scale-105 ${activeTab === "correct"
                ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg sm:shadow-2xl"
                : "bg-white text-slate-700 border border-slate-300 hover:border-teal-300"
                }`}
            >
              Correct ({correctAnswers})
            </button>

            <button
              onClick={() => setActiveTab("incorrect")}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl hover:scale-105 ${activeTab === "incorrect"
                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg sm:shadow-2xl"
                : "bg-white text-slate-700 border border-slate-300 hover:border-teal-300"
                }`}
            >
              Wrong ({wrongAnswers})
            </button>

            <button
              onClick={() => setActiveTab("unanswered")}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-md sm:shadow-lg hover:shadow-xl hover:scale-105 ${activeTab === "unanswered"
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
            <div
              key={question.question_id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8 border border-slate-200 hover:border-teal-300 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-3">
                <div className="flex items-center">
                  <span className="text-lg sm:text-xl font-bold text-slate-900 mr-3 sm:mr-4">Q{index + 1}</span>
                  {question.is_correct ? (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-teal-100 text-teal-800 text-xs sm:text-sm font-semibold rounded-full border border-teal-200">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Correct
                    </span>
                  ) : question.selected_answer ? (
                    <span className="inline-flex items-center px-2 sm:px-3 py-1 bg-rose-100 text-rose-800 text-xs sm:text-sm font-semibold rounded-full border border-rose-200">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
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
                {question.options && question.options.map((option) => (
                  <div
                    key={option.option_letter}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${getOptionColor(option, question)} hover:shadow-md`}
                  >
                    <div className="flex items-start">
                      <span className={`font-bold text-base sm:text-lg mr-3 sm:mr-4 ${getOptionTextColor(option, question)}`}>
                        {option.option_letter}.
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm sm:text-base leading-relaxed ${getOptionTextColor(option, question)}`}>
                          {option.option_text}
                        </p>
                        {option.option_image_url && (
                          <div className="mt-2 sm:mt-3 max-w-xs">
                            <img
                              src={option.option_image_url}
                              alt={`Option ${option.option_letter}`}
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
            className="w-full inline-flex items-center justify-center bg-gradient-to-r from-teal-600 to-cyan-700 text-white border border-slate-300 hover:border-teal-300 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer font-bold text-base"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            View Leaderboard
          </button>

          <button
            onClick={handlePrintResults}
            className="w-full inline-flex items-center justify-center bg-gradient-to-r from-teal-600 to-cyan-700 text-white border border-slate-300 hover:border-teal-300 px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer font-bold text-base"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
            </svg>
            Print Results
          </button>
        </div>

        {/* Back to Dashboard Button - Show only on mobile */}
        <div className="sm:hidden mt-6">
          <button
            onClick={() => navigate('/examinee/dashboard')}
            className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 shadow-xl font-bold text-base"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}