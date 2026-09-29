import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getPrincipalOverview, getPrincipalClasses } from "../lib/api";

const navItems = [
  { label: "Overview", to: "/dashboard/principal" },
];

export default function PrincipalDashboard() {
  const { token } = useAuth();
  const [overview, setOverview] = useState(null);
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    Promise.all([getPrincipalOverview(token), getPrincipalClasses(token)])
      .then(([ov, cls]) => {
        setOverview(ov);
        setClasses(cls);
      })
      .catch((e) => setError(e.message));
  }, [token]);

  return (
    <DashboardLayout title="School Overview" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}

      {overview && (
        <div className="dash-cards">
          <div className="dash-card">
            <p className="dash-card-label">Students</p>
            <p className="dash-card-value">{overview.students}</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">Teachers</p>
            <p className="dash-card-value">{overview.teachers}</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">Classes</p>
            <p className="dash-card-value">{overview.classes}</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">Support Staff</p>
            <p className="dash-card-value">{overview.workers}</p>
          </div>
        </div>
      )}

      <h2 style={{ marginTop: 40 }}>Classes & Teacher Allocation</h2>
      <table className="data-table">
        <thead>
          <tr><th>Class</th><th>Grade</th><th>Students</th><th>Subjects & Teachers</th></tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.gradeLevel}</td>
              <td>{c.students.length}</td>
              <td>
                {c.assignments.length === 0
                  ? "—"
                  : c.assignments
                      .map((a) => `${a.subject.name} (${a.teacher.user.fullName})`)
                      .join(", ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: 40 }}>Recent Performance Entries</h2>
      <table className="data-table">
        <thead>
          <tr><th>Student</th><th>Subject</th><th>Score</th><th>Teacher</th></tr>
        </thead>
        <tbody>
          {overview?.recentPerformance.length === 0 && (
            <tr><td colSpan="4" style={{ color: "var(--muted)" }}>No entries yet.</td></tr>
          )}
          {overview?.recentPerformance.map((p) => (
            <tr key={p.id}>
              <td>{p.student.user.fullName}</td>
              <td>{p.subject.name}</td>
              <td>{p.score}</td>
              <td>{p.teacher.user.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
