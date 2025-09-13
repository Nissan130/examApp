import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext } from "react";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import { Loader } from "lucide-react";
import { useCustomAlert } from "../../context/CustomAlertContext";

export default function CreateExam() {
  const custom_alert = useCustomAlert();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [creating, setCreating] = useState(false); // Loading state for create exam

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
  const [negativeMarks, setNegativeMarks] = useState("0.25"); // Default to 0.25
  const [examinerName, setExaminerName] = useState("");

  // Get user
  const { user, token } = useContext(GlobalContext);
  const user_id = user.id;

  const [createdExamCode, setCreatedExamCode] = useState(null);
  const [createdExamLink, setCreatedExamLink] = useState(null);

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

  const examTitle = `${examName}${chapter ? " - " + chapter : ""}${subject ? " (" + subject : ""}${subject ? ")" : ""}`;

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
      setNegativeMarks("0.25"); // Set default value when enabling
    }
  };

  // Handle image change
  const handleImageChange = (index, field, file) => {
    if (!file) return;
    const updatedQuestions = [...questions];

    const imageUrl = URL.createObjectURL(file); // For preview

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
  const handlePasteImage = (qIndex, field, e) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    setActivePasteArea(`${qIndex}-${field}`);

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        handleImageChange(qIndex, field, file);
        setTimeout(() => setActivePasteArea(null), 1000);
        return;
      }
    }

    // If no image, fallback to text
    const text = e.clipboardData.getData("text");
    if (field.startsWith("optionImage-")) {
      const optIndex = parseInt(field.split("-")[1]);
      handleQuestionChange(qIndex, `option-${optIndex}`, text);
    } else {
      handleQuestionChange(qIndex, field, text);
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
      alert("Please fill all questions, options, and mark correct answers before creating the exam.");
      return;
    }

    try {
      setCreating(true);
      const formData = new FormData();

      // Prepare JSON data for exam + questions + options
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
        "http://127.0.0.1:5000/api/exam/create-exam",
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
        alert("Failed to create exam: " + response.data.message);
      }
    } catch (err) {
      console.error("Error creating exam:", err);
      if (err.response && err.response.status === 401) {
        alert("Authentication failed. Please log in again.");
      } else {
        alert("Failed to create exam. See console for details.");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleCancelExam = () => {
    if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      navigate(-1);
    }
  };

  // Validation for required fields
  const isDetailsValid = examName && subject && chapter && classes && totalMarks && totalTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Exam
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Design your custom exam with questions, options, and images
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-5 font-medium text-base flex items-center ${activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
            onClick={() => setActiveTab("details")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exam Details
          </button>
          <button
            className={`py-3 px-5 font-medium text-base flex items-center ${activeTab === "questions" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"} ${!isDetailsValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => isDetailsValid && setActiveTab("questions")}
            disabled={!isDetailsValid}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Questions
            {!isDetailsValid && (
              <span className="ml-2 text-xs text-red-500">(Complete details first)</span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          {activeTab === "details" ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
                Exam Details
              </h2>

              {/* Required Fields */}
              <div className="mb-4">
                <h3 className="text-base font-medium text-gray-800 mb-3">Required Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description / Instructions</label>
                <textarea
                  placeholder="Enter exam instructions or description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-200 text-sm"
                />
              </div>

              {/* Additional Details */}
              <div className="mb-4">
                <h3 className="text-base font-medium text-gray-800 mb-3">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passing Marks</label>
                    <input
                      type="text"
                      placeholder="e.g., Pass mark 40%"
                      value={passingMarks}
                      onChange={(e) => setPassingMarks(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
                    <input
                      type="text"
                      placeholder="Enter examiner name"
                      value={examinerName}
                      onChange={(e) => setExaminerName(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                      />
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                      />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attempts Allowed</label>
                    <select
                      value={attemptsAllowed}
                      onChange={(e) => setAttemptsAllowed(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                    >
                      <option value="1">Single attempt</option>
                      <option value="multiple">Multiple attempts</option>
                      <option value="unlimited">Unlimited attempts</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mb-4">
                <p className="text-xs font-medium text-blue-800">
                  <span className="font-semibold">Exam Title:</span> {examTitle || "Your exam title will appear here"}
                </p>
              </div>

              {/* Negative Marking */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
                <label className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={negativeMarking}
                      onChange={(e) => handleNegativeMarkingToggle(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
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
                      className="p-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-40 transition duration-200 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Next Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setActiveTab("questions")}
                  disabled={!isDetailsValid}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300 flex items-center text-sm"
                >
                  Next: Questions & Options
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center justify-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Create Questions
              </h2>

              {/* Instructions */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-yellow-800 flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Instructions
                </h3>
                <ul className="text-yellow-700 text-sm list-disc pl-5 space-y-1">
                  <li>Fill all question texts and options (either text or image)</li>
                  <li>Click the radio button next to the correct option to mark it as the right answer</li>
                  <li>Add images to questions or options if needed (optional)</li>
                </ul>
              </div>

              {/* Questions Section */}
              <div className="space-y-6">
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        Question {qIndex + 1}
                      </h3>
                      {questions.length > 1 && (
                        <button
                          onClick={() => deleteQuestion(qIndex)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition duration-200"
                          title="Delete question"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Question Input */}
                    <div className="mb-4">
                      <div
                        className={`p-3 bg-white border ${!isQuestionFilled(q) ? "border-red-300" : "border-gray-300"} rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition duration-200 ${activePasteArea === `${qIndex}-questionImage` ? 'ring-2 ring-blue-500' : ''}`}
                        onPaste={(e) => handlePasteImage(qIndex, "questionImage", e)}
                      >
                        <textarea
                          value={q.question}
                          onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                          rows={3}
                          placeholder="Type your question here or paste an image with Ctrl+V..."
                          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none text-sm"
                          required
                        />
                      </div>
                      {!isQuestionFilled(q) && (
                        <p className="text-red-500 text-xs mt-1">Question text or image is required</p>
                      )}
                    </div>

                    {/* Question Image */}
                    <div className="mb-6">
                      {q.questionImage ? (
                        <div className="relative inline-block">
                          <img src={q.questionImagePreview} alt="question" className="w-32 h-32 object-contain border rounded-lg shadow-sm" />
                          <button
                            onClick={() => removeImage(qIndex, "questionImage")}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition duration-200"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 flex-wrap">
                          <label className="cursor-pointer bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition duration-200 shadow-sm flex items-center text-xs"
                            onClick={() => triggerFileInput(qIndex, "questionImage")}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Upload Question Image
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(qIndex, "questionImage", e.target.files[0])} className="hidden" />
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Options */}
                    <div className="mb-6">
                      <h4 className="text-base font-medium text-gray-800 mb-3 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-purple-500"
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
                          <div key={optIndex} className="bg-white p-4 rounded-lg border border-gray-300">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-gray-700">Option {optIndex + 1}</label>
                              <label className="flex items-center text-sm text-green-600 font-medium">
                                <input
                                  type="radio"
                                  name={`correct-option-${qIndex}`}
                                  checked={q.correctOption === optIndex}
                                  onChange={() => handleCorrectOptionChange(qIndex, optIndex)}
                                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                                />
                                <span className="ml-1 cursor-pointer">Correct</span>
                              </label>
                            </div>
                            <div
                              className={`mb-3 ${activePasteArea === `${qIndex}-optionImage-${optIndex}` ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
                              onPaste={(e) => handlePasteImage(qIndex, `optionImage-${optIndex}`, e)}
                            >
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleQuestionChange(qIndex, `option-${optIndex}`, e.target.value)}
                                placeholder='Type text or paste image'
                                className={`w-full p-2 bg-gray-50 border ${!isOptionFilled(opt, q.optionImages[optIndex]) ? "border-red-300" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm`}
                                required
                              />
                              {!isOptionFilled(opt, q.optionImages[optIndex]) && (
                                <p className="text-red-500 text-xs mt-1">Option text or image is required</p>
                              )}
                            </div>

                            <div className="mt-2">
                              {q.optionImages[optIndex] ? (
                                <div className="relative inline-block">
                                  <img src={q.optionImagesPreview[optIndex]} alt={`option-${optIndex}`} className="w-20 h-20 object-contain border rounded-lg shadow-sm" />
                                  <button
                                    onClick={() => removeImage(qIndex, `optionImage-${optIndex}`)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition duration-200"
                                    title="Remove image"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <label className="cursor-pointer text-xs text-blue-600 hover:text-blue-800 flex items-center transition duration-200"
                                  onClick={() => triggerFileInput(qIndex, `optionImage-${optIndex}`)}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Add image
                                  <input type="file" accept="image/*" onChange={(e) => handleImageChange(qIndex, `optionImage-${optIndex}`, e.target.files[0])} className="hidden" />
                                </label>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {q.correctOption === null && (
                        <p className="text-red-500 text-xs mt-2">Please select the correct option</p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Question Button */}
                <button
                  onClick={addQuestion}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center mt-4 text-sm cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
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
              <div className="flex flex-wrap gap-3 justify-between mt-8">
                <button
                  onClick={() => setActiveTab("details")}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300 flex items-center text-sm cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Details
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelExam}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300 flex items-center text-sm cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Exam
                  </button>
                  <button
                    onClick={handleCreateExam}
                    disabled={!isQuestionsValid() || creating}
                    className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300 flex items-center justify-center text-sm min-w-[120px] cursor-pointer"
                  >
                    {creating ? (
                      <>
                        <Loader className="animate-spin h-4 w-4 mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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