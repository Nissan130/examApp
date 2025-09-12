import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { ArrowLeft, Download, ImageIcon, Edit } from "lucide-react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";

export default function ViewCreatedExam() {
  const { examId } = useParams();
  console.log(examId);
  
  const { token } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        `http://127.0.0.1:5000/api/exam/my-created-exams/view-created-exam/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        setExam(response.data.exam);
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

  const getImageDimensions = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => resolve({ width: 100, height: 60 });
      img.src = url;
    });
  };

//making pdf from the exam
const exportPDF = async (includeAnswers = false) => {
  if (!exam) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  const columnWidth = (contentWidth - 10) / 2; // 10px gap between columns
  let y = 20;

  // Set font
  doc.setFont("helvetica");

  // Header Section - Centered
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(exam.exam_name.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text(`${exam.subject} - ${exam.chapter}`, pageWidth / 2, y, { align: 'center' });
  y += 6;

  // Exam details
  doc.setFontSize(9);
  const details = [
    `Class: ${exam.class_name || "N/A"}`,
    `Total Marks: ${exam.total_marks}`,
    `Time: ${exam.total_time_minutes} min`,
    `Examiner: ${exam.examiner_name || "N/A"}`,
    exam.negative_marks_value > 0 ? `Negative Marking: ${exam.negative_marks_value}` : null
  ].filter(Boolean);

  // Center details evenly
  const detailWidth = contentWidth / details.length;
  details.forEach((detail, index) => {
    const x = margin + (index * detailWidth) + (detailWidth / 2);
    doc.text(detail, x, y, { align: 'center' });
  });
  y += 10;

  // Divider line
  doc.setDrawColor(150, 150, 150);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  // Instructions
  if (exam.description) {
    doc.setFontSize(10);
    doc.setFont(undefined, 'italic');
    const instructions = doc.splitTextToSize(`Instructions: ${exam.description}`, contentWidth);
    doc.text(instructions, margin, y);
    y += instructions.length * 4 + 10;
  }

  // Start two-column layout for questions
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text("QUESTIONS", margin, y);
  y += 15;

  // Two-column layout variables
  let currentColumn = 0; // 0 = left, 1 = right
  let columnX = margin;
  let questionCount = 0;

  for (const [idx, q] of exam.questions.entries()) {
    questionCount++;
    
    // Determine current column position
    if (currentColumn === 1) {
      columnX = margin + columnWidth + 10;
    } else {
      columnX = margin;
    }

    // Check if we need a new page
    if (y > pageHeight - 50) {
      if (currentColumn === 0) {
        // Move to right column first
        currentColumn = 1;
        columnX = margin + columnWidth + 10;
        y = 40; // Reset y for right column
      } else {
        // New page
        doc.addPage();
        y = 20;
        currentColumn = 0;
        columnX = margin;
      }
    }

    // Question number (Q1, Q2, etc.)
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    const questionNumber = `Q${questionCount}.`;
    doc.text(questionNumber, columnX, y);
    
    // Question text
    const questionTextWidth = columnWidth - 15;
    const splitQuestion = doc.splitTextToSize(q.question_text, questionTextWidth);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(splitQuestion, columnX + 12, y);
    y += splitQuestion.length * 4;

    // Question image (standard size for two columns)
    if (q.question_image_url) {
      try {
        const imgProps = await getImageDimensions(q.question_image_url);
        const maxWidth = columnWidth - 15;
        const maxHeight = 60;
        const scale = Math.min(maxWidth / imgProps.width, maxHeight / imgProps.height);
        const imgWidth = imgProps.width * scale;
        const imgHeight = imgProps.height * scale;
        
        if (y + imgHeight > pageHeight - 20) {
          if (currentColumn === 0) {
            currentColumn = 1;
            columnX = margin + columnWidth + 10;
            y = 40;
          } else {
            doc.addPage();
            y = 20;
            currentColumn = 0;
            columnX = margin;
          }
        }
        
        const centerX = columnX + (columnWidth - imgWidth) / 2;
        doc.addImage(q.question_image_url, 'JPEG', centerX, y, imgWidth, imgHeight);
        y += imgHeight + 5;
      } catch {
        doc.setFontSize(8);
        doc.text("[Image]", columnX, y);
        y += 4;
      }
    }

    // Options
    doc.setFontSize(9);
    const options = [
      { text: q.options.A.text, image: q.options.A.image_url, letter: 'A' },
      { text: q.options.B.text, image: q.options.B.image_url, letter: 'B' },
      { text: q.options.C.text, image: q.options.C.image_url, letter: 'C' },
      { text: q.options.D.text, image: q.options.D.image_url, letter: 'D' }
    ];

    for (const option of options) {
      if (y > pageHeight - 30) {
        if (currentColumn === 0) {
          currentColumn = 1;
          columnX = margin + columnWidth + 10;
          y = 40;
        } else {
          doc.addPage();
          y = 20;
          currentColumn = 0;
          columnX = margin;
        }
      }

      // Option letter
      doc.setFont(undefined, 'bold');
      doc.text(`${option.letter}.`, columnX, y);
      
      // Option text
      const optionTextWidth = columnWidth - 20;
      const splitOption = doc.splitTextToSize(option.text, optionTextWidth);
      doc.setFont(undefined, 'normal');
      doc.text(splitOption, columnX + 6, y);
      y += splitOption.length * 3.5;

      // Option image (small and consistent size)
      if (option.image) {
        try {
          const imgProps = await getImageDimensions(option.image);
          const maxWidth = 25;
          const maxHeight = 20;
          const scale = Math.min(maxWidth / imgProps.width, maxHeight / imgProps.height);
          const imgWidth = imgProps.width * scale;
          const imgHeight = imgProps.height * scale;
          
          if (y + imgHeight > pageHeight - 20) {
            if (currentColumn === 0) {
              currentColumn = 1;
              columnX = margin + columnWidth + 10;
              y = 40;
            } else {
              doc.addPage();
              y = 20;
              currentColumn = 0;
              columnX = margin;
            }
          }
          
          doc.addImage(option.image, 'JPEG', columnX + 8, y, imgWidth, imgHeight);
          y += imgHeight + 3;
        } catch {
          doc.setFontSize(7);
          doc.text("[Img]", columnX + 8, y);
          y += 3;
        }
      }
    }

    // Answer (if included)
    if (includeAnswers) {
      if (y > pageHeight - 15) {
        if (currentColumn === 0) {
          currentColumn = 1;
          columnX = margin + columnWidth + 10;
          y = 40;
        } else {
          doc.addPage();
          y = 20;
          currentColumn = 0;
          columnX = margin;
        }
      }

      doc.setFontSize(9);
      doc.setTextColor(0, 100, 0);
      doc.setFont(undefined, 'bold');
      doc.text(`✓ Answer: ${q.correct_answer}`, columnX, y);
      doc.setTextColor(0, 0, 0);
      y += 6;
    }

    // Space between questions
    y += 8;

    // Move to next column if current column is getting full
    if (currentColumn === 0 && y > pageHeight / 2 + 20) {
      currentColumn = 1;
      columnX = margin + columnWidth + 10;
      y = 40;
    }
  }

  // Footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  }

  const fileName = includeAnswers
    ? `${exam.exam_name.replace(/\s+/g, '_')}_With_Answers.pdf`
    : `${exam.exam_name.replace(/\s+/g, '_')}_Question_Paper.pdf`;

  doc.save(fileName);
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam details...</p>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <p className="text-gray-600 text-lg mb-6">{error || "Exam not found."}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition duration-300 flex items-center justify-center mx-auto"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="mb-8 pt-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Exams
          </button>

          {/* Edit button at top-right */}
          <button
            onClick={() => navigate(`/examiner/my-created-exam/edit-created-exam/${examId}`)}
            className="absolute top-10 right-0 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl shadow-md flex items-center transition duration-300"
          >
            <Edit size={18} className="mr-2" />
            Edit Exam
          </button>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {exam.exam_name}
          </h1>
          <p className="text-gray-600 text-lg">{exam.description || "No description provided"}</p>

          <div className="flex flex-wrap gap-3 mt-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Subject: {exam.subject}
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Chapter: {exam.chapter}
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              Class: {exam.class_name || "N/A"}
            </span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
              Marks: {exam.total_marks}
            </span>
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
              Time: {exam.total_time_minutes} min
            </span>
            {exam.negative_marks_value > 0 && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                Negative: {exam.negative_marks_value}
              </span>
            )}
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              Attempts: {exam.attempts_allowed}
            </span>
            <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
              Questions: {exam.questions.length}
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-10">
          {exam.questions.map((q, idx) => (
            <div key={q.question_id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-start">
                <span className="bg-blue-100 text-blue-700 rounded-lg p-2 mr-3">{idx + 1}.</span>
                {q.question_text}
              </h3>

              {/* Question Image */}
              {q.question_image_url && (
                <div className="ml-11 mb-4">
                  <div className="flex items-center mb-2">
                    {/* <ImageIcon size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-500">Question Image:</span> */}
                  </div>
                  <img 
                    src={q.question_image_url} 
                    alt="Question" 
                    className="max-w-full h-auto rounded-lg border border-gray-200 max-h-60 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="ml-11 mb-4">
                <ul className="space-y-2">
                  {['A', 'B', 'C', 'D'].map((letter) => (
                    <li key={letter} className="flex items-start">
                      <span className="bg-gray-100 text-gray-700 rounded-lg p-1 px-2 mr-3 font-medium min-w-[2rem] text-center">
                        {letter}
                      </span>
                      <div className="flex-1">
                        <span className="text-gray-700">{q.options[letter].text}</span>
                        {q.options[letter].image_url && (
                          <div className="mt-2">
                            <div className="flex items-center mb-1">
                              {/* <ImageIcon size={14} className="text-blue-500 mr-1" />
                              <span className="text-xs text-gray-500">Option Image:</span> */}
                            </div>
                            <img 
                              src={q.options[letter].image_url} 
                              alt={`Option ${letter}`} 
                              className="max-w-full h-auto  max-h-40 object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ml-11 p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-green-700 font-semibold flex items-center">
                  <span className="bg-green-100 text-green-700 rounded-lg p-1 px-2 mr-3">✓</span>
                  Correct Answer: {q.correct_answer}
                </p>
                {/* <p className="text-green-600 text-sm mt-1">
                  Marks: {q.marks}
                </p> */}
              </div>
            </div>
          ))}
        </div>

        {/* Export Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Download size={20} className="mr-2 text-blue-600" />
            Export Exam
          </h3>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => exportPDF(false)} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition duration-300 flex items-center"
            >
              <Download size={18} className="mr-2" />
              Questions Only PDF
            </button>
            
            <button 
              onClick={() => exportPDF(true)} 
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-5 py-3 rounded-xl shadow-md transition duration-300 flex items-center"
            >
              <Download size={18} className="mr-2" />
              With Answers PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}