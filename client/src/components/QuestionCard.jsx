import React from "react";

export default function QuestionCard({ question, selected, onAnswer, number }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      {/* Question */}
      <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
{/* Number Badge */}
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm">
          {number}
        </span>
        {question.question}
      </h3>

      {/* Question Image */}
      {question.questionImage && (
        <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
          <img
            src={question.questionImage}
            alt="Question"
            className="w-full max-h-64 object-contain"
          />
        </div>
      )}

      {/* Options */}
      <ul className="space-y-3">
        {question.options.map((opt, idx) => {
          const optImage = question.optionImages?.[idx]; // Get corresponding option image
          return (
            <li key={idx}>
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200
                  ${selected === opt
                    ? "bg-blue-50 border-blue-400 shadow-sm"
                    : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={opt}
                  checked={selected === opt}
                  onChange={() => onAnswer(question.id, opt)}
                  className="accent-blue-500"
                />

                {/* Option Text */}
                <span className="text-gray-700">{opt}</span>

                {/* Option Image */}
                {optImage && (
                  <img
                    src={optImage}
                    alt="Option"
                    className="w-40 h-40 object-contain rounded border border-gray-200"
                  />
                )}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
