import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { ArrowLeft, Download, ImageIcon } from "lucide-react";

export default function ViewExam() {
  const { state } = useLocation();
  const exam = state?.exam;
  const navigate = useNavigate();

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <p className="text-gray-600 text-lg mb-6">Exam not found.</p>
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

  // Function to load image and get dimensions
  const getImageDimensions = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        resolve({ width: 100, height: 60 }); // Default dimensions if image fails to load
      };
      img.src = url;
    });
  };

  // ✅ Export PDF (questions only / with answers)
  const exportPDF = async (includeAnswers = false) => {
    const doc = new jsPDF();
    let y = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    doc.setFontSize(16);
    doc.text(exam.examTitle, margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Description: ${exam.examDesc}`, margin, y);
    y += 10;
    doc.text(`Total Marks: ${exam.totalMarks}`, margin, y);
    y += 8;
    doc.text(`Total Time: ${exam.totalTime} min`, margin, y);
    y += 10;

    for (const [idx, q] of exam.questions.entries()) {
      // Add new page if needed
      if (y > 220) {
        doc.addPage();
        y = 20;
      }
      
      y += 10;
      doc.setFontSize(12);
      doc.text(`${idx + 1}. ${q.question}`, margin, y);
      y += 8;

      // Add question image if exists
      if (q.questionImage) {
        try {
          const imgProps = await getImageDimensions(q.questionImage);
          const imgWidth = Math.min(contentWidth, 150);
          const imgHeight = (imgProps.height / imgProps.width) * imgWidth;
          
          if (y + imgHeight > 270) {
            doc.addPage();
            y = 20;
          }
          
          doc.addImage(q.questionImage, 'JPEG', margin, y, imgWidth, imgHeight);
          y += imgHeight + 8;
        } catch (error) {
          console.error("Error adding question image:", error);
          doc.text("[Image not available]", margin, y);
          y += 8;
        }
      }

      // Add options
      for (const [i, opt] of q.options.entries()) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(`   ${String.fromCharCode(65 + i)}. ${opt}`, margin + 5, y);
        y += 8;

        // Add option image if exists
        if (q.optionImages && q.optionImages[i]) {
          try {
            const imgProps = await getImageDimensions(q.optionImages[i]);
            const imgWidth = Math.min(contentWidth - 10, 100);
            const imgHeight = (imgProps.height / imgProps.width) * imgWidth;
            
            if (y + imgHeight > 270) {
              doc.addPage();
              y = 20;
            }
            
            doc.addImage(q.optionImages[i], 'JPEG', margin + 15, y, imgWidth, imgHeight);
            y += imgHeight + 8;
          } catch (error) {
            console.error("Error adding option image:", error);
            doc.text("[Image not available]", margin + 15, y);
            y += 8;
          }
        }
      }

      // Add answer if requested
      if (includeAnswers) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        
        doc.setTextColor(0, 128, 0); // Green for answers
        doc.text(`Answer: ${q.answer}`, margin + 5, y);
        doc.setTextColor(0, 0, 0);
        y += 10;
      }

      y += 5; // Add some space between questions
    }

    const fileName = includeAnswers
      ? `${exam.examTitle}-WithAnswers.pdf`
      : `${exam.examTitle}-QuestionsOnly.pdf`;

    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 pt-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Exams
          </button>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {exam.examTitle}
          </h1>
          <p className="text-gray-600 text-lg">{exam.examDesc}</p>
          
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Marks: {exam.totalMarks}
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Time: {exam.totalTime} min
            </span>
            {exam.negativeMarking && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                Negative Marking: {exam.negativeMarks}
              </span>
            )}
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              Questions: {exam.questions.length}
            </span>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-10">
          {exam.questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-lg text-gray-800 mb-3 flex items-start">
                <span className="bg-blue-100 text-blue-700 rounded-lg p-2 mr-3">{idx + 1}.</span>
                {q.question}
              </h3>
              
              {/* Question Image */}
              {q.questionImage && (
                <div className="ml-11 mb-4">
                  <div className="flex items-center mb-2">
                    <ImageIcon size={16} className="text-blue-500 mr-2" />
                    <span className="text-sm text-gray-500">Question Image:</span>
                  </div>
                  <img 
                    src={q.questionImage} 
                    alt="Question" 
                    className="max-w-full h-auto rounded-lg border border-gray-200 max-h-60 object-contain"
                  />
                </div>
              )}
              
              <div className="ml-11 mb-4">
                <ul className="space-y-2">
                  {q.options.map((opt, i) => (
                    <li key={i} className="flex items-start">
                      <span className="bg-gray-100 text-gray-700 rounded-lg p-1 px-2 mr-3 font-medium min-w-[2rem] text-center">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <div className="flex-1">
                        <span className="text-gray-700">{opt}</span>
                        {/* Option Image */}
                        {q.optionImages && q.optionImages[i] && (
                          <div className="mt-2">
                            <div className="flex items-center mb-1">
                              <ImageIcon size={14} className="text-blue-500 mr-1" />
                              <span className="text-xs text-gray-500">Option Image:</span>
                            </div>
                            <img 
                              src={q.optionImages[i]} 
                              alt={`Option ${String.fromCharCode(65 + i)}`} 
                              className="max-w-full h-auto rounded border border-gray-200 max-h-40 object-contain"
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
                  Answer: {q.answer}
                </p>
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