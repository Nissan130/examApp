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
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
    <div className="max-w-4xl w-full mx-auto">
      {/* Header Section */}
      <div className="text-center mb-10 mt-12">
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
          Join Your Exam
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Enter your unique exam code to begin your assessment
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-7 border border-slate-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Enter Exam Code</h2>
            <p className="text-slate-600 text-sm">Get the code from your instructor</p>
          </div>

          <form onSubmit={handleJoinExam} className="space-y-5">
            <div>
              <div className="relative">
                <input
                  type="text"
                  value={examineeAttemptExamCode}
                  onChange={(e) => setExamineeAttemptExamCode(e.target.value.toUpperCase())}
                  placeholder="Enter exam code (e.g., ABC123)"
                  className="w-full p-4 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 font-medium tracking-wide outline-none hover:border-slate-400"
                  required
                  autoFocus
                />
                <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
            </div>

            {joinExamError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 font-medium text-sm">{joinExamError}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={joinExamLoading}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-xl flex items-center justify-center space-x-2 group cursor-pointer"
            >
              {joinExamLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Joining Exam...</span>
                </>
              ) : (
                <>
                  <span>Join Exam</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Information Section */}
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              How to Join an Exam
            </h3>
            <ol className="space-y-3">
              <li className="flex items-start">
                <span className="bg-white/20 rounded-lg w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">1</span>
                <span>Get the unique exam code from your instructor</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 rounded-lg w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">2</span>
                <span>Enter the code exactly as provided</span>
              </li>
              <li className="flex items-start">
                <span className="bg-white/20 rounded-lg w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">3</span>
                <span>Click "Join Exam" to verify and access</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Important Notes</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Ensure you have a stable internet connection</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Do not refresh the page during the exam</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Have your identification ready if required</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-teal-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Check all system requirements before starting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}