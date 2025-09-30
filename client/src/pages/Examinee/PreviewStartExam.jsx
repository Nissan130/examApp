import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Award, AlertCircle, BookOpen } from "lucide-react";
import { ExamineeContext } from "../../context/ExamineeContext";

export default function PreviewStartExam() {
  const navigate = useNavigate();
  const { examineeAttemptExam } = useContext(ExamineeContext);

  if (!examineeAttemptExam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No exam loaded. Please join an exam first.</p>
      </div>
    );
  }

  const exam = examineeAttemptExam;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-200 mt-10">
          {/* Exam Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              {exam.exam_name}
            </h1>
            <p className="text-slate-600 text-lg">{exam.description}</p>
          </div>

          {/* Exam Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
              <Award className="w-6 h-6 text-teal-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-1">Total Marks</p>
              <p className="text-xl font-semibold text-slate-900">{exam.total_marks}</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
              <Clock className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-1">Duration</p>
              <p className="text-xl font-semibold text-slate-900">{exam.total_time_minutes} min</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
              <AlertCircle className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-1">Negative Marking</p>
              <p className="text-xl font-semibold text-slate-900">{exam.negative_marks_value}</p>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
              <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-1">Questions</p>
              <p className="text-xl font-semibold text-slate-900">{exam.questions.length}</p>
            </div>
          </div>

          {/* Subject & Chapter Info */}
          {(exam.subject || exam.chapter || exam.class) && (
            <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exam.class && (
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-1">Class</p>
                    <p className="text-lg font-semibold text-slate-900">{exam.class}</p>
                  </div>
                )}
                {exam.subject && (
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-1">Subject</p>
                    <p className="text-lg font-semibold text-slate-900">{exam.subject}</p>
                  </div>
                )}
                {exam.chapter && (
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-1">Chapter</p>
                    <p className="text-lg font-semibold text-slate-900">{exam.chapter}</p>
                  </div>
                )}
                {exam.class_name && (
                  <div className="text-center">
                    <p className="text-sm text-slate-600 mb-1">Class</p>
                    <p className="text-lg font-semibold text-slate-900">{exam.class_name}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-amber-50 rounded-2xl p-6 mb-8 border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-900 mb-3">Important Instructions</h3>
            <ul className="text-amber-800 space-y-2 text-sm">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Ensure you have a stable internet connection throughout the exam</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                <span>Do not refresh or close the browser during the exam</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                <span>All questions are mandatory unless specified otherwise</span>
              </li>
              {exam.negative_marks_value > 0 && (
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
                  <span>Negative marking applies for incorrect answers</span>
                </li>
              )}
            </ul>
          </div>

          {/* Start Exam Button */}
          <div className="text-center">
            <button
              onClick={() => navigate("/runningexam", { state: { exam } })}
              className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-semibold px-12 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl cursor-pointer text-lg"
            >
              Start Exam Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}