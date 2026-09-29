import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import {
  getStudentMe,
  getStudentPerformance,
  getStudentTimetable,
  getStudentHolidayQuizzes,
} from "../lib/api";

const navItems = [
  { label: "My Grades", to: "/dashboard/student" },
  { label: "Assignments", to: "/dashboard/student/assignments" },
  { label: "Holiday Quizzes", to: "/dashboard/student/quizzes" },
];

const DAYS = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function StudentDashboard() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    Promise.all([
      getStudentMe(token),
      getStudentPerformance(token),
      getStudentTimetable(token),
      getStudentHolidayQuizzes(token),
    ])
      .then(([me, perf, tt, hq]) => {
        setProfile(me);
        setPerformance(perf);
        setTimetable(tt);
        setQuizzes(hq);
      })
      .catch((e) => setError(e.message));
  }, [token]);

  return (
    <DashboardLayout title="My Dashboard" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}

      {profile && (
        <div className="dash-cards" style={{ marginBottom: 32 }}>
          <div className="dash-card">
            <p className="dash-card-label">Admission No.</p>
            <p className="dash-card-value" style={{ fontSize: "1.2rem" }}>{profile.admissionNumber}</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">Class</p>
            <p className="dash-card-value" style={{ fontSize: "1.2rem" }}>{profile.class?.name || "Unassigned"}</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">Pathway</p>
            <p className="dash-card-value" style={{ fontSize: "1.2rem" }}>{profile.pathway || "—"}</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">Open Holiday Quizzes</p>
            <p className="dash-card-value">{quizzes.length}</p>
          </div>
        </div>
      )}

      <h2>Performance Records</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th>Term</th>
            <th>Year</th>
            <th>Score</th>
            <th>Competency</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {performance.length === 0 && (
            <tr><td colSpan="6" style={{ color: "var(--muted)" }}>No grades recorded yet.</td></tr>
          )}
          {performance.map((p) => (
            <tr key={p.id}>
              <td>{p.subject.name}</td>
              <td>{p.term.replace("_", " ")}</td>
              <td>{p.year}</td>
              <td>{p.score}</td>
              <td>{p.competencyLevel}</td>
              <td>{p.remarks || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 40 }}>Timetable</h2>
      <table className="data-table">
        <thead>
          <tr><th>Day</th><th>Time</th><th>Subject</th><th>Teacher</th></tr>
        </thead>
        <tbody>
          {timetable.length === 0 && (
            <tr><td colSpan="4" style={{ color: "var(--muted)" }}>No timetable set yet.</td></tr>
          )}
          {timetable.map((t) => (
            <tr key={t.id}>
              <td>{DAYS[t.dayOfWeek]}</td>
              <td>{t.startTime} – {t.endTime}</td>
              <td>{t.subject.name}</td>
              <td>{t.teacher.user.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 40 }}>Holiday Quizzes</h2>
      {quizzes.length === 0 && (
        <p style={{ color: "var(--muted)" }}>No holiday quizzes open right now.</p>
      )}
      {quizzes.map((q) => (
        <div key={q.id} className="student-row">
          <strong>{q.title}</strong> — {q.subject.name}
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>
            {q.attempts.length > 0 ? `Completed — score ${q.attempts[0].score}` : "Not attempted yet"}
          </p>
        </div>
      ))}
    </DashboardLayout>
  );
}
