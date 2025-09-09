export default function QuestionCard({ question, selected, onAnswer }) {
  const optionLetters = ["A", "B", "C", "D"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* Question text */}
      <p className="font-semibold text-gray-800 text-lg mb-4">
        <span className="text-blue-600 font-bold mr-2">{question.id}.</span>
        {question.text}
      </p>

      {/* Question image if exists */}
      {question.image && (
        <div className="mb-4 flex justify-center">
          <img src={question.image} alt="question" className="rounded-lg max-h-64 object-contain" />
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((opt, idx) => (
          <label
            key={idx}
            className={`flex flex-col items-center p-3 border rounded-xl cursor-pointer transition-all duration-200
              ${selected === optionLetters[idx] ? "bg-blue-100 border-blue-400 shadow-inner" : "hover:bg-gray-100"}`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={optionLetters[idx]}
              checked={selected === optionLetters[idx]}
              onChange={() => onAnswer(question.id, optionLetters[idx])}
              className="mb-2 w-5 h-5 accent-blue-500"
            />

            {/* Show text or image */}
            {opt.type === "text" ? (
              <span className="text-gray-700 font-medium">
                {optionLetters[idx]}. {opt.value}
              </span>
            ) : (
              <img src={opt.value} alt={`option-${optionLetters[idx]}`} className="max-h-32 object-contain rounded-md" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
