import { useState } from "react";
import { exams as demoExams } from "../data/exams";

export default function Exams() {
  const [exams, setExams] = useState(demoExams);
  const [newExam, setNewExam] = useState({ title: "", description: "", duration: 300 });

  const addExam = () => {
    setExams([...exams, { ...newExam, id: exams.length + 1 }]);
    setNewExam({ title: "", description: "", duration: 300 });
  };

  const deleteExam = (id) => {
    setExams(exams.filter((exam) => exam.id !== id));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Exams</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Exam Title"
          value={newExam.title}
          onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newExam.description}
          onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <button onClick={addExam} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Exam
        </button>
      </div>
      <ul className="space-y-3">
        {exams.map((exam) => (
          <li key={exam.id} className="flex justify-between items-center bg-white p-4 rounded shadow">
            <div>
              <h3 className="font-bold">{exam.title}</h3>
              <p className="text-sm text-gray-600">{exam.description}</p>
            </div>
            <button onClick={() => deleteExam(exam.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
