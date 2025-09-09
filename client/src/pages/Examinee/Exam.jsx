import { useState } from "react";
import QuestionCard from "../../components/QuestionCard";
import Timer from "../../components/Timer";
import { questionsData } from "../../data/questions";

export default function Exam({ user, exam, onSubmit }) {
  const [answers, setAnswers] = useState({});
  const questions = questionsData[exam.id];

  const handleAnswer = (id, value) => setAnswers({ ...answers, [id]: value });
  const handleSubmit = () => onSubmit(answers, exam);
  const handleTimeUp = () => onSubmit(answers, exam);

  return (
    <div className="bg-gray-50 min-h-screen pt-28 px-4 md:px-8 max-w-4xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded shadow-md sticky top-16 z-40">
        <h2 className="text-2xl font-bold">{exam.title}</h2>
        <Timer duration={exam.duration} onTimeUp={handleTimeUp} />
      </div>
      <div className="space-y-4">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} selected={answers[q.id]} onAnswer={handleAnswer} />
        ))}
      </div>
      <button onClick={handleSubmit} className="mt-6 w-full bg-green-500 text-white py-3 rounded shadow hover:bg-green-600">
        Submit Exam
      </button>
    </div>
  );
}
