import { useState, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import { Loader } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";

export default function EditCreatedExam() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("details");
    const [updating, setUpdating] = useState(false); // Loading state for update exam

    // State for tracking paste operations
    const [activePasteArea, setActivePasteArea] = useState(null);
    const fileInputRefs = useRef({});

    // Local state for editing
    const [exam, setExam] = useState({
        exam_name: "",
        subject: "",
        chapter: "",
        class_name: "",
        description: "",
        total_marks: 0,
        passing_marks: "",
        total_time_minutes: 0,
        start_datetime: "",
        end_datetime: "",
        attempts_allowed: "single",
        negative_marks_value: 0,
        examiner_name: "",
        questions: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { token } = useContext(GlobalContext);

    useEffect(() => {
        if (examId) {
            fetchExamDetails();
        } else {
            setError("Exam ID is missing");
            setLoading(false);
        }
    }, [examId]);

    const fetchExamDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_BASE_URL}/api/examiner/my-created-exams/view-created-exam/${examId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === "success") {
                const examData = response.data.exam;
                console.log(examData);

                // Parse datetime fields
                const startDatetime = examData.start_datetime || "";
                const endDatetime = examData.end_datetime || "";

                // Process questions to match the expected format
                const processedQuestions = examData.questions.map(question => {
                    // Convert separate option fields to an array
                    const optionsText = [
                        question.options.A.text || "",
                        question.options.B.text || "",
                        question.options.C.text || "",
                        question.options.D.text || ""
                    ];

                    // Convert separate option image fields to an array
                    const optionImagesUrl = [
                        question.options.A.image_url || null,
                        question.options.B.image_url || null,
                        question.options.C.image_url || null,
                        question.options.D.image_url || null
                    ];
                    const optionImagesId = [
                        question.options.A.image_id || null,
                        question.options.B.image_id || null,
                        question.options.C.image_id || null,
                        question.options.D.image_id || null
                    ];

                    // Initialize optionImagesPreview array with null values
                    const optionImagesPreview = [null, null, null, null];

                    // Determine correct option index
                    let correctOption = null;
                    if (question.correct_answer) {
                        const optionIndex = ["A", "B", "C", "D"].indexOf(question.correct_answer);
                        if (optionIndex !== -1) {
                            correctOption = optionIndex;
                        }
                    }

                    return {
                        ...question,
                        questionText: question.question_text || "",
                        questionImageUrl: question.question_image_url || null,
                        questionImageId: question.question_image_id || null,
                        questionImagePreview: question.question_image_url || null,
                        optionsText: optionsText,
                        optionImagesUrl: optionImagesUrl,
                        optionImagesId: optionImagesId,
                        optionImagesPreview: optionImagesPreview,
                        correctOption: correctOption
                    };
                });

                setExam({
                    ...examData,
                    start_datetime: startDatetime,
                    end_datetime: endDatetime,
                    questions: processedQuestions
                });
            } else {
                setError(response.data.message || "Failed to fetch exam details");
            }
        } catch (err) {
            console.error("Error fetching exam details:", err);
            setError(err.response?.data?.message || "Failed to fetch exam details");
        } finally {
            setLoading(false);
        }
    };

    const handleExamChange = (field, value) => {
        setExam((prev) => ({ ...prev, [field]: value }));
    };

    // Fix handleQuestionChange function
    const handleQuestionChange = (qIndex, field, value) => {
        const updated = [...exam.questions];
        if (field === "question") {
            updated[qIndex].questionText = value;
        } else if (field.startsWith("option-")) {
            const optIndex = parseInt(field.split("-")[1]);
            updated[qIndex].optionsText[optIndex] = value;
        }
        setExam({ ...exam, questions: updated });
    };

    // Handle selecting correct option
    const handleCorrectOptionChange = (qIndex, optIndex) => {
        const updated = [...exam.questions];
        updated[qIndex].correctOption = optIndex;
        setExam({ ...exam, questions: updated });
    };

    // Handle image upload
    // Handle image change - store File objects instead of URLs
    // Handle image change - store File objects instead of URLs

    // Handle image change - store File objects instead of URLs
    const handleImageChange = (qIndex, field, file) => {
        if (!file) return;

        // Create a deep copy of the questions array
        const updated = exam.questions.map(q => ({
            ...q,
            optionsText: [...q.optionsText],
            optionImagesUrl: [...q.optionImagesUrl],
            optionImagesId: [...q.optionImagesId],
            optionImagesPreview: [...(q.optionImagesPreview || [null, null, null, null])]
        }));

        const imageUrl = URL.createObjectURL(file); // For preview only

        if (field === "questionImage") {
            updated[qIndex].questionImageUrl = file; // Store the File object
            updated[qIndex].questionImagePreview = imageUrl; // For preview
        } else if (field.startsWith("optionImage-")) {
            const optIndex = parseInt(field.split("-")[1]);

            // Ensure optionImages and optionImagesPreview arrays exist
            if (!updated[qIndex].optionImagesUrl) {
                updated[qIndex].optionImagesUrl = [null, null, null, null];
            }
            if (!updated[qIndex].optionImagesPreview) {
                updated[qIndex].optionImagesPreview = [null, null, null, null];
            }

            updated[qIndex].optionImagesUrl[optIndex] = file; // Store the File object
            updated[qIndex].optionImagesPreview[optIndex] = imageUrl; // For preview
        }

        setExam({ ...exam, questions: updated });
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
            const optIndex = parseInt(field.split("-")[1]);
            handleQuestionChange(qIndex, `option-${optIndex}`, text);
        } else if (field === "questionImage") {
            handleQuestionChange(qIndex, "question", text);
        }

        // Clear the active paste area after a short delay
        setTimeout(() => setActivePasteArea(null), 500);
    };

    // Remove image
    // Remove image
    const removeImage = (qIndex, field) => {
        // Create a deep copy of the questions array
        const updated = exam.questions.map(q => ({
            ...q,
            optionsText: [...q.optionsText],
            optionImagesUrl: [...q.optionImagesUrl],
            optionImagesId: [...q.optionImagesId],
            optionImagesPreview: [...(q.optionImagesPreview || [null, null, null, null])]
        }));

        if (field === "questionImage") {
            updated[qIndex].questionImageUrl = null;
            updated[qIndex].questionImagePreview = null;
        } else if (field.startsWith("optionImage-")) {
            const optIndex = parseInt(field.split("-")[1]);

            // Ensure arrays exist
            if (!updated[qIndex].optionImagesUrl) {
                updated[qIndex].optionImagesUrl = [null, null, null, null];
            }
            if (!updated[qIndex].optionImagesPreview) {
                updated[qIndex].optionImagesPreview = [null, null, null, null];
            }

            updated[qIndex].optionImagesUrl[optIndex] = null;
            updated[qIndex].optionImagesPreview[optIndex] = null;
        }
        setExam({ ...exam, questions: updated });
    };

    // Trigger file input programmatically
    const triggerFileInput = (qIndex, field) => {
        const key = `${qIndex}-${field}`;
        if (fileInputRefs.current[key]) {
            fileInputRefs.current[key].click();
        }
    };

    const addQuestion = () => {
        const newQuestion = {
            questionText: "",
            questionImageUrl: null,
            questionImageId: null,
            questionImagePreview: null,
            optionsText: ["", "", "", ""],
            optionImagesUrl: [null, null, null, null],
            optionImagesId: [null, null, null, null],
            optionImagesPreview: [null, null, null, null],
            correctOption: null
        };
        setExam({ ...exam, questions: [...exam.questions, newQuestion] });
    };
    const deleteQuestion = (qIndex) => {
        const updated = exam.questions.filter((_, i) => i !== qIndex);
        setExam({ ...exam, questions: updated });
    };

    // Fix isQuestionFilled function
    const isQuestionFilled = (q) => {
        return (q.questionText && q.questionText.trim() !== "") || q.questionImageUrl !== null;
    };

    // Check if all questions and options are filled

    // Check if option is filled (either text or image)
    // Fix isOptionFilled function
    const isOptionFilled = (opt, optImage) => {
        return (opt && opt.trim() !== "") || (optImage !== null && optImage !== undefined);
    };


    // Check if all questions and options are filled
    const isQuestionsValid = () => {
        return exam.questions.every(q => {
            const hasQuestion = isQuestionFilled(q);
            const hasAllOptions = q.optionsText.every((opt, index) =>
                isOptionFilled(opt, q.optionImagesUrl && q.optionImagesUrl[index])
            );
            const hasCorrectOption = q.correctOption !== null;

            return hasQuestion && hasAllOptions && hasCorrectOption;
        });
    };


    // Handle negative marking toggle
    const handleNegativeMarkingToggle = (checked) => {
        const negativeMarksValue = checked ? 0.25 : 0;
        setExam((prev) => ({ ...prev, negative_marks_value: negativeMarksValue }));
    };

    //update the data and images in the database
    // Update the data and images in the database
    const updateExam = async () => {
        if (!isQuestionsValid()) {
            alert("Please fill all questions, options, and mark correct answers before updating the exam.");
            return;
        }

        try {
            setUpdating(true);

            const formData = new FormData();

            // Prepare JSON data for exam + questions + options
            const examData = {
                exam_name: exam.exam_name,
                subject: exam.subject,
                chapter: exam.chapter,
                class_name: exam.class_name,
                description: exam.description,
                total_marks: exam.total_marks,
                passing_marks: exam.passing_marks,
                total_time_minutes: exam.total_time_minutes,
                start_datetime: exam.start_datetime,
                end_datetime: exam.end_datetime,
                attempts_allowed: exam.attempts_allowed,
                negative_marks_value: exam.negative_marks_value,
                examiner_name: exam.examiner_name,
                questions: exam.questions.map((q, index) => {
                    const questionImageUrl = q.questionImageUrl || null
                    const questionImageId = q.questionImageId || null
                    const opts = q.optionImagesUrl || [null, null, null, null];
                    const optIds = q.optionImagesId || [null, null, null, null];

                    return {
                        question_text: q.questionText,
                        question_order: index + 1,
                        marks: 1,
                        optA_text: q.optionsText[0] || "",
                        optB_text: q.optionsText[1] || "",
                        optC_text: q.optionsText[2] || "",
                        optD_text: q.optionsText[3] || "",
                        correct_answer: ["A", "B", "C", "D"][q.correctOption] || null,

                        // // Correct the question image ID logic
                        // question_image_id: q.questionImageUrl instanceof File ? null : q.questionImageId || null,
                        // question_image_url: q.questionImageUrl instanceof File ? null : q.questionImageUrl || null,


                        // //option images
                        // optA_image_id: opts[0] instanceof File ? null : optIds[0] || null,
                        // optB_image_id: opts[1] instanceof File ? null : optIds[1] || null,
                        // optC_image_id: opts[2] instanceof File ? null : optIds[2] || null,
                        // optD_image_id: opts[3] instanceof File ? null : optIds[3] || null,

                        // Existing image URLs safely
                        question_image_url: typeof questionImageUrl === "string" ? q.questionImageUrl : null,
                        question_image_id: typeof questionImageId === "string" ? q.questionImageId : null,

                        // Options images
                        optA_image_url: typeof opts[0] === "string" ? opts[0] : null,
                        optA_image_id: typeof opts[0] === "string" ? optIds[0] : null,
                        optB_image_url: typeof opts[1] === "string" ? opts[1] : null,
                        optB_image_id: typeof opts[1] === "string" ? optIds[1] : null,
                        optC_image_url: typeof opts[2] === "string" ? opts[2] : null,
                        optC_image_id: typeof opts[2] === "string" ? optIds[2] : null,
                        optD_image_url: typeof opts[3] === "string" ? opts[3] : null,
                        optD_image_id: typeof opts[3] === "string" ? optIds[3] : null,

                    };
                })

            };

            formData.append("exam_data", JSON.stringify(examData));

            // Append new images only (File objects)
            exam.questions.forEach((q, qIdx) => {
                if (q.questionImageUrl instanceof File) {
                    formData.append(`question_${qIdx + 1}_image`, q.questionImageUrl);
                }

                q.optionImagesUrl.forEach((optImg, optIdx) => {
                    if (optImg instanceof File) {
                        const optionLetter = ["A", "B", "C", "D"][optIdx];
                        formData.append(`question_${qIdx + 1}_opt${optionLetter}_image`, optImg);
                    }
                });
            });

            const response = await axios.put(
                `${API_BASE_URL}/api/examiner/my-created-exams/update-exam/${examId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.status === "success") {
                alert("Exam updated successfully!");
                navigate(`/examiner/my-created-exam/view-created-exam/${examId}`);
            } else {
                setError(response.data.message || "Failed to update exam");
            }
        } catch (err) {
            console.error("Error updating exam:", err);
            setError(err.response?.data?.message || "Failed to update exam");
        } finally {
            setUpdating(false);
        }
    };



    const handleCancelExam = () => {
        if (window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
            navigate(-1);
        }
    };

    // Parse datetime values for form inputs
    const startDate = exam.start_datetime ? exam.start_datetime.split('T')[0] : '';
    const startTime = exam.start_datetime ? exam.start_datetime.split('T')[1].substring(0, 5) : '';
    const endDate = exam.end_datetime ? exam.end_datetime.split('T')[0] : '';
    const endTime = exam.end_datetime ? exam.end_datetime.split('T')[1].substring(0, 5) : '';

    // Validation for required fields
    const isDetailsValid = exam.exam_name && exam.subject && exam.chapter && exam.class_name && exam.total_marks && exam.total_time_minutes;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
                    <p className="text-gray-600 mb-4">Loading exam details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 pt-12">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Edit Exam
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                        Modify your exam with questions, options, and images
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
                                        { label: "Exam Name*", value: exam.exam_name, setter: (val) => handleExamChange("exam_name", val) },
                                        { label: "Subject/Course Name*", value: exam.subject, setter: (val) => handleExamChange("subject", val) },
                                        { label: "Chapter/Topic*", value: exam.chapter, setter: (val) => handleExamChange("chapter", val) },
                                        { label: "Class/Section*", value: exam.class_name, setter: (val) => handleExamChange("class_name", val) },
                                        { label: "Total Marks*", value: exam.total_marks, setter: (val) => handleExamChange("total_marks", val), type: "number" },
                                        { label: "Total Time (minutes)*", value: exam.total_time_minutes, setter: (val) => handleExamChange("total_time_minutes", val), type: "number" },
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
                                    value={exam.description}
                                    onChange={(e) => handleExamChange("description", e.target.value)}
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
                                            value={exam.passing_marks}
                                            onChange={(e) => handleExamChange("passing_marks", e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Examiner Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter examiner name"
                                            value={exam.examiner_name}
                                            onChange={(e) => handleExamChange("examiner_name", e.target.value)}
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
                                                onChange={(e) => handleExamChange("start_datetime", e.target.value + (startTime ? 'T' + startTime : ''))}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                                            />
                                            <input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => handleExamChange("start_datetime", (startDate || new Date().toISOString().split('T')[0]) + 'T' + e.target.value)}
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
                                                onChange={(e) => handleExamChange("end_datetime", e.target.value + (endTime ? 'T' + endTime : ''))}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                                            />
                                            <input
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => handleExamChange("end_datetime", (endDate || new Date().toISOString().split('T')[0]) + 'T' + e.target.value)}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Attempts Allowed</label>
                                        <select
                                            value={exam.attempts_allowed}
                                            onChange={(e) => handleExamChange("attempts_allowed", e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm"
                                        >
                                            <option value="single">Single attempt</option>
                                            <option value="multiple">Multiple attempts</option>
                                            <option value="unlimited">Unlimited attempts</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                <p className="text-xs font-medium text-blue-800">
                                    <span className="font-semibold">Exam Title:</span> {exam.exam_name || "Your exam title will appear here"}
                                </p>
                            </div>

                            {/* Negative Marking */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg mb-3">
                                <label className="flex items-center gap-2 font-medium text-gray-700 text-sm">
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={exam.negative_marks_value > 0}
                                            onChange={(e) => handleNegativeMarkingToggle(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                                    </div>
                                    Negative marking for each wrong answer
                                </label>
                                {exam.negative_marks_value > 0 && (
                                    <div className="sm:ml-auto">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="e.g., 0.25"
                                            value={exam.negative_marks_value}
                                            onChange={(e) => handleExamChange("negative_marks_value", parseFloat(e.target.value))}
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
                                Edit Questions
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
                                {exam.questions && exam.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                                Question {qIndex + 1}
                                            </h3>
                                            {exam.questions.length > 1 && (
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
                                                    value={q.questionText}
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
                                            {q.questionImageUrl ? (
                                                <div className="relative inline-block">
                                                    <img
                                                        src={q.questionImageUrl instanceof File ? q.questionImagePreview : q.questionImageUrl}
                                                        alt="question"
                                                        className="w-32 h-32 object-contain border rounded-lg shadow-sm"
                                                    />

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
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            ref={el => fileInputRefs.current[`${qIndex}-questionImage`] = el}
                                                            onChange={(e) => handleImageChange(qIndex, "questionImage", e.target.files[0])}
                                                            className="hidden"
                                                        />
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
                                                {q.optionsText.map((opt, optIndex) => (
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
                                                                className={`w-full p-2 bg-gray-50 border ${!isOptionFilled(opt, q.optionImagesUrl[optIndex]) ? "border-red-300" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-sm`}
                                                                required
                                                            />
                                                            {!isOptionFilled(opt, q.optionImagesUrl[optIndex]) && (
                                                                <p className="text-red-500 text-xs mt-1">Option text or image is required</p>
                                                            )}
                                                        </div>

                                                        <div className="mt-2">

                                                            {q.optionImagesUrl && q.optionImagesUrl[optIndex] ? (
                                                                <div className="relative inline-block">
                                                                    <img
                                                                        src={q.optionImagesUrl[optIndex] instanceof File ?
                                                                            (q.optionImagesPreview && q.optionImagesPreview[optIndex]) :
                                                                            q.optionImagesUrl[optIndex]}
                                                                        alt={`option-${optIndex}`}
                                                                        className="w-20 h-20 object-contain border rounded-lg shadow-sm"
                                                                    />
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
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*"
                                                                        ref={el => fileInputRefs.current[`${qIndex}-optionImage-${optIndex}`] = el}
                                                                        onChange={(e) => handleImageChange(qIndex, `optionImage-${optIndex}`, e.target.files[0])}
                                                                        className="hidden"
                                                                    />
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
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateExam}
                                        disabled={!isQuestionsValid() || updating}
                                        className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-300 flex items-center justify-center text-sm min-w-[120px]"
                                    >
                                        {updating ? (
                                            <>
                                                <Loader className="animate-spin h-4 w-4 mr-2" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Update Exam
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