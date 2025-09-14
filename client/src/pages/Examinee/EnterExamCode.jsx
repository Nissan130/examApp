import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExamineeContext } from "../../context/ExamineeContext";
import { API_BASE_URL } from "../../utils/api";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Join an Exam</h2>

        <form onSubmit={handleJoinExam} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Exam Code
            </label>
            <input
              type="text"
              value={examineeAttemptExamCode}
              onChange={(e) => setExamineeAttemptExamCode(e.target.value.toUpperCase())}
              placeholder="e.g., X7B9-2K3M"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Get the exam code from your instructor
            </p>
          </div>

          {joinExamError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {joinExamError}
            </div>
          )}

          <button
            type="submit"
            disabled={joinExamLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
          >
            {joinExamLoading ? "Joining Exam..." : "Join Exam"}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">How to join an exam:</h3>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-1">
            <li>Get the exam code from your teacher</li>
            <li>Enter the code in the field above</li>
            <li>Click "Join Exam" to access the exam</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
