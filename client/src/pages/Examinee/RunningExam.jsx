import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Timer from "../../components/Timer";
import QuestionCard from "../../components/QuestionCard";

export default function RunningExam({ user }) {
  const { state } = useLocation();
  const exam = state?.exam;
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const questions = exam?.questions || [];

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <p className="text-gray-600 text-lg mb-6">Exam data not found.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition duration-300 flex items-center justify-center mx-auto"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleAnswer = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = () => {
    alert("Exam submitted successfully!");
    navigate("/examinee/dashboard");
  };

  const handleTimeUp = () => {
    alert("Time is up! Submitting exam...");
    handleSubmit();
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 min-h-screen pt-20 px-4 md:px-8 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-md sticky top-16 z-40 border border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{exam.examTitle}</h2>
        </div>

        {/* Timer + Answered Count + Submit */}
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg text-center">
            <Timer duration={exam.totalTime} onTimeUp={handleTimeUp} />
            <div className="text-sm text-gray-700 mt-1">
              Answered: {answeredCount}/{questions.length}
            </div>
          </div>

          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-xl shadow hover:from-green-600 hover:to-teal-600 transition duration-300 font-medium"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* All Questions */}
      <div className="space-y-6 mt-6">
        {questions.map((q, idx) => (
          <QuestionCard
            key={idx}
            number={idx + 1}   // Pass question number
            question={q}
            selected={answers[q.id]}
            onAnswer={handleAnswer}
          />
        ))}
      </div>

{/* Submit Confirmation Modal */}
{showSubmitConfirm && (
  <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
    {/* Glass overlay */}
    <div className="absolute "></div>

    {/* Modal box */}
    <div className="relative bg-gradient-to-br from-yellow-50 to-orange-50 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-md w-full">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Exam?</h3>
      <p className="text-gray-700 mb-6">
        You have answered {answeredCount} out of {questions.length} questions. 
        Are you sure you want to submit your exam?
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={() => setShowSubmitConfirm(false)}
          className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-700 cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 cursor-pointer"
        >
          Submit Exam
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}
