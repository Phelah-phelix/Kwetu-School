import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getTeacherClasses, getClassStudents, recordPerformance } from "../lib/api";

const navItems = [
  { label: "My Classes", to: "/dashboard/teacher" },
  { label: "Assignments", to: "/dashboard/teacher/assignments" },
];

const COMPETENCY_LEVELS = [
  "Exceeding Expectation",
  "Meeting Expectation",
  "Approaching Expectation",
  "Below Expectation",
];

export default function TeacherDashboard() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState(null); // { classId, subjectId }
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    if (!token) return;
    getTeacherClasses(token).then(setAssignments).catch((e) => setError(e.message));
  }, [token]);

  function openClass(a) {
    setSelected(a);
    setStudents([]);
    getClassStudents(token, a.classId)
      .then(setStudents)
      .catch((e) => setError(e.message));
  }

  async function handleGradeSubmit(e, studentId) {
    e.preventDefault();
    const form = e.target;
    const payload = {
      studentId,
      subjectId: selected.subjectId,
      term: form.term.value,
      year: form.year.value,
      score: form.score.value,
      competencyLevel: form.competencyLevel.value,
      remarks: form.remarks.value,
    };

    setSavingId(studentId);
    try {
      await recordPerformance(token, payload);
      setSavedId(studentId);
      form.reset();
      setTimeout(() => setSavedId(null), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <DashboardLayout title="My Classes" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}

      <div className="class-tabs">
        {assignments.map((a) => (
          <button
            key={a.id}
            className={`class-tab ${selected?.id === a.id ? "active" : ""}`}
            onClick={() => openClass(a)}
          >
            {a.class.name} &middot; {a.subject.name}
          </button>
        ))}
      </div>

      {selected && (
        <div className="roster">
          <h2 style={{ marginTop: 24 }}>
            {selected.class.name} — {selected.subject.name} Roster
          </h2>

          {students.length === 0 && (
            <p style={{ color: "var(--muted)", marginTop: 12 }}>No students in this class yet.</p>
          )}

          {students.map((s) => (
            <div key={s.id} className="student-row">
              <div className="student-info">
                <strong>{s.user.fullName}</strong>
                <span>{s.admissionNumber}</span>
              </div>

              <form
                className="grade-form"
                onSubmit={(e) => handleGradeSubmit(e, s.id)}
              >
                <select name="term" required defaultValue="">
                  <option value="" disabled>Term</option>
                  <option value="TERM_1">Term 1</option>
                  <option value="TERM_2">Term 2</option>
                  <option value="TERM_3">Term 3</option>
                </select>
                <input name="year" type="number" placeholder="Year" defaultValue={new Date().getFullYear()} required />
                <input name="score" type="number" step="0.1" min="0" max="100" placeholder="Score" required />
                <select name="competencyLevel" required defaultValue="">
                  <option value="" disabled>Competency</option>
                  {COMPETENCY_LEVELS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input name="remarks" type="text" placeholder="Remarks (optional)" />
                <button type="submit" className="btn btn-primary btn-sm" disabled={savingId === s.id}>
                  {savingId === s.id ? "Saving..." : savedId === s.id ? "Saved ✓" : "Save Grade"}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
