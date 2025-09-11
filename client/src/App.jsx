import { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import LandingPage from "./pages/LandingPage";
import ExaminerDashboard from "./pages/Examiner/ExaminerDashboard";
import CreateExam from "./pages/Examiner/CreateExam";
import EditExam from "./pages/Examiner/EditExam";
import ExamineeDashboard from "./pages/Examinee/ExamineeDashboard";
import PreviousExams from "./pages/Examinee/PreviousExams";
import PreviewStartExam from "./pages/Examinee/PreviewStartExam";
import RunningExam from "./pages/Examinee/RunningExam";

// Components
import Navbar from "./components/Navbar";
import { GlobalContext } from "./context/GlobalContext";
import AllCreatedExams from "./pages/Examiner/AllCreatedExams";
import ViewCreatedExam from "./pages/Examiner/ViewCreatedExam";

function App() {
  const { user, loading } = useContext(GlobalContext);
  const [exam, setExam] = useState(null);


  // ✅ Wait until context finishes loading user/token
  if (loading) return null; // or show a spinner/loader


  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      {/* Navbar visible always */}
      <Navbar />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Examinee */}
        <Route
          path="/examinee/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "examinee" ? <ExamineeDashboard /> : <Navigate to="/examiner/dashboard" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/prevexam"
          element={
            <ProtectedRoute>
              <PreviousExams exam={exam} setExam={setExam} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/previewstartexam"
          element={
            <ProtectedRoute>
              <PreviewStartExam exam={exam} setExam={setExam} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/runningexam"
          element={
            <ProtectedRoute>
              <RunningExam exam={exam} setExam={setExam} />
            </ProtectedRoute>
          }
        />

        {/* Examiner */}
        <Route
          path="/examiner/dashboard"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? <ExaminerDashboard /> : <Navigate to="/examinee/dashboard" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/create-exam"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? <CreateExam /> : <Navigate to="/examinee/dashboard" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/all-created-exam"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? <AllCreatedExams /> : <Navigate to="/examinee/dashboard" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/my-created-exam/view-created-exam/:examId"
          element={
            <ProtectedRoute>
              {user?.role === "examiner" ? <ViewCreatedExam /> : <Navigate to="/examinee/dashboard" />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/editexam/:examId"
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
