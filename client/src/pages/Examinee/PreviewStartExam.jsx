import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ExamineeContext } from "../../context/ExamineeContext";

export default function PreviewStartExam() {
  const navigate = useNavigate();
  const { examineeAttemptExam } = useContext(ExamineeContext);

  if (!examineeAttemptExam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No exam loaded. Please join an exam first</p>
      </div>
    );
  }

  const exam = examineeAttemptExam;
  console.log(exam);
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-600 hover:text-orange-800 mb-6 transition duration-200"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent mb-3">
          {exam.exam_name}
        </h1>
        <p className="text-gray-600 mb-6">{exam.description}</p>

        {/* Exam Info */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            Total Marks: {exam.total_marks}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Time: {exam.total_time_minutes} min
          </span>
          
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
              Negative Marking: {exam.negative_marks_value}
            </span>
        
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
            Questions: {exam.questions.length}
          </span>
        </div>

        {/* Start Exam Button */}
        <div className="text-center">
          <button
            onClick={() =>
              navigate("/runningexam", { state: { exam } })
            }
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition transform hover:scale-105 duration-200 cursor-pointer"
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
}
