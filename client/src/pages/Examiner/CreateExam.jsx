import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import { Loader } from "lucide-react";
import { useCustomAlert } from "../../context/CustomAlertContext";
import { API_BASE_URL } from "../../utils/api";

export default function CreateExam() {
  const custom_alert = useCustomAlert();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [creating, setCreating] = useState(false);

  // Exam details state
  const [examName, setExamName] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [classes, setClasses] = useState("");
  const [description, setDescription] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [passingMarks, setPassingMarks] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attemptsAllowed, setAttemptsAllowed] = useState("1");
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [negativeMarks, setNegativeMarks] = useState("0.25");
  const [examinerName, setExaminerName] = useState("");

  // Get user
  const { user, token } = useContext(GlobalContext);
  const user_id = user.id;

  // Questions state
  const [questions, setQuestions] = useState([
    {
      question: "",
      questionImage: null,
      questionImagePreview: null,
      options: ["", "", "", ""],
      optionImages: [null, null, null, null],
      optionImagesPreview: [null, null, null, null],
      correctOption: null,
    },
  ]);

  // State for tracking paste operations
  const [activePasteArea, setActivePasteArea] = useState(null);
  const fileInputRefs = useRef({});


  // Handlers for questions and options
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "question") updatedQuestions[index][field] = value;
    else if (field.startsWith("option-")) {
      const optIndex = parseInt(field.split("-")[1]);
      updatedQuestions[index].options[optIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  // Handle selecting correct option
  const handleCorrectOptionChange = (qIndex, optIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctOption = optIndex;
    setQuestions(updatedQuestions);
  };

  // Handle negative marking toggle
  const handleNegativeMarkingToggle = (checked) => {
    setNegativeMarking(checked);
    if (checked && !negativeMarks) {
      setNegativeMarks("0.25");
    }
  };

  // Handle image change
  const handleImageChange = (index, field, file) => {
    if (!file) return;
    const updatedQuestions = [...questions];

    const imageUrl = URL.createObjectURL(file);

    if (field === "questionImage") {
      updatedQuestions[index].questionImage = file;
      updatedQuestions[index].questionImagePreview = imageUrl;
    } else if (field.startsWith("optionImage-")) {
      const optIndex = parseInt(field.split("-")[1]);
      updatedQuestions[index].optionImages[optIndex] = file;
      updatedQuestions[index].optionImagesPreview[optIndex] = imageUrl;
    }

    setQuestions(updatedQuestions);
  };

  // Handle paste image
  // Handle paste image - FIXED VERSION
  const handlePasteImage = (qIndex, field, e) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    setActivePasteArea(`${qIndex}-${field}`);

    // First check for images
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        handleImageChange(qIndex, field, file);
        setTimeout(() => setActivePasteArea(null), 1000);
        return;
      }
    }

    // If no image, handle text paste - FIXED: Get current selection/cursor position
    const text = e.clipboardData.getData("text");

    if (field.startsWith("optionImage-")) {
      const optIndex = parseInt(field.split("-")[1]);
      const currentValue = questions[qIndex].options[optIndex];
      const target = e.target;

      if (target && target.selectionStart !== undefined) {
        // For input fields - insert at cursor position
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
        handleQuestionChange(qIndex, `option-${optIndex}`, newValue);

        // Set cursor position after the pasted text
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + text.length;
        }, 0);
      } else {
        // Fallback: append to existing text
        handleQuestionChange(qIndex, `option-${optIndex}`, currentValue + text);
      }
    } else if (field === "questionImage") {
      const currentValue = questions[qIndex].question;
      const target = e.target;

      if (target && target.selectionStart !== undefined) {
        // For textarea - insert at cursor position
        const start = target.selectionStart;
        const end = target.selectionEnd;
        const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
        handleQuestionChange(qIndex, "question", newValue);

        // Set cursor position after the pasted text
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + text.length;
        }, 0);
      } else {
        // Fallback: append to existing text
        handleQuestionChange(qIndex, "question", currentValue + text);
      }
    }

    setTimeout(() => setActivePasteArea(null), 500);
  };

  // Remove image
  const removeImage = (index, field) => {
    const updatedQuestions = [...questions];
    if (field === "questionImage") {
      updatedQuestions[index].questionImage = null;
      updatedQuestions[index].questionImagePreview = null;
    } else if (field.startsWith("optionImage-")) {
      const optIndex = parseInt(field.split("-")[1]);
      updatedQuestions[index].optionImages[optIndex] = null;
      updatedQuestions[index].optionImagesPreview[optIndex] = null;
    }
    setQuestions(updatedQuestions);
  };

  // Trigger file input programmatically
  const triggerFileInput = (qIndex, field) => {
    const key = `${qIndex}-${field}`;
    if (fileInputRefs.current[key]) {
      fileInputRefs.current[key].click();
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        questionImage: null,
        questionImagePreview: null,
        options: ["", "", "", ""],
        optionImages: [null, null, null, null],
        optionImagesPreview: [null, null, null, null],
        correctOption: null,
      },
    ]);
  };

  const deleteQuestion = (qIndex) => setQuestions(questions.filter((_, i) => i !== qIndex));

  // Check if question is filled (either text or image)
  const isQuestionFilled = (q) => {
    return q.question.trim() !== "" || q.questionImage !== null;
  };

  // Check if option is filled (either text or image)
  const isOptionFilled = (opt, optImage) => {
    return opt.trim() !== "" || optImage !== null;
  };

  // Check if all questions and options are filled
  const isQuestionsValid = () => {
    return questions.every(q => {
      const hasQuestion = isQuestionFilled(q);
      const hasAllOptions = q.options.every((opt, index) => isOptionFilled(opt, q.optionImages[index]));
      const hasCorrectOption = q.correctOption !== null;

      return hasQuestion && hasAllOptions && hasCorrectOption;
    });
  };

  // Handle create exam
  const handleCreateExam = async () => {
    if (!isQuestionsValid()) {
      custom_alert.error("Please fill all questions, options, and mark correct answers before creating the exam.");
      return;
    }

    try {
      setCreating(true);
      const formData = new FormData();

      const examData = {
        exam_name: examName,
        subject,
        class_name: classes,
        chapter,
        description,
        total_marks: parseFloat(totalMarks),
        passing_marks: passingMarks ? parseFloat(passingMarks) : null,
        total_time_minutes: parseFloat(totalTime),
        start_datetime: startDate && startTime ? `${startDate}T${startTime}:00` : null,
        end_datetime: endDate && endTime ? `${endDate}T${endTime}:00` : null,
        attempts_allowed: attemptsAllowed,
        negative_marks_value: negativeMarking ? parseFloat(negativeMarks) : 0,
        examiner_name: examinerName,
        questions: questions.map((q, qIdx) => ({
          question_text: q.question,
          question_order: qIdx + 1,
          marks: 1,
          optA_text: q.options[0],
          optB_text: q.options[1],
          optC_text: q.options[2],
          optD_text: q.options[3],
          correct_answer: ["A", "B", "C", "D"][q.correctOption]
        }))
      };

      formData.append("exam_data", JSON.stringify(examData));

      // Append question images
      questions.forEach((q, qIdx) => {
        if (q.questionImage) {
          formData.append(`question_${qIdx + 1}_image`, q.questionImage);
        }

        // Append option images
        q.optionImages.forEach((optImg, optIdx) => {
          if (optImg) {
            const optionLetter = ["A", "B", "C", "D"][optIdx];
            formData.append(`question_${qIdx + 1}_opt${optionLetter}_image`, optImg);
          }
        });
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/examiner/create-exam`,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        }
      );

      if (response.data.status === "success") {
        custom_alert.success("Exam created successfully!")
        navigate("/examiner/all-created-exam");
      } else {
        custom_alert.error("Failed to create exam: " + response.data.message);
      }
    } catch (err) {
      console.error("Error creating exam:", err);
      if (err.response && err.response.status === 401) {
        custom_alert.error("Authentication failed. Please log in again.");
      } else {
        custom_alert.error("Failed to create exam. Please try again.");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleCancelExam = () => {
    custom_alert.confirm(
      "Cancel Exam Creation",
      "Are you sure you want to cancel? All unsaved changes will be lost.",
      () => navigate(-1)
    );
  };

  // Validation for required fields
  const isDetailsValid = examName && subject && chapter && classes && totalMarks && totalTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-12">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
            Create New Exam
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Design your custom exam with questions, options, and images
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-8 bg-white rounded-2xl shadow-lg p-1">
          <button
            className={`flex-1 py-4 px-6 font-semibold text-base flex items-center justify-center rounded-xl transition-all duration-300 ${activeTab === "details"
              ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
              : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
              }`}
            onClick={() => setActiveTab("details")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exam Details
          </button>
          <button
            className={`flex-1 py-4 px-6 font-semibold text-base flex items-center justify-center rounded-xl transition-all duration-300 ${activeTab === "questions"
              ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
              : `text-slate-600 hover:text-slate-800 hover:bg-slate-50 ${!isDetailsValid ? 'opacity-50 cursor-not-allowed' : ''}`
              }`}
            onClick={() => isDetailsValid && setActiveTab("questions")}
            disabled={!isDetailsValid}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Questions
            {!isDetailsValid && (
              <span className="ml-2 text-xs text-red-500">(Complete details first)</span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 transition-all duration-300 hover:shadow-2xl">
          {activeTab === "details" ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                Exam Details
              </h2>

              {/* Required Fields */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Required Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Exam Name*", value: examName, setter: setExamName },
                    { label: "Subject/Course Name*", value: subject, setter: setSubject },
                    { label: "Chapter/Topic*", value: chapter, setter: setChapter },
                    { label: "Class/Section*", value: classes, setter: setClasses },
                    { label: "Total Marks*", value: totalMarks, setter: setTotalMarks, type: "number" },
                    { label: "Total Time (minutes)*", value: totalTime, setter: setTotalTime, type: "number" },
                  ].map((item, i) => (
                    <div key={i} className="relative">
                      <input
                        type={item.type || "text"}
                        placeholder={item.label}
                        value={item.value}
                        onChange={(e) => item.setter(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500 hover:border-slate-300"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Description / Instructions</label>
                <textarea
                  placeholder="Enter exam instructions or description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all duration-200 text-slate-900 placeholder-slate-500 hover:border-slate-300"
                />
              </div>

              {/* Additional Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Passing Marks</label>
                    <input
                      type="text"
                      placeholder="e.g., Pass mark 40%"
                      value={passingMarks}
                      onChange={(e) => setPassingMarks(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500 hover:border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Examiner Name</label>
                    <input
                      type="text"
                      placeholder="Enter examiner name"
                      value={examinerName}
                      onChange={(e) => setExaminerName(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500 hover:border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Start Date & Time</label>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900"
                      />
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">End Date & Time</label>
                    <div className="flex gap-3">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900"
                      />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">Attempts Allowed</label>
                    <select
                      value={attemptsAllowed}
                      onChange={(e) => setAttemptsAllowed(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900"
                    >
                      <option value="1">Single attempt</option>
                      <option value="multiple">Multiple attempts</option>
                      <option value="unlimited">Unlimited attempts</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Negative Marking */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200 mb-6">
                <label className="flex items-center gap-3 font-semibold text-slate-700 text-sm">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={negativeMarking}
                      onChange={(e) => handleNegativeMarkingToggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </div>
                  Negative marking for each wrong answer
                </label>
                {negativeMarking && (
                  <div className="sm:ml-auto">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 0.25"
                      value={negativeMarks}
                      onChange={(e) => setNegativeMarks(e.target.value)}
                      className="p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-40 transition duration-200 text-sm text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="flex justify-end mt-8">
                <button
                  onClick={() => setActiveTab("questions")}
                  disabled={!isDetailsValid}
                  className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center text-base"
                >
                  Next: Questions & Options
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center justify-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Create Questions
              </h2>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-5 mb-8">
                <h3 className="font-semibold text-amber-800 flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Instructions
                </h3>
                <ul className="text-amber-700 text-sm list-disc pl-5 space-y-2">
                  <li>Fill all question texts and options (either text or image)</li>
                  <li>Click the radio button next to the correct option to mark it as the right answer</li>
                  <li>Add images to questions or options if needed (optional)</li>
                </ul>
              </div>

              {/* Questions Section */}
              <div className="space-y-6">
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-xl font-bold text-slate flex items-center bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        Question {qIndex + 1}
                      </h3>
                      {questions.length > 1 && (
                        <button
                          onClick={() => deleteQuestion(qIndex)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition duration-200 shadow-sm"
                          title="Delete question"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>


                    {/* Question Input - FIXED */}
                    <div className="mb-5">
                      <div
                        className={`p-4 bg-white border-2 ${!isQuestionFilled(q) ? "border-red-300" : "border-slate-300"} rounded-xl focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition duration-200 ${activePasteArea === `${qIndex}-questionImage` ? 'ring-2 ring-teal-500 border-teal-400' : ''}`}
                        onPaste={(e) => handlePasteImage(qIndex, "questionImage", e)}
                      >
                        <textarea
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                          rows={3}
                          placeholder="Type your question here or paste an image with Ctrl+V..."
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-slate-900 placeholder-slate-500 text-base"
                          required
                        />
                      </div>
                      {!isQuestionFilled(q) && (
                        <p className="text-red-500 text-sm mt-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Question text or image is required
                        </p>
                      )}
                    </div>


                    {/* Question Image - FIXED */}
                    <div className="mb-6">
                      {q.questionImage ? (
                        <div className="relative inline-block">
                          <img src={q.questionImagePreview} alt="question" className="w-40 h-40 object-contain border-2 border-teal-200 rounded-xl shadow-lg" />
                          <button
                            onClick={() => removeImage(qIndex, "questionImage")}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition duration-200 transform hover:scale-110"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 flex-wrap">
                          <button
                            onClick={() => triggerFileInput(qIndex, "questionImage")}
                            className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center transition duration-200 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-lg cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Image
                          </button>
                          <input
                            type="file"
                            accept="image/*"
                            ref={el => fileInputRefs.current[`${qIndex}-questionImage`] = el}
                            onChange={(e) => handleImageChange(qIndex, "questionImage", e)}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-slate mb-4 flex items-center bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        Options * (Select the correct one)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, optIndex) => (
                          <div key={optIndex} className="bg-white p-5 rounded-xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm font-semibold text-slate-700">Option {optIndex + 1}</label>
                              <label className="flex items-center text-sm font-semibold text-green-600 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`correct-option-${qIndex}`}
                                  checked={q.correctOption === optIndex}
                                  onChange={() => handleCorrectOptionChange(qIndex, optIndex)}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-slate-300 rounded cursor-pointer"
                                />
                                <span className="ml-2">Correct</span>
                              </label>
                            </div>
                            {/* Options Input - FIXED */}
                            <div
                              className={`mb-4 ${activePasteArea === `${qIndex}-optionImage-${optIndex}` ? 'ring-2 ring-teal-500 rounded-lg p-2' : ''}`}
                              onPaste={(e) => handlePasteImage(qIndex, `optionImage-${optIndex}`, e)}
                            >
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleQuestionChange(qIndex, `option-${optIndex}`, e.target.value)}
                                placeholder='Type text or paste image'
                                className={`w-full p-3 bg-slate-50 border-2 ${!isOptionFilled(opt, q.optionImages[optIndex]) ? "border-red-300" : "border-slate-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-500`}
                                required
                              />
                              {!isOptionFilled(opt, q.optionImages[optIndex]) && (
                                <p className="text-red-500 text-xs mt-2 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Option text or image is required
                                </p>
                              )}
                            </div>

                            {/* option image  */}
                            <div className="mt-3">
                              {q.optionImages[optIndex] ? (
                                <div className="relative inline-block">
                                  <img src={q.optionImagesPreview[optIndex]} alt={`option-${optIndex}`} className="w-24 h-24 object-contain border-2 border-teal-200 rounded-lg shadow-md" />
                                  <button
                                    onClick={() => removeImage(qIndex, `optionImage-${optIndex}`)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition duration-200 transform hover:scale-110"
                                    title="Remove image"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => triggerFileInput(qIndex, `optionImage-${optIndex}`)}
                                  className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center transition duration-200 bg-teal-50 hover:bg-teal-100 px-3 py-2 rounded-lg cursor-pointer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Add image
                                </button>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                ref={el => fileInputRefs.current[`${qIndex}-optionImage-${optIndex}`] = el}
                                onChange={(e) => handleImageChange(qIndex, `optionImage-${optIndex}`, e)}
                                className="hidden"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      {q.correctOption === null && (
                        <p className="text-red-500 text-sm mt-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Please select the correct option
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Question Button */}
                <button
                  onClick={addQuestion}
                  className="w-full bg-gradient-to-r from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 text-teal-700 font-semibold py-4 rounded-xl transition-all duration-300 flex items-center justify-center mt-6 text-base border-2 border-dashed border-teal-200 hover:border-teal-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Question
                </button>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-wrap gap-4 justify-between mt-10">
                <button
                  onClick={() => setActiveTab("details")}
                  className="bg-slate-500 hover:bg-slate-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center text-base cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Details
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={handleCancelExam}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center text-base cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Exam
                  </button>
                  <button
                    onClick={handleCreateExam}
                    disabled={!isQuestionsValid() || creating}
                    className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-base min-w-[140px] cursor-pointer"
                  >
                    {creating ? (
                      <>
                        <Loader className="animate-spin h-5 w-5 mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Create Exam
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}