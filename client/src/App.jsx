import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import LandingPage from "./pages/LandingPage";
import ExamsList from "./pages/Examinee/ExamsList"; // Replace wrapper with actual page
// import ExamPage from "./pages/Examinee/ExamPage"; // Replace wrapper
// import ResultPage from "./pages/Examinee/ResultPage"; // Replace wrapper
import ExaminerDashboard from "./pages/Examiner/ExaminerDashboard";
import CreateExam from "./pages/Examiner/CreateExam";
import ShowExams from "./pages/Examiner/ShowExams";
import ViewExam from "./pages/Examiner/ViewExam";
import EditExam from "./pages/Examiner/EditExam";
import ExamineeDashboard from "./pages/Examinee/ExamineeDashboard";

// Components
import Navbar from "./components/Navbar";
import PreviousExams from "./pages/Examinee/PreviousExams";
import PreviewStartExam from "./pages/Examinee/PreviewStartExam";
import RunningExam from "./pages/Examinee/RunningExam";

function App() {
  const [user, setUser] = useState(null);
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState(null);

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      {/* Navbar visible always */}
      <Navbar user={user} setUser={setUser} onLogout={() => setUser(null)} />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route
          path="/login"
          element={<Login onLogin={(u) => setUser({ ...u })} />}
        />
        <Route
          path="/register"
          element={<Register onRegister={(u) => setUser({ ...u })} />}
        />

        {/* Examinee */}
        <Route
          path="/examinee/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "examinee" ? (
                <ExamineeDashboard user={user} />
              ) : (
                <Navigate to="/examiner/dashboard" />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/prevexam"
          element={
            <ProtectedRoute>
              <PreviousExams user={user} exam={exam} setExam={setExam} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/previewstartexam"
          element={
            <ProtectedRoute>
              <PreviewStartExam user={user} exam={exam} setExam={setExam} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/runningexam"
          element={
            <ProtectedRoute>
              <RunningExam user={user} exam={exam} setExam={setExam} />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/exam"
          element={
            <ProtectedRoute>
              <ExamPage user={user} exam={exam} setAnswers={setAnswers} />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route
          path="/result"
          element={
            <ProtectedRoute>
              <ResultPage
                user={user}
                exam={exam}
                answers={answers}
                setExam={setExam}
                setAnswers={setAnswers}
              />
            </ProtectedRoute>
          }
        /> */}

        {/* Examiner */}
        <Route
          path="/examiner/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? (
                <ExaminerDashboard user={user} />
              ) : (
                <Navigate to="/examinee/dashboard" />
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/create"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? <CreateExam /> : <Navigate to="/examinee/dashboard" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/showexams"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? <ShowExams /> : <Navigate to="/examinee/dashboard" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/viewexam/:id"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? <ViewExam /> : <Navigate to="/examinee/dashboard" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/editexam/:id"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? <EditExam /> : <Navigate to="/examinee/dashboard" />}
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={
            user ? (
              user.role === "examiner" ? (
                <Navigate to="/examiner/dashboard" />
              ) : (
                <Navigate to="/examinee/dashboard" />
              )
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
