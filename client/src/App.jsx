import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ExamsListWrapper from "./wrappers/Examinee/ExamsListWrapper";
import ExamWrapper from "./wrappers/Examinee/ExamWrapper";
import ResultWrapper from "./wrappers/Examinee/ResultWrapper";
import ExaminerDashboard from "./pages/Examiner/Dashboard";
import CreateExam from "./pages/Examiner/CreateExam";

// Components
import Navbar from "./components/Navbar";
import ShowExams from "./pages/Examiner/ShowExams";
import ViewExam from "./pages/Examiner/ViewExam";
import EditExam from "./pages/Examiner/EditExam";
import LandingPage from "./pages/LandingPage";

function App() {
  const [user, setUser] = useState(null);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState(null);

  const ProtectedRoute = ({ children }) => (user ? children : <Navigate to="/login" />);

  return (
    <Router>
      {user && <Navbar user={user} onLogout={() => setUser(null)} />}
      <Routes>
        <Route
          path="/"
          element={user ? (
            user.role === "examiner" ? <Navigate to="/examiner/dashboard" /> : <Navigate to="/exams" />
          ) : <Navigate to="/landingpage" />}
        />
        <Route path="/landingpage" element={<LandingPage/>} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register onRegister={setUser} />} />

        {/* Examinee */}
        <Route path="/exams" element={<ProtectedRoute><ExamsListWrapper user={user} exam={exam} setExam={setExam} /></ProtectedRoute>} />
        <Route path="/exam" element={<ProtectedRoute><ExamWrapper user={user} exam={exam} setAnswers={setAnswers} /></ProtectedRoute>} />
        <Route path="/result" element={<ProtectedRoute><ResultWrapper user={user} exam={exam} answers={answers} setExam={setExam} setAnswers={setAnswers} /></ProtectedRoute>} />

        {/* Examiner */}
        <Route path="/examiner/dashboard" element={<ProtectedRoute>{user?.role === "examiner" ? <ExaminerDashboard user={user} /> : <Navigate to="/exams" />}</ProtectedRoute>} />
        <Route path="/examiner/create" element={<ProtectedRoute>{user?.role === "examiner" ? <CreateExam /> : <Navigate to="/exams" />}</ProtectedRoute>} />
        <Route path="/examiner/showexams" element={<ProtectedRoute>{user?.role === "examiner" ? <ShowExams /> : <Navigate to="/exams" />}</ProtectedRoute>} />
        <Route
          path="/examiner/viewexam/:id"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? <ViewExam /> : <Navigate to="/exams" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/editexam/:id"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? <EditExam /> : <Navigate to="/exams" />}
            </ProtectedRoute>
          }
        />


        {/* Catch all */}
        <Route path="*" element={<Navigate to={user ? (user.role === "examiner" ? "/examiner/dashboard" : "/exams") : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
