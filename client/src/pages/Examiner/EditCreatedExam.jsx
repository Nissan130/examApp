import { useState, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../../context/GlobalContext";
import { Loader } from "lucide-react";
import { API_BASE_URL } from "../../utils/api";
import { useCustomAlert } from "../../context/CustomAlertContext";

export default function EditCreatedExam() {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("details");
    const [updating, setUpdating] = useState(false);
    const custom_alert = useCustomAlert();

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

    // Initialize file input refs
    useEffect(() => {
        exam.questions.forEach((_, qIndex) => {
            const questionKey = `${qIndex}-questionImage`;
            fileInputRefs.current[questionKey] = fileInputRefs.current[questionKey] || null;
            
            [0, 1, 2, 3].forEach(optIndex => {
                const optionKey = `${qIndex}-optionImage-${optIndex}`;
                fileInputRefs.current[optionKey] = fileInputRefs.current[optionKey] || null;
            });
        });
    }, [exam.questions]);

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

    // Handle image change - store File objects instead of URLs
    const handleImageChange = (qIndex, field, fileOrEvent) => {
        let file;
        
        if (fileOrEvent && fileOrEvent.target) {
            file = fileOrEvent.target.files[0];
            if (!file) return;
        } else {
            file = fileOrEvent;
            if (!file) return;
        }

        const updated = exam.questions.map(q => ({
            ...q,
            optionsText: [...q.optionsText],
            optionImagesUrl: [...q.optionImagesUrl],
            optionImagesId: [...q.optionImagesId],
            optionImagesPreview: [...(q.optionImagesPreview || [null, null, null, null])]
        }));

        const imageUrl = URL.createObjectURL(file);

        if (field === "questionImage") {
            updated[qIndex].questionImageUrl = file;
            updated[qIndex].questionImagePreview = imageUrl;
        } else if (field.startsWith("optionImage-")) {
            const optIndex = parseInt(field.split("-")[1]);

            if (!updated[qIndex].optionImagesUrl) {
                updated[qIndex].optionImagesUrl = [null, null, null, null];
            }
            if (!updated[qIndex].optionImagesPreview) {
                updated[qIndex].optionImagesPreview = [null, null, null, null];
            }

            updated[qIndex].optionImagesUrl[optIndex] = file;
            updated[qIndex].optionImagesPreview[optIndex] = imageUrl;
        }

        setExam({ ...exam, questions: updated });
    };

    // Handle paste image - FIXED VERSION
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

        const text = e.clipboardData.getData("text");
        
        if (field.startsWith("optionImage-")) {
            const optIndex = parseInt(field.split("-")[1]);
            const currentValue = exam.questions[qIndex].optionsText[optIndex];
            const target = e.target;

            if (target && target.selectionStart !== undefined) {
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
                handleQuestionChange(qIndex, `option-${optIndex}`, newValue);

                setTimeout(() => {
                    target.selectionStart = target.selectionEnd = start + text.length;
                }, 0);
            } else {
                handleQuestionChange(qIndex, `option-${optIndex}`, currentValue + text);
            }
        } else if (field === "questionImage") {
            const currentValue = exam.questions[qIndex].questionText;
            const target = e.target;

            if (target && target.selectionStart !== undefined) {
                const start = target.selectionStart;
                const end = target.selectionEnd;
                const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
                handleQuestionChange(qIndex, "question", newValue);

                setTimeout(() => {
                    target.selectionStart = target.selectionEnd = start + text.length;
                }, 0);
            } else {
                handleQuestionChange(qIndex, "question", currentValue + text);
            }
        }

        setTimeout(() => setActivePasteArea(null), 500);
    };

    // Remove image
    const removeImage = (qIndex, field) => {
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

    // Check if option is filled (either text or image)
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

    // Update the data and images in the database
    const updateExam = async () => {
        if (!isQuestionsValid()) {
            custom_alert.error("Please fill all questions, options, and mark correct answers before updating the exam.");
            return;
        }

        try {
            setUpdating(true);

            const formData = new FormData();

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

                        question_image_url: typeof questionImageUrl === "string" ? q.questionImageUrl : null,
                        question_image_id: typeof questionImageId === "string" ? q.questionImageId : null,

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
                custom_alert.success("Exam updated successfully!");
                navigate(`/examiner/my-created-exam/view-created-exam/${examId}`);
            } else {
                custom_alert.error(response.data.message || "Failed to update exam");
            }
        } catch (err) {
            console.error("Error updating exam:", err);
            custom_alert.error(err.response?.data?.message || "Failed to update exam");
        } finally {
            setUpdating(false);
        }
    };

    const handleCancelExam = () => {
        custom_alert.confirm(
            "Cancel Exam Update",
            "Are you sure you want to cancel? All unsaved changes will be lost.",
            () => navigate(-1)
        );
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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
                    <Loader className="animate-spin h-8 w-8 text-teal-600 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">Loading exam details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
                    <p className="text-red-600 text-lg mb-4">{error}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 pt-12">
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                        Edit Exam
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Modify your exam with questions, options, and images
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-slate-200 mb-8 bg-white rounded-2xl shadow-lg p-1">
                    <button
                        className={`flex-1 py-4 px-6 font-semibold text-base flex items-center justify-center rounded-xl transition-all duration-300 ${
                            activeTab === "details" 
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
                        className={`flex-1 py-4 px-6 font-semibold text-base flex items-center justify-center rounded-xl transition-all duration-300 ${
                            activeTab === "questions" 
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
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                    Required Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                                    value={exam.description}
                                    onChange={(e) => handleExamChange("description", e.target.value)}
                                    rows={3}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none transition-all duration-200 text-slate-900 placeholder-slate-500 hover:border-slate-300"
                                />
                            </div>

                            {/* Additional Details */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                    Additional Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Passing Marks</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Pass mark 40%"
                                            value={exam.passing_marks}
                                            onChange={(e) => handleExamChange("passing_marks", e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500 hover:border-slate-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Examiner Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter examiner name"
                                            value={exam.examiner_name}
                                            onChange={(e) => handleExamChange("examiner_name", e.target.value)}
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
                                                onChange={(e) => handleExamChange("start_datetime", e.target.value + (startTime ? 'T' + startTime : ''))}
                                                className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900"
                                            />
                                            <input
                                                type="time"
                                                value={startTime}
                                                onChange={(e) => handleExamChange("start_datetime", (startDate || new Date().toISOString().split('T')[0]) + 'T' + e.target.value)}
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
                                                onChange={(e) => handleExamChange("end_datetime", e.target.value + (endTime ? 'T' + endTime : ''))}
                                                className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900"
                                            />
                                            <input
                                                type="time"
                                                value={endTime}
                                                onChange={(e) => handleExamChange("end_datetime", (endDate || new Date().toISOString().split('T')[0]) + 'T' + e.target.value)}
                                                className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-3">Attempts Allowed</label>
                                        <select
                                            value={exam.attempts_allowed}
                                            onChange={(e) => handleExamChange("attempts_allowed", e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-slate-900"
                                        >
                                            <option value="single">Single attempt</option>
                                            <option value="multiple">Multiple attempts</option>
                                            <option value="unlimited">Unlimited attempts</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Exam Title Preview */}
                            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-xl border border-teal-200 mb-6">
                                <p className="text-sm font-semibold text-slate-800">
                                    <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Exam Title:</span> {exam.exam_name || "Your exam title will appear here"}
                                </p>
                            </div>

                            {/* Negative Marking */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200 mb-6">
                                <label className="flex items-center gap-3 font-semibold text-slate-700 text-sm">
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={exam.negative_marks_value > 0}
                                            onChange={(e) => handleNegativeMarkingToggle(e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
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
                                Edit Questions
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
                                {exam.questions && exam.questions.map((q, qIndex) => (
                                    <div key={qIndex} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <div className="flex justify-between items-center mb-5">
                                            <h3 className="text-xl font-bold text-slate-900 flex items-center bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                                Question {qIndex + 1}
                                            </h3>
                                            {exam.questions.length > 1 && (
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

                                        {/* Question Input */}
                                        <div className="mb-5">
                                            <div
                                                className={`p-4 bg-white border-2 ${!isQuestionFilled(q) ? "border-red-300" : "border-slate-300"} rounded-xl focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition duration-200 ${activePasteArea === `${qIndex}-questionImage` ? 'ring-2 ring-teal-500 border-teal-400' : ''}`}
                                                onPaste={(e) => handlePasteImage(qIndex, "questionImage", e)}
                                            >
                                                <textarea
                                                    value={q.questionText}
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

                                        {/* Question Image */}
                                        <div className="mb-6">
                                            {q.questionImageUrl ? (
                                                <div className="relative inline-block">
                                                    <img
                                                        src={q.questionImageUrl instanceof File ? q.questionImagePreview : q.questionImageUrl}
                                                        alt="question"
                                                        className="w-40 h-40 object-contain border-2 border-teal-200 rounded-xl shadow-lg"
                                                    />
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
                                                        className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-4 py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center text-sm font-medium cursor-pointer"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        Upload Question Image
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
                                            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
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
                                                {q.optionsText.map((opt, optIndex) => (
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
                                                        <div
                                                            className={`mb-4 ${activePasteArea === `${qIndex}-optionImage-${optIndex}` ? 'ring-2 ring-teal-500 rounded-lg p-2' : ''}`}
                                                            onPaste={(e) => handlePasteImage(qIndex, `optionImage-${optIndex}`, e)}
                                                        >
                                                            <input
                                                                type="text"
                                                                value={opt}
                                                                onChange={(e) => handleQuestionChange(qIndex, `option-${optIndex}`, e.target.value)}
                                                                placeholder='Type text or paste image'
                                                                className={`w-full p-3 bg-slate-50 border-2 ${!isOptionFilled(opt, q.optionImagesUrl[optIndex]) ? "border-red-300" : "border-slate-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-500`}
                                                                required
                                                            />
                                                            {!isOptionFilled(opt, q.optionImagesUrl[optIndex]) && (
                                                                <p className="text-red-500 text-xs mt-2 flex items-center">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    Option text or image is required
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="mt-3">
                                                            {q.optionImagesUrl && q.optionImagesUrl[optIndex] ? (
                                                                <div className="relative inline-block">
                                                                    <img
                                                                        src={q.optionImagesUrl[optIndex] instanceof File ?
                                                                            (q.optionImagesPreview && q.optionImagesPreview[optIndex]) :
                                                                            q.optionImagesUrl[optIndex]}
                                                                        alt={`option-${optIndex}`}
                                                                        className="w-24 h-24 object-contain border-2 border-teal-200 rounded-lg shadow-md"
                                                                    />
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
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateExam}
                                        disabled={!isQuestionsValid() || updating}
                                        className="bg-gradient-to-r from-teal-600 to-cyan-700 hover:from-teal-700 hover:to-cyan-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-base min-w-[140px] cursor-pointer"
                                    >
                                        {updating ? (
                                            <>
                                                <Loader className="animate-spin h-5 w-5 mr-2" />
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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