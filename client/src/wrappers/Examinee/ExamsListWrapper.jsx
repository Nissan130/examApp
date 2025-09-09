import { useNavigate } from "react-router-dom";
import ExamsList from "../../pages/Examinee/ExamsList";

export default function ExamsListWrapper({ user, exam, setExam }) {
  const navigate = useNavigate();
  const handleStartExam = (exam) => {
    setExam(exam);
    navigate("/exam");
  };
  return <ExamsList user={user} onStartExam={handleStartExam} />;
}
