import { useNavigate } from "react-router-dom";
import Result from "../../pages/Examinee/Result";

export default function ResultWrapper({ user, exam, answers, setExam, setAnswers }) {
  const navigate = useNavigate();
  const goHome = () => {
    setExam(null);
    setAnswers(null);
    navigate("/exams");
  };
  return <Result user={user} exam={exam} answers={answers} goHome={goHome} />;
}
