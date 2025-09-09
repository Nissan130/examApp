import ExamCard from "../../components/ExamCard";
import { exams } from "../../data/exams";

export default function ExamsList({ user, onStartExam }) {
  return (
    <div className="pt-28 px-4 md:px-8 max-w-5xl mx-auto bg-yellow-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Available Exams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <ExamCard key={exam.id} exam={exam} onStart={onStartExam} />
        ))}
      </div>
    </div>
  );
}
