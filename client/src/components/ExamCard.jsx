export default function ExamCard({ exam, onStart }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{exam.title}</h3>
      <p className="text-gray-600 mb-4">{exam.description}</p>
      <button
        onClick={() => onStart(exam)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
      >
        Start Exam
      </button>
    </div>
  );
}
