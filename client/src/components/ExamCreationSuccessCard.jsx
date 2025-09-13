// components/ExamSuccessCard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ExamCreationSuccessCard = ({ examCode, examLink }) => {
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(examLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(examCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Exam Created Successfully!</h3>
          <p className="text-gray-600 text-sm mt-1">Share this with your students</p>
        </div>

        {/* Exam Code */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Exam Code</label>
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 py-2">
            <span className="font-mono text-blue-600 font-semibold">{examCode}</span>
            <button
              onClick={handleCopyCode}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium min-w-[60px] transition-colors duration-200"
            >
              {copiedCode ? (
                <span className="text-green-600 font-semibold">✓ Copied</span>
              ) : (
                "Copy"
              )}
            </button>
          </div>
        </div>

        {/* Shareable Link */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Shareable Link</label>
          <div className="bg-white border border-gray-300 rounded-md p-3 mb-3">
            <p className="text-xs text-gray-600 break-all">{examLink}</p>
          </div>
          
          {/* Combined Copy Link and View All Exams buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCopyLink}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
            >
              {copiedLink ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
            
            <button
              onClick={() => navigate("/examiner/all-created-exam")}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View All Exams
            </button>
          </div>
        </div>

        {/* Quick Tip */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Students can join using the code or by clicking the link
        </p>
      </div>
    </div>
  );
};

export default ExamCreationSuccessCard;