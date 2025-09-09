import { useState } from "react";
import { questions as demoQuestions } from "../data/questions";

export default function Questions() {
  const [questions, setQuestions] = useState(demoQuestions[1]); // demo exam 1
  const [newQ, setNewQ] = useState({ question: "", answer: "" });

  const addQuestion = () => {
    setQuestions([...questions, { ...newQ, id: questions.length + 1 }]);
    setNewQ({ question: "", answer: "" });
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Questions</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Question"
          value={newQ.question}
          onChange={(e) => setNewQ({ ...newQ, question: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Answer"
          value={newQ.answer}
          onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <button onClick={addQuestion} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Question
        </button>
      </div>
      <ul className="space-y-3">
        {questions.map((q) => (
          <li key={q.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
            <span>{q.question} — <strong>{q.answer}</strong></span>
            <button onClick={() => deleteQuestion(q.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
