import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Edit, BarChart, Trash2 } from "lucide-react";
import mathImg from '../../../public/images/math.png'

export default function ShowExams() {
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
        { 
          question: "Solve for x: 5x = 20", 
          options: ["2", "4", "5", "6"], 
          answer: "4",
          questionImage: null,
          optionImages: [null, null, null, null]
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
          questionImage:mathImg,
          optionImages: [null, null, null, null]
        },
        {
          question: "Identify the circuit diagram",
          options: ["Series", "Parallel", "Complex", "Simple"],
          answer: "Parallel",
          questionImage: mathImg,
          optionImages: [
            "https://via.placeholder.com/80x60/3B82F6/FFFFFF?text=A",
            "https://via.placeholder.com/80x60/10B981/FFFFFF?text=B",
            "https://via.placeholder.com/80x60/8B5CF6/FFFFFF?text=C",
            "https://via.placeholder.com/80x60/F59E0B/FFFFFF?text=D"
          ]
        },
      ],
    },
    {
      id: 3,
      examTitle: "Biology - Cells (Class 11 - C)",
      examDesc: "Cell structure and function exam.",
      totalMarks: 90,
      totalTime: 45,
      negativeMarking: true,
      negativeMarks: 0.5,
      questions: [
        {
          question: "Identify the cell organelle",
          options: ["Mitochondria", "Nucleus", "Chloroplast", "Ribosome"],
          answer: "Mitochondria",
          questionImage: "https://via.placeholder.com/150x100/10B981/FFFFFF?text=Cell+Structure",
          optionImages: [null, null, null, null]
        },
      ],
    },
  ]);

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
            All Exams
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and manage all your created exams in one place.
          </p>
        </div>

        {exams.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-500 text-lg">No exams created yet.</p>
            <Link
              to="/examiner/create-exam"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow-lg transition transform hover:scale-105 duration-300"
            >
              Create Your First Exam
            </Link>
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
                  <Link
                    to={`/examiner/viewexam/${exam.id}`}
                    state={{ exam }}
                    title="View Exam"
                    className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                      to={`/examiner/editexam/${exam._id}`} 
                      state={{ exam }}
                    title="Edit Exam"
                    className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                  >
                    <Edit size={18} />
                  </Link>

                  <Link
                    to={`/examiner/results/${exam.id}`}
                    title="View Results"
                    className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                  >
                    <BarChart size={18} />
                  </Link>

                  <button
                    onClick={() => deleteExam(exam.id)}
                    title="Delete Exam"
                    className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                  >
                    <Trash2 size={18} />
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