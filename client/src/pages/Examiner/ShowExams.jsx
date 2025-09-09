import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, BarChart, Trash2, Copy, Check } from "lucide-react";
import mathImg from '../../../public/images/math.png'

// Reusable Tooltip Component
const Tooltip = ({ children, text }) => (
  <div className="relative group">
    {children}
    <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap transition-opacity duration-200 z-50">
      {text}
    </span>
  </div>
);

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
        { question: "What is 2 + 2?", options: ["2", "3", "4", "5"], answer: "4", questionImage: mathImg, optionImages: [null, null, mathImg, null] },
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
        { question: "What is the speed of light?", options: ["3x10^8 m/s", "5x10^8 m/s", "1x10^8 m/s", "7x10^8 m/s"], answer: "3x10^8 m/s", questionImage: mathImg, optionImages: [null, null, null, null] },
      ],
    },
  ]);

  const [copiedExamId, setCopiedExamId] = useState(null); // track copied exam

  const deleteExam = (id) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      setExams(exams.filter((exam) => exam.id !== id));
    }
  };

  const copyExamLink = (id) => {
    const link = `${window.location.origin}/exam/${id}`;
    navigator.clipboard.writeText(link)
      .then(() => {
        setCopiedExamId(id);
        setTimeout(() => setCopiedExamId(null), 2000); // revert icon after 2s
      })
      .catch(() => alert("Failed to copy link."));
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
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-300 relative"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {exam.examTitle}
                </h3>
                <p className="text-gray-600 mb-4">{exam.examDesc}</p>

                <div className="flex flex-wrap gap-2 mb-4 text-sm">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">Marks: {exam.totalMarks}</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Time: {exam.totalTime} min</span>
                  {exam.negativeMarking && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">Negative: {exam.negativeMarks}</span>
                  )}
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">Questions: {exam.questions.length}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-4 flex-wrap gap-2">
                  <Tooltip text="View Exam">
                    <Link
                      to={`/examiner/viewexam/${exam.id}`}
                      state={{ exam }}
                      className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                    >
                      <Eye size={18} />
                    </Link>
                  </Tooltip>

                  <Tooltip text="View Results">
                    <Link
                      to={`/examiner/results/${exam.id}`}
                      className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                    >
                      <BarChart size={18} />
                    </Link>
                  </Tooltip>

                  <Tooltip text="Copy Exam Link">
                    <button
                      onClick={() => copyExamLink(exam.id)}
                      className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                    >
                      {copiedExamId === exam.id ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </Tooltip>

                  <Tooltip text="Delete Exam">
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition transform hover:scale-110 duration-200 flex items-center justify-center"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
