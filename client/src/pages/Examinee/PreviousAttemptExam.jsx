import { useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Trash2 } from "lucide-react";
import mathImg from '../../../public/images/math.png';

export default function PreviousExams() {
  const [exams, setExams] = useState([
    {
      id: 1,
      examTitle: "Math - Algebra (Class 10 - A)",
      examDesc: "Algebra chapter exam for class 10 section A.",
      totalMarks: 100,
      totalTime: 60,
      negativeMarking: true,
      negativeMarks: 1,
      questions: [
        { 
          question: "What is 2 + 2?", 
          options: ["2", "3", "4", "5"], 
          answer: "4",
          questionImage: mathImg,
          optionImages: [null, null, mathImg, null]
        },
      ],
    },
    {
      id: 2,
      examTitle: "Science - Physics (Class 9 - B)",
      examDesc: "Physics chapter 5 exam for class 9 section B.",
      totalMarks: 80,
      totalTime: 50,
      negativeMarking: false,
      negativeMarks: 0,
      questions: [
        {
          question: "What is the speed of light?",
          options: ["3x10^8 m/s", "5x10^8 m/s", "1x10^8 m/s", "7x10^8 m/s"],
          answer: "3x10^8 m/s",
          questionImage: mathImg,
          optionImages: [null, null, null, null]
        },
      ],
    },
  ]);

  // Delete exam
  const deleteExam = (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      setExams(exams.filter((exam) => exam.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Previous Exams
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Previously you have completed these exams.
          </p>
        </div>

        {exams.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-500 text-lg">No exams available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {exam.examTitle}
                </h3>
                <p className="text-gray-600 mb-4">{exam.examDesc}</p>

                <div className="flex flex-wrap gap-2 mb-4 text-sm">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    Marks: {exam.totalMarks}
                  </span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    Time: {exam.totalTime} min
                  </span>
                  {exam.negativeMarking && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                      Negative: {exam.negativeMarks}
                    </span>
                  )}
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                    Questions: {exam.questions.length}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-4">
                  {/* Start Again */}
                  <Link
                    to={`/exam/${exam.id}`}
                    state={{ exam }}
                    title="Start Again"
                    className="flex items-center gap-2 p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition transform hover:scale-105 duration-200"
                  >
                    <RefreshCw size={18} /> Start Again
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => deleteExam(exam.id)}
                    title="Delete Exam"
                    className="flex items-center gap-2 p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition transform hover:scale-105 duration-200"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
