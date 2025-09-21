import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExamineeContext } from "../../context/ExamineeContext";
import { API_BASE_URL } from "../../utils/api";
import { Loader, ArrowRight, Shield, BookOpen, Users } from "lucide-react";

export default function EnterExamCode() {
  const navigate = useNavigate();
  const {
    examineeAttemptExamCode,
    setExamineeAttemptExamCode,
    examineeAttemptExam,
    setExamineeAttemptExam,
  } = useContext(ExamineeContext);

  const [joinExamLoading, setJoinExamLoading] = useState(false);
  const [joinExamError, setJoinExamError] = useState("");

  const handleJoinExam = async (e) => {
    e.preventDefault();
    setJoinExamLoading(true);
    setJoinExamError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/examinee/enter-exam-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exam_code: examineeAttemptExamCode }),
        }
      );

      const data = await response.json();

      if (data.status === "success") {
        setExamineeAttemptExam(data.exam_data); // save exam in context
        setExamineeAttemptExamCode(""); // reset input
        navigate("/preview-start-exam"); // go to preview
      } else {
        setJoinExamError(data.message || "Invalid exam code");
      }
    } catch (err) {
      setJoinExamError(err.message || "Failed to join exam");
    } finally {
      setJoinExamLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10 mt-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Join Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Exam</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Enter Exam Code</h2>
            </div>

            <form onSubmit={handleJoinExam} className="space-y-6">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    value={examineeAttemptExamCode}
                    onChange={(e) => setExamineeAttemptExamCode(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g., ABC123)"
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium tracking-wide outline-none"
                    required
                    autoFocus
                  />
                  <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {joinExamError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-red-700 font-medium">{joinExamError}</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={joinExamLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg flex items-center justify-center space-x-2"
              >
                {joinExamLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Joining Exam...</span>
                  </>
                ) : (
                  <>
                    <span>Join Exam</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Information Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2" />
                How to Join an Exam
              </h3>
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</span>
                  <span>Get the unique exam code from your instructor or institution</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</span>
                  <span>Enter the code exactly as provided (case-sensitive)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">3</span>
                  <span>Click "Join Exam" to verify and access your assessment</span>
                </li>
              </ol>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Important Notes</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Ensure you have a stable internet connection</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Do not refresh the page during the exam</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Have your identification ready if required</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Check all system requirements before starting</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Need Help?</h3>
              <p className="text-blue-600 text-sm">
                If you're experiencing issues joining the exam, please contact your instructor or technical support for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}