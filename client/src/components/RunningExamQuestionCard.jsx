import React from "react";

export default function RunningExamQuestionCard({ question, selected, onAnswer, onClearAnswer, number }) {
  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Question Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold text-sm flex-shrink-0 shadow-sm">
            {number}
          </span>
          <h3 className="font-medium text-slate-900 text-base leading-relaxed">
            {question.question_text}
          </h3>
        </div>
        
        {/* Clear Answer Button */}
        {selected && (
          <button
            onClick={() => onClearAnswer(question.question_id)}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-2 ml-3 flex-shrink-0 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        )}
      </div>

      {/* Question Image */}
      {question.question_image_url && (
        <div className="mb-5 rounded-xl overflow-hidden flex justify-center bg-slate-50 p-4 border border-slate-200">
          <img
            src={question.question_image_url}
            alt="Question"
            className="max-w-full max-h-40 object-contain rounded-lg"
          />
        </div>
      )}

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {optionLetters.map((letter) => {
          const opt = question.options[letter];
          if (!opt) return null;

          const isSelected = selected === letter;
          
          return (
            <div key={letter} className="h-full">
              <label className="h-full cursor-pointer block">
                <input
                  type="radio"
                  name={question.question_id}
                  value={letter}
                  checked={isSelected}
                  onChange={() => onAnswer(question.question_id, letter)}
                  className="absolute opacity-0 h-0 w-0"
                />
                <div
                  className={`flex flex-col h-full p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group hover:shadow-md
                    ${isSelected
                      ? "bg-gradient-to-r from-teal-50 to-cyan-50 border-teal-300 shadow-sm"
                      : "border-slate-200 hover:border-teal-200 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 font-semibold text-sm transition-all duration-200
                      ${isSelected 
                        ? "bg-gradient-to-r from-teal-600 to-cyan-700 text-white shadow-sm" 
                        : "bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-700"}`}>
                      {letter}
                    </div>
                    <div className="flex-1">
                      <span className="text-slate-700 text-sm leading-relaxed">{opt.text}</span>
                    </div>
                  </div>

                  {/* Option Image */}
                  {opt.image_url && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={opt.image_url}
                        alt={`Option ${letter}`}
                        className="max-w-full max-h-24 object-contain rounded-lg border border-slate-200"
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