import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Timer from "../../components/Timer";
import RunningExamQuestionCard from "../../components/RunningExamQuestionCard";
import { ExamineeContext } from "../../context/ExamineeContext";
import { GlobalContext } from "../../context/GlobalContext";
import { useCustomAlert } from "../../context/CustomAlertContext";
import axios from "axios";
import { API_BASE_URL } from "../../utils/api";

export default function RunningExam() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { examineeAttemptExam } = useContext(ExamineeContext);
  const { token } = useContext(GlobalContext);
  const custom_alert = useCustomAlert();

  // Prefer context exam, fallback to state
  const exam = examineeAttemptExam || state?.exam;

  const [answers, setAnswers] = useState({});
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const questions = exam?.questions || [];

    // Add this useEffect to scroll to top on component mount
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-200">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-slate-600 mb-6">Exam data not found. Please join an exam first.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-medium"
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

  const handleClearAnswer = (id) => {
    const newAnswers = { ...answers };
    delete newAnswers[id];
    setAnswers(newAnswers);
  };

  const handleTimeUpdate = (minutesElapsed) => {
    const newTimeTaken = minutesElapsed * 60;
    setTimeTaken(newTimeTaken);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const questionsPayload = exam.questions.map(q => ({
        question_id: q.question_id,
        question_text: q.question_text,
        question_image_url: q.question_image_url || null,
        question_image_id: q.question_image_id || null,
        marks: q.marks || 1,
        correct_answer: q.correct_answer,
        options: Object.entries(q.options).map(([letter, opt]) => ({
          option_letter: letter,
          option_text: opt.text,
          option_image_url: opt.image_url || null,
          option_image_id: opt.image_id || null,
          is_correct: q.correct_answer === letter,
          selected_by_user: answers[q.question_id] === letter
        }))
      }));

      const payload = {
        exam_id: exam.exam_id,
        exam_name: exam.exam_name,
        exam_code: exam.exam_code,
        subject: exam.subject,
        chapter: exam.chapter,
        class_name: exam.class_name,
        total_marks: exam.total_marks,
        total_time_minutes: exam.total_time_minutes,
        examiner_name: exam.examiner_name,
        negative_marks_value: exam.negative_marks_value,
        time_taken_seconds: timeTaken,
        questions: questionsPayload
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/examinee/submit-exam`,
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.status === 'success') {
        custom_alert.success("Exam submitted successfully!");

        navigate("/examinee/attempt-exam/result-details", {
          state: {
            examResult: response.data.attempt_exam,
            examDetails: response.data.exam_details,
            questions: response.data.questions,
            timeTaken: response.data.attempt_exam.time_taken_seconds,
          }
        });
      } else {
        throw new Error(response.data.message || 'Failed to submit exam');
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error submitting exam: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    custom_alert.warning("Time is up! Submitting exam...");
    handleSubmit();
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-28 px-4 md:px-6 pb-8">

      {/* Exam Name - Scrolls normally on small screens */}
      <div className="md:hidden bg-white py-4 px-4 shadow-sm border-b border-slate-200 mt-18">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold text-slate-900">{exam.exam_name}</h2>
        </div>
      </div>

      {/* Fixed Header - Only Timer and Submit */}
      <div className="fixed top-16 left-0 right-0 z-50 bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Exam Name - Hidden on mobile, shown on desktop */}
            <div className="hidden md:block">
              <h2 className="text-xl font-semibold text-slate-900">{exam.exam_name}</h2>
            </div>

            {/* Timer + Answered Count + Submit - Always fixed */}
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-normal">
              <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-center shadow-sm">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Timer
                    duration={exam.total_time_minutes}
                    onTimeUp={handleTimeUp}
                    onTimeUpdate={handleTimeUpdate}
                  />
                </div>
                <div className="text-sm text-slate-700 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Answered: {answeredCount}/{questions.length}
                </div>
              </div>

              <button
                onClick={() => setShowSubmitConfirm(true)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-6xl mx-auto mt-6 md:mt-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Question Navigation */}
          <div className="w-full lg:w-1/4 bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-fit lg:sticky lg:top-28">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Questions
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => (
                <a
                  key={q.question_id}
                  href={`#question-${q.question_id}`}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-200 hover:scale-105
                    ${answers[q.question_id]
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'}`}
                >
                  {idx + 1}
                </a>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-teal-500 to-cyan-600"></div>
                <span className="text-sm text-slate-600">Answered</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-slate-100 border border-slate-300"></div>
                <span className="text-sm text-slate-600">Not Answered</span>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="w-full lg:w-3/4">
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.question_id} id={`question-${q.question_id}`}>
                  <RunningExamQuestionCard
                    number={idx + 1}
                    question={q}
                    selected={answers[q.question_id]}
                    onAnswer={handleAnswer}
                    onClearAnswer={handleClearAnswer}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-whitw-100 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 text-center mb-3">Submit Exam?</h3>
            <p className="text-slate-600 text-center mb-6">
              You have answered {answeredCount} out of {questions.length} questions.
              Are you sure you want to submit your exam?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all duration-200 font-medium cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-xl hover:from-teal-700 hover:to-cyan-800 transition-all duration-200 font-medium cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}