import React from "react";

export default function RunningExamQuestionCard({ question, selected, onAnswer, onClearAnswer, number }) {
  const optionLetters = ["A", "B", "C", "D"];
  

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-xs">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-100 text-blue-700 font-semibold text-xs flex-shrink-0">
            {number}
          </span>
          <h3 className="font-medium text-gray-800 text-sm leading-relaxed">
            {question.question_text}
          </h3>
        </div>
        
        {/* Clear Answer Button */}
        {selected && (
          <button
            onClick={() => onClearAnswer(question.question_id)}
            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 ml-3 flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Question Image */}
      {question.question_image_url && (
        <div className="mb-4 rounded-md overflow-hidden flex justify-center bg-gray-50 p-3 border border-gray-200">
          <img
            src={question.question_image_url}
            alt="Question"
            className="max-w-full max-h-56 object-contain rounded"
          />
        </div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {optionLetters.map((letter) => {
          const opt = question.options[letter];
          if (!opt) return null;

          const isSelected = selected === letter;
          
          return (
            <div key={letter} className="h-full">
              <label className="h-full">
                <input
                  type="radio"
                  name={question.question_id}
                  value={letter}
                  checked={isSelected}
                  onChange={() => onAnswer(question.question_id, letter)}
                  className="absolute opacity-0 h-0 w-0"
                />
                <div
                  className={`flex flex-col h-full p-3 rounded-lg border cursor-pointer transition-all duration-200 group
                    ${isSelected
                      ? "bg-blue-50 border-blue-300 shadow-xs"
                      : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                    }`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-md flex-shrink-0 font-semibold text-xs
                      ${isSelected 
                        ? "bg-blue-600 text-white shadow-xs" 
                        : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-700"}`}>
                      {letter}
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-700 text-sm">{opt.text}</span>
                    </div>
                  </div>

                  {/* Option Image */}
                  {opt.image_url && (
                    <div className="mt-2 flex justify-center">
                      <img
                        src={opt.image_url}
                        alt={`Option ${letter}`}
                        className="max-w-full max-h-32 object-contain rounded-md border border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}