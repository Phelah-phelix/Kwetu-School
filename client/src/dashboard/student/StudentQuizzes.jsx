import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getStudentHolidayQuizzes } from "../../lib/api";

const navItems = [
  { label: "My Grades", to: "/dashboard/student" },
  { label: "Assignments", to: "/dashboard/student/assignments" },
  { label: "Holiday Quizzes", to: "/dashboard/student/quizzes" },
];

export default function StudentQuizzes() {
  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    getStudentHolidayQuizzes(token).then(setQuizzes).catch((e) => setError(e.message));
  }, [token]);

  return (
    <DashboardLayout title="Holiday Quizzes" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}

      {quizzes.length === 0 && !error && (
        <p style={{ color: "var(--muted)" }}>No holiday quizzes open right now.</p>
      )}

      {quizzes.map((q) => {
        const done = q.attempts.length > 0;
        return (
          <div key={q.id} className="student-row">
            <strong>{q.title}</strong> — {q.subject.name}
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4, marginBottom: 10 }}>
              {done ? `Completed — score ${q.attempts[0].score}%` : "Not attempted yet"}
            </p>
            {!done && (
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/dashboard/student/quizzes/${q.id}`)}>
                Take Quiz
              </button>
            )}
          </div>
        );
      })}
    </DashboardLayout>
  );
}
