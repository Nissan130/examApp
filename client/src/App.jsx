import { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import LandingPage from "./pages/LandingPage";
import ExaminerDashboard from "./pages/Examiner/ExaminerDashboard";
import CreateExam from "./pages/Examiner/CreateExam";
import ExamineeDashboard from "./pages/Examinee/ExamineeDashboard";
import PreviousExams from "./pages/Examinee/PreviousExams";
import PreviewStartExam from "./pages/Examinee/PreviewStartExam";
import RunningExam from "./pages/Examinee/RunningExam";

// Components
import Navbar from "./components/Navbar";
import { GlobalContext } from "./context/GlobalContext";
import AllCreatedExams from "./pages/Examiner/AllCreatedExams";
import ViewCreatedExam from "./pages/Examiner/ViewCreatedExam";
import EditCreatedExam from "./pages/Examiner/EditCreatedExam";
import PDFGenerator from "./components/PDFGenerator";

function App() {
  const { user, currentRole, loading } = useContext(GlobalContext);
  const [exam, setExam] = useState(null);

  // ✅ Wait until context finishes loading user/token
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Protected Route wrapper with role check
  const ProtectedRoute = ({ children, requiredRole = null }) => {
    if (!user) return <Navigate to="/login" />;
    
    // If a specific role is required but user doesn't have it
    if (requiredRole && currentRole !== requiredRole) {
      // Redirect to the dashboard of their current role
      return <Navigate to={`/${currentRole}/dashboard`} />;
    }
    
    return children;
  };

  return (
    <Router>
      {/* Navbar visible always */}
      <Navbar />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to={`/${currentRole}/dashboard`} />} />

        {/* Auth */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${currentRole}/dashboard`} />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${currentRole}/dashboard`} />} />

        {/* Examinee Routes */}
        <Route
          path="/examinee/dashboard"
          element={
            <ProtectedRoute requiredRole="examinee">
              <ExamineeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prevexam"
          element={
            <ProtectedRoute requiredRole="examinee">
              <PreviousExams exam={exam} setExam={setExam} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/previewstartexam"
          element={
            <ProtectedRoute requiredRole="examinee">
              <PreviewStartExam exam={exam} setExam={setExam} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/runningexam"
          element={
            <ProtectedRoute requiredRole="examinee">
              <RunningExam exam={exam} setExam={setExam} />
            </ProtectedRoute>
          }
        />

        {/* Examiner Routes */}
        <Route
          path="/examiner/dashboard"
          element={
            <ProtectedRoute requiredRole="examiner">
              <ExaminerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/create-exam"
          element={
            <ProtectedRoute requiredRole="examiner">
              <CreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/all-created-exam"
          element={
            <ProtectedRoute requiredRole="examiner">
              <AllCreatedExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/pdf-generator"
          element={
            <ProtectedRoute requiredRole="examiner">
              <PDFGenerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/my-created-exam/view-created-exam/:examId"
          element={
            <ProtectedRoute requiredRole="examiner">
              <ViewCreatedExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/examiner/my-created-exam/edit-created-exam/:examId"
          element={
            <ProtectedRoute requiredRole="examiner">
              <EditCreatedExam />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route
          path="*"
          element={
            user ? (
              <Navigate to={`/${currentRole}/dashboard`} />
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