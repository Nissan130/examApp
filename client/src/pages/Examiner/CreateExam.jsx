
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";


export default function CreateExam() {
  const navigate = useNavigate();

  // Exam details state
  const [examName, setExamName] = useState("");
  const [chapter, setChapter] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [examDesc, setExamDesc] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [negativeMarks, setNegativeMarks] = useState("");

  // Questions state
  const [questions, setQuestions] = useState([
    {
      question: "",
      questionImage: null,
      options: ["", "", "", ""],
      optionImages: [null, null, null, null],
      answer: "",
    },
  ]);

  // State for tracking paste operations
  const [activePasteArea, setActivePasteArea] = useState(null);
  const fileInputRefs = useRef({});

  const examTitle = `${examName}${chapter ? " - " + chapter : ""}${className ? " (" + className : ""
    }${section ? " - " + section + ")" : className ? ")" : ""}`;

  // Handlers
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "question" || field === "answer") updatedQuestions[index][field] = value;
    else if (field.startsWith("option-")) {
      const optIndex = parseInt(field.split("-")[1]);
      updatedQuestions[index].options[optIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  // Handle image upload
  const handleImageChange = (index, field, file) => {
    if (!file) return;
    const updatedQuestions = [...questions];
    const imageUrl = URL.createObjectURL(file);

    if (field === "questionImage") {
      updatedQuestions[index].questionImage = imageUrl;
    } else if (field.startsWith("optionImage-")) {
      const optIndex = parseInt(field.split("-")[1]);
      updatedQuestions[index].optionImages[optIndex] = imageUrl;
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

      // Clear the active paste area after a short delay
      setTimeout(() => setActivePasteArea(null), 1000);
      return;
    }
  }

  // If no image, fallback to text
  const text = e.clipboardData.getData("text");

  if (field.startsWith("optionImage-")) {
    // paste text into the option text field
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
    } else if (field.startsWith("optionImage-")) {
      const optIndex = parseInt(field.split("-")[1]);
      updatedQuestions[index].optionImages[optIndex] = null;
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
      { question: "", questionImage: null, options: ["", "", "", ""], optionImages: [null, null, null, null], answer: "" },
    ]);
  };

  const deleteQuestion = (qIndex) => setQuestions(questions.filter((_, i) => i !== qIndex));

  const handleCreateExam = () => {
    const examData = { examTitle, examDesc, totalMarks, totalTime, negativeMarking, negativeMarks: negativeMarking ? negativeMarks : 0, questions };
    console.log("Exam Created:", examData);
    alert("Exam created! Check console for details.");
  };

  const handleCancelExam = () => {
    if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Create New Exam
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Design your custom exam with questions, options, and images
          </p>
        </div>

        {/* Exam Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Exam Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            {[
              { label: "Exam Name", value: examName, setter: setExamName },
              { label: "Chapter", value: chapter, setter: setChapter },
              { label: "Class", value: className, setter: setClassName },
              { label: "Section", value: section, setter: setSection }
            ].map((item, i) => (
              <div key={i} className="relative">
                <input
                  type="text"
                  placeholder={item.label}
                  value={item.value}
                  onChange={(e) => item.setter(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Description</label>
            <textarea
              placeholder="Enter a description for your exam..."
              value={examDesc}
              onChange={(e) => setExamDesc(e.target.value)}
              rows={3}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-200"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <p className="text-sm font-medium text-blue-800">
              <span className="font-semibold">Exam Title:</span> {examTitle || "Your exam title will appear here"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Marks</label>
              <input
                type="number"
                placeholder="100"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Time (minutes)</label>
              <input
                type="number"
                placeholder="60"
                value={totalTime}
                onChange={(e) => setTotalTime(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <label className="flex items-center gap-3 font-medium text-gray-700">
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={negativeMarking}
                  onChange={(e) => setNegativeMarking(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </div>
              Negative marking for wrong answers
            </label>
            {negativeMarking && (
              <div className="sm:ml-auto">
                <input
                  type="number"
                  placeholder="Negative marks per question"
                  value={negativeMarks}
                  onChange={(e) => setNegativeMarks(e.target.value)}
                  className="p-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-48 transition duration-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Questions Section */}
        <div className="space-y-8">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <span className="bg-green-100 text-green-800 p-2 rounded-lg mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Question {qIndex + 1}
                </h3>
                {questions.length > 1 && (
                  <button
                    onClick={() => deleteQuestion(qIndex)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition duration-200"
                    title="Delete question"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Question Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
                <div
                  className={`p-4 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition duration-200 ${activePasteArea === `${qIndex}-questionImage` ? 'ring-2 ring-blue-500' : ''}`}
                  onPaste={(e) => handlePasteImage(qIndex, "questionImage", e)}
                >
                  <textarea
                    value={q.question}
                    onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                    rows={4}
                    placeholder="Enter your question here or paste an image with Ctrl+V..."
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0 resize-none"
                  />
                </div>
              </div>

              {/* Question Image */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">Question Image (Optional)</label>
                {q.questionImage ? (
                  <div className="relative inline-block">
                    <img src={q.questionImage} alt="question" className="w-40 h-40 object-contain border rounded-xl shadow-sm" />
                    <button
                      onClick={() => removeImage(qIndex, "questionImage")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition duration-200"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 flex-wrap">
                    <label className="cursor-pointer bg-blue-100 text-blue-700 px-5 py-3 rounded-xl hover:bg-blue-200 transition duration-200 shadow-sm flex items-center"

                      onClick={() => triggerFileInput(qIndex, "questionImage")}


                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Upload Image
                      <input type="file" accept="image/*" onChange={(e) => handleImageChange(qIndex, "questionImage", e.target.files[0])} className="hidden" />
                    </label>
                    <span className="text-sm text-gray-500">or paste image with Ctrl+V</span>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Options
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:bg-gray-100 transition duration-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Option {optIndex + 1}</label>
                      <div
                        className={`mb-3 ${activePasteArea === `${qIndex}-optionImage-${optIndex}` ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
                        onPaste={(e) => handlePasteImage(qIndex, `optionImage-${optIndex}`, e)}
                      >
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleQuestionChange(qIndex, `option-${optIndex}`, e.target.value)}
                          placeholder='Type text or paste image'
                          className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                      </div>


                      <div className="mt-3">
                        {q.optionImages[optIndex] ? (
                          <div className="relative inline-block">
                            <img src={q.optionImages[optIndex]} alt={`option-${optIndex}`} className="w-24 h-24 object-contain border rounded-lg shadow-sm" />
                            <button
                              onClick={() => removeImage(qIndex, `optionImage-${optIndex}`)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-lg hover:bg-red-600 transition duration-200"
                              title="Remove image"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 flex items-center transition duration-200"
                            onClick={() => triggerFileInput(qIndex, `optionImage-${optIndex}`)}

                          >

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              </div>

              {/* Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                <div
                  className="p-4 bg-green-50 border border-green-200 rounded-xl focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition duration-200"
                  onPaste={(e) => handlePasteImage(qIndex, "answer", e)}
                >
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) => handleQuestionChange(qIndex, "answer", e.target.value)}
                    placeholder="Enter the correct answer..."
                    className="w-full bg-transparent border-none focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <button
              onClick={addQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105 duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Question
            </button>
            <button
              onClick={handleCreateExam}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105 duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Create Exam
            </button>
            <button
              onClick={handleCancelExam}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105 duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}