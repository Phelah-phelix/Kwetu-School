import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Academics from "./pages/Academics";
import Admissions from "./pages/Admissions";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./dashboard/AdminDashboard";
import AdminUsers from "./dashboard/admin/AdminUsers";
import AdminClasses from "./dashboard/admin/AdminClasses";
import AdminTimetable from "./dashboard/admin/AdminTimetable";
import AdminQuizzes from "./dashboard/admin/AdminQuizzes";
import TeacherDashboard from "./dashboard/TeacherDashboard";
import TeacherAssignments from "./dashboard/teacher/TeacherAssignments";
import StudentDashboard from "./dashboard/StudentDashboard";
import StudentAssignments from "./dashboard/student/StudentAssignments";
import StudentQuizzes from "./dashboard/student/StudentQuizzes";
import QuizAttempt from "./dashboard/student/QuizAttempt";
import ParentDashboard from "./dashboard/ParentDashboard";
import PrincipalDashboard from "./dashboard/PrincipalDashboard";
import WorkerDashboard from "./dashboard/WorkerDashboard";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/academics" element={<PublicLayout><Academics /></PublicLayout>} />
      <Route path="/admissions" element={<PublicLayout><Admissions /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/users"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/classes"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminClasses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/timetable"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminTimetable />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/quizzes"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminQuizzes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/teacher"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/teacher/assignments"
        element={
          <ProtectedRoute allowedRoles={["TEACHER"]}>
            <TeacherAssignments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/student/assignments"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentAssignments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/student/quizzes"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentQuizzes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/student/quizzes/:id"
        element={
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <QuizAttempt />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/parent"
        element={
          <ProtectedRoute allowedRoles={["PARENT"]}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/principal"
        element={
          <ProtectedRoute allowedRoles={["PRINCIPAL"]}>
            <PrincipalDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/worker"
        element={
          <ProtectedRoute allowedRoles={["WORKER"]}>
            <WorkerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
