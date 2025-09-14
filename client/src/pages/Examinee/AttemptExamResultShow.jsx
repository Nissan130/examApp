import { useLocation, useNavigate } from "react-router-dom";

export default function AttempExamResultShow() {
  const location = useLocation();
  const navigate = useNavigate();
  const { examResult, examName } = location.state || {};

  if (!examResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="text-center bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">No Results Found</h2>
          <p className="text-gray-600 text-sm mb-4">Please complete an exam to view results.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Exam Results</h1>
          <p className="text-lg text-gray-600">{examName}</p>
          <div className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              {getPerformanceMessage(examResult.score)}
            </span>
          </div>
        </div>

        {/* Main Score Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-6">Your Marks</h2>

          {/* Score Circle */}
          <div className="relative inline-flex items-center justify-center w-32 h-32 mx-auto mb-6">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${getScoreColor(
                examResult.score
              )} opacity-90 shadow-lg`}
            ></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-white">
              <span className="text-4xl font-extrabold leading-tight">
                {examResult.score}
              </span>
              <span className="text-xs opacity-90">
                out of {examResult.total_questions}
              </span>
            </div>
          </div>

          {/* Performance Message */}
          <p className="text-base font-medium text-gray-600 mb-6">
            {getPerformanceMessage(examResult.score)}
          </p>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {examResult.correct_answers}
              </div>
              <div className="text-sm text-green-700 font-medium">Correct</div>
            </div>

            <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {examResult.wrong_answers}
              </div>
              <div className="text-sm text-red-700 font-medium">Wrong</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-2xl font-bold text-gray-600 mb-1">
                {examResult.unanswered_questions}
              </div>
              <div className="text-sm text-gray-700 font-medium">Unanswered</div>
            </div>
          </div>
        </div>


        {/* Progress Bars */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Performance Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-green-600 text-sm font-medium">Correct Answers</span>
                <span className="text-gray-600 text-xs">{examResult.correct_answers}/{examResult.total_questions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-800 ease-out"
                  style={{ width: `${(examResult.correct_answers / examResult.total_questions) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-red-600 text-sm font-medium">Wrong Answers</span>
                <span className="text-gray-600 text-xs">{examResult.wrong_answers}/{examResult.total_questions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-800 ease-out"
                  style={{ width: `${(examResult.wrong_answers / examResult.total_questions) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-600 text-sm font-medium">Unanswered</span>
                <span className="text-gray-600 text-xs">{examResult.unanswered_questions}/{examResult.total_questions}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gray-400 h-2 rounded-full transition-all duration-800 ease-out"
                  style={{ width: `${(examResult.unanswered_questions / examResult.total_questions) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <button
            onClick={() => navigate('/examinee/dashboard')}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md font-semibold text-base"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate('/examinee/attempt-exam/leaderboard')}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md font-semibold text-base flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            View Leaderboard
          </button>

          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 border border-gray-200 shadow-sm font-semibold text-base flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
            </svg>
            Print Results
          </button>
        </div>



        {/* Subtle Celebration Confetti */}
        <div className="fixed inset-0 pointer-events-none z-50 opacity-5">
          <div className="absolute top-0 left-1/4 w-1 h-1 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="absolute top-0 left-3/4 w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}