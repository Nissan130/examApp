import { questionsData } from "../../data/questions";

export default function Result({ user, exam, answers, goHome }) {
  const questions = questionsData[exam.id];

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answer) score++;
    });
    return score;
  };

  const score = calculateScore();

  return (
    <div className="pt-28 px-4 md:px-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {exam.title} - Result
      </h2>

      <p className="text-lg font-semibold mb-4">
        Score: {score} / {questions.length}
      </p>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold text-gray-800 mb-2">
              {q.id}. {q.text}
            </p>
            <p>
              <span className="font-medium">Your Answer: </span>
              <span className={answers[q.id] === q.answer ? "text-green-600" : "text-red-600"}>
                {answers[q.id] || "Not answered"}
              </span>
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Correct Answer: </span> {q.answer}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={goHome}
        className="mt-6 w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition-all"
      >
        Back to Exams
      </button>
    </div>
  );
}
