import { useState, useContext } from "react";
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
  const custom_alert= useCustomAlert();

  console.log("user token: ", token);
  
  // Prefer context exam, fallback to state
  const exam = examineeAttemptExam || state?.exam;

  const [answers, setAnswers] = useState({});
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const questions = exam?.questions || [];

  console.log("exam",exam);
  

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">Exam data not found, Please join an exam first.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition duration-300 flex items-center justify-center mx-auto text-sm"
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

  const negative_marks = exam.negative_marking_value
  console.log("negative_mark:", negative_marks);
  

 // In your RunningExam component's handleSubmit function
const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    // Map questions to include options, correct answer, and user selected answer
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
      negative_marking_value: negative_marks,
      total_time_minutes: exam.total_time_minutes,
      time_taken_minutes: timeTaken,
      questions: questionsPayload
    };
    console.log("payload",payload);
    

    const response = await axios.post(
      `${API_BASE_URL}/api/examinee/attempt-exam-result`,
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
      
      // Navigate directly to result details with the complete response data
      navigate("/examinee/attempt-exam/result-details", {
        state: {
          examResult: response.data.attempt_result,
          examDetails: response.data.exam_details,
          questions: response.data.questions,
          timeTaken: timeTaken,
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

  const handleTimeUpdate = (minutesElapsed) => {
    setTimeTaken(minutesElapsed);
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-28 px-4 md:px-6 pb-8">
      {/* Fixed Header */}
      <div className="fixed top-16 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0">
              <h2 className="text-lg font-semibold text-gray-800">{exam.exam_name}</h2>
              <p className="text-gray-500 text-xs mt-1">Answer all questions to complete the exam</p>
            </div>

            {/* Timer + Answered Count + Submit */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-md text-center">
                <div className="flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Timer
                    duration={exam.total_time_minutes}
                    onTimeUp={handleTimeUp}
                    onTimeUpdate={handleTimeUpdate}
                  />
                </div>
                <div className="text-xs text-blue-700 mt-1 flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Answered: {answeredCount}/{questions.length}
                </div>
              </div>

              <button
                onClick={() => setShowSubmitConfirm(true)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-3 rounded-md shadow hover:from-blue-700 hover:to-indigo-700 transition duration-300 font-medium flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      <div className="max-w-6xl mx-auto mt-12">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Question Navigation */}
          <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-xs border border-gray-100 h-fit lg:sticky lg:top-28">
            <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2 text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Questions
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <a
                  key={q.question_id}
                  href={`#question-${q.question_id}`}
                  className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium transition-all
                    ${answers[q.question_id] ? 'bg-green-100 text-green-700 border border-green-200' :
                      'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'}`}
                >
                  {idx + 1}
                </a>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                <span className="text-xs text-gray-600">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300"></div>
                <span className="text-xs text-gray-600">Not Answered</span>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="w-full lg:w-3/4">
            <div className="space-y-4">
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
        <div className="fixed inset-0 flex  items-center justify-center z-50 p-4 bg-opacity-50 backdrop-blur-sm">
          <div className="bg-blue-100 p-5 rounded-lg shadow-lg max-w-md w-full border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Submit Exam?</h3>
            <p className="text-gray-600 text-center mb-5 text-sm ">
              You have answered {answeredCount} out of {questions.length} questions.
              Are you sure you want to submit your exam?
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-400 text-white rounded-md hover:bg-red-400 transition-colors font-medium text-sm cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm cursor-pointer disabled:opacity-50"
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