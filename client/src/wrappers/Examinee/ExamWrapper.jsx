import { useNavigate } from "react-router-dom";
import Exam from "../../pages/Examinee/Exam";

export default function ExamWrapper({ user, exam, setAnswers }) {
  const navigate = useNavigate();
  const handleSubmit = (answers, exam) => {
    setAnswers(answers);
    navigate("/result");
  };
  return <Exam user={user} exam={exam} onSubmit={handleSubmit} />;
}
