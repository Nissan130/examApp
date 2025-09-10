import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import image from '../../../public/logo.png'
import image1 from '../../../public/images/math.png'

export default function PreviewStartExam() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Demo exam data with images
  const demoExam = {
    id: 1,
    examTitle: "Math - Algebra (Class 10)",
    examDesc: "This exam covers algebra topics including equations, inequalities, and polynomials.",
    totalMarks: 100,
    totalTime: 60, // in minutes
    negativeMarking: true,
    negativeMarks: 1,
    questions: [
      {
        id: 1,
        question: "What is 2 + 2?",
        questionImage: image, // optional image URL
        options: ["2", "3", "4", "5"],
        optionImages: [image1, "", "", ""], // optional image URLs for options
        answer: "4"
      },
      {
        id: 2,
        question: "Solve for x: 3x + 5 = 20",
        questionImage: "", // can be an image like a screenshot of equation
        options: ["5", "10", "15", "20"],
        optionImages: ["", "", "", ""],
        answer: "5"
      },
      {
        id: 3,
        question: "Which of the following is a polynomial?",
        questionImage: "",
        options: ["2x + 3", "√x + 1", "1/x + 2", "ln(x)"],
        optionImages: ["", "", "", ""],
        answer: "2x + 3"
      },
      {
        id: 4,
        question: "Identify the graph of y = x²",
        questionImage: image, // Example image
        options: ["Graph A", "Graph B", "Graph C", "Graph D"],
        optionImages: ["", "", "", ""],
        answer: "Graph B"
      },
            {
        id: 5,
        question: "Identify the graph of y = x²",
        questionImage: image, // Example image
        options: ["Graph A", "Graph B", "Graph C", "Graph D"],
        optionImages: ["", "", "", ""],
        answer: "Graph B"
      },
            {
        id: 6,
        question: "Identify the graph of y = x²",
        questionImage: image, // Example image
        options: ["Graph A", "Graph B", "Graph C", "Graph D"],
        optionImages: ["", "", "", ""],
        answer: "Graph B"
      },
    ]
  };

  // Use state exam or demo
  const exam = state?.exam || demoExam;

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
          {exam.examTitle}
        </h1>
        <p className="text-gray-600 mb-6">{exam.examDesc}</p>

        {/* Exam Info */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            Total Marks: {exam.totalMarks}
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            Time: {exam.totalTime} min
          </span>
          {exam.negativeMarking && (
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
              Negative Marking: {exam.negativeMarks}
            </span>
          )}
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
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition transform hover:scale-105 duration-200"
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
}
