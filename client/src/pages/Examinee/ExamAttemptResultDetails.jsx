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

  // Use examDetails if available, otherwise fall back to examResult for backward compatibility
  const examName = examDetails?.exam_name || examResult?.exam_name;
  const examId = examDetails?.exam_id || examResult?.exam_id;
  const attemptId = examResult?.attempt_id;
  
  // Calculate score and counts if not provided directly
  const score = examResult?.score || (examResult?.correct_answers / questions?.length * 100) || 0;
  const correctAnswers = examResult?.correct_answers || (questions?.filter(q => q.is_correct).length) || 0;
  const wrongAnswers = examResult?.wrong_answers || (questions?.filter(q => !q.is_correct && q.selected_answer).length) || 0;
  const unansweredQuestions = examResult?.unanswered_questions || (questions?.filter(q => !q.selected_answer).length) || 0;

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="text-center bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">No Details Found</h2>
          <p className="text-gray-600 text-sm mb-4">Please complete an exam to view details.</p>
          <button
            onClick={() => navigate('/examinee/dashboard')}
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
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
    if (score >= 80) return "from-green-500 to-emerald-500";
    if (score >= 60) return "from-blue-500 to-cyan-500";
    if (score >= 40) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  const getPerformanceMessage = (score) => {
    if (score >= 80) return "Excellent!";
    if (score >= 60) return "Good job!";
    if (score >= 40) return "Fair attempt";
    return "Keep practicing!";
  };

  const getOptionColor = (option, question) => {
    if (option.option_letter === question.correct_answer) return "bg-green-100 border-green-300";
    if (option.option_letter === question.selected_answer && !question.is_correct) return "bg-red-100 border-red-300";
    if (option.option_letter === question.selected_answer) return "bg-blue-100 border-blue-300";
    return "bg-gray-50 border-gray-200";
  };

  const getOptionTextColor = (option, question) => {
    if (option.option_letter === question.correct_answer) return "text-green-800";
    if (option.option_letter === question.selected_answer && !question.is_correct) return "text-red-800";
    if (option.option_letter === question.selected_answer) return "text-blue-800";
    return "text-gray-700";
  };

  const handleViewLeaderboard = () => {
    navigate(`/examinee/attempt-exam-result/leaderboard/${examId}`, { 
      state: { examName, examId } 
    });
  };

  const handlePrintResults = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-15">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate('/examinee/dashboard')}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={handleViewLeaderboard}
                className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-md cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Leaderboard
              </button>
              
              <button
                onClick={handlePrintResults}
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md cursor-pointer"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
                Print Results
              </button>
            </div>
          </div>
          
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Exam Attempt Details</h1>
          <p className="text-lg text-gray-600">{examName}</p>
          <div className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {getPerformanceMessage(score)}
            </span>
          </div>
        </div>

        {/* Summary Card */}
        {/* Summary Card */}
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
        {score.toFixed(1)}%
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
    <span>Time Taken: {timeTaken} minutes</span>
    {attemptId && <span>Attempt ID: {attemptId.substring(0, 8)}...</span>}
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
            <div key={question.question_id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-lg font-semibold text-gray-700 mr-3">Q{index + 1}</span>
                  {question.is_correct ? (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Correct
                    </span>
                  ) : question.selected_answer ? (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
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
                {question.options && question.options.map((option) => (
                  <div 
                    key={option.option_letter} 
                    className={`p-3 rounded-lg border ${getOptionColor(option, question)}`}
                  >
                    <div className="flex items-start">
                      <span className={`font-semibold mr-3 ${getOptionTextColor(option, question)}`}>
                        {option.option_letter}.
                      </span>
                      <div className="flex-1">
                        <p className={getOptionTextColor(option, question)}>
                          {option.option_text}
                        </p>
                        {option.option_image_url && (
                          <div className="mt-2 max-w-xs">
                            <img 
                              src={option.option_image_url} 
                              alt={`Option ${option.option_letter}`} 
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
          <button
            onClick={() => navigate('/examinee/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md font-semibold"
          >
            Back to Dashboard
          </button>
          
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