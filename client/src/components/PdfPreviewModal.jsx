import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';
import { X, Download, RotateCcw, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

const PdfPreviewModal = ({ exam, includeAnswers, language, onClose, onDownload }) => {
  const { t, i18n } = useTranslation();
  const previewRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Change language when prop changes
  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const generatePdf = async (download = false) => {
    if (!previewRef.current) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    
    if (download) {
      const fileName = includeAnswers
        ? `${exam.exam_name.replace(/\s+/g, '_')}_With_Answers.pdf`
        : `${exam.exam_name.replace(/\s+/g, '_')}_Question_Paper.pdf`;
      
      pdf.save(fileName);
      onDownload();
    }
    
    return pdf;
  };

  const handleDownload = async () => {
    await generatePdf(true);
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setScale(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{t('preview')}</h2>
          <div className="flex items-center gap-2">
            <select 
              className="border rounded px-2 py-1"
              value={language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
            <button 
              onClick={zoomOut}
              className="p-2 bg-gray-100 rounded"
              disabled={scale <= 0.5}
            >
              -
            </button>
            <button 
              onClick={resetZoom}
              className="p-2 bg-gray-100 rounded"
            >
              <RotateCcw size={16} />
            </button>
            <button 
              onClick={zoomIn}
              className="p-2 bg-gray-100 rounded"
              disabled={scale >= 2}
            >
              +
            </button>
            <span className="mx-2">{Math.round(scale * 100)}%</span>
            <button 
              onClick={handleDownload}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded ml-4"
            >
              <Download size={18} className="mr-2" />
              {t('download')}
            </button>
            <button 
              onClick={onClose}
              className="p-2 ml-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 flex justify-center">
          <div 
            className="bg-white shadow-lg"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
          >
            <div ref={previewRef} className="p-8 w-[210mm]">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">{exam.exam_name.toUpperCase()}</h1>
                <p className="text-lg">{exam.subject} - {exam.chapter}</p>
              </div>
              
              <div className="flex justify-between text-sm mb-6">
                <div>
                  <p><strong>{t('class')}:</strong> {exam.class_name || "N/A"}</p>
                  <p><strong>{t('totalMarks')}:</strong> {exam.total_marks}</p>
                </div>
                <div>
                  <p><strong>{t('time')}:</strong> {exam.total_time_minutes} min</p>
                  <p><strong>{t('examiner')}:</strong> {exam.examiner_name || "N/A"}</p>
                </div>
                {exam.negative_marks_value > 0 && (
                  <div>
                    <p><strong>{t('negativeMarking')}:</strong> {exam.negative_marks_value}</p>
                  </div>
                )}
              </div>
              
              <hr className="my-4" />
              
              {exam.description && (
                <div className="mb-6">
                  <p className="font-semibold">{t('instructions')}:</p>
                  <p className="text-sm italic">{exam.description}</p>
                </div>
              )}
              
              <h2 className="text-xl font-bold mb-4">{t('questions')}</h2>
              
              {exam.questions.map((q, idx) => (
                <div key={q.question_id} className="mb-6">
                  <p className="font-semibold">Q{idx + 1}. {q.question_text}</p>
                  
                  {q.question_image_url && (
                    <img 
                      src={q.question_image_url} 
                      alt="Question" 
                      className="my-2 max-w-xs max-h-40 object-contain"
                    />
                  )}
                  
                  <div className="ml-4 mt-2">
                    {['A', 'B', 'C', 'D'].map(letter => (
                      <div key={letter} className="mb-1">
                        <span className="font-semibold">{letter}.</span> {q.options[letter].text}
                        {q.options[letter].image_url && (
                          <img 
                            src={q.options[letter].image_url} 
                            alt={`Option ${letter}`} 
                            className="my-1 max-w-xs max-h-32 object-contain"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {includeAnswers && (
                    <p className="mt-2 text-green-600 font-semibold">
                      {t('answer')}: {q.correct_answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <div>
            {t('page')} {currentPage} {t('of')} {numPages}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))}
              disabled={currentPage === numPages}
              className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;