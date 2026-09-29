import { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getAdminQuizzes, createQuiz, getAdminSubjects } from "../../lib/api";

const navItems = [
  { label: "Overview", to: "/dashboard/admin" },
  { label: "Users", to: "/dashboard/admin/users" },
  { label: "Classes & Teachers", to: "/dashboard/admin/classes" },
  { label: "Timetable", to: "/dashboard/admin/timetable" },
  { label: "Holiday Quizzes", to: "/dashboard/admin/quizzes" },
];

const emptyQuestion = () => ({ question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "A" });

export default function AdminQuizzes() {
  const { token } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  function load() {
    getAdminQuizzes(token).then(setQuizzes).catch((e) => setError(e.message));
  }

  useEffect(() => {
    if (!token) return;
    load();
    getAdminSubjects(token).then(setSubjects).catch(() => {});
  }, [token]);

  function updateQuestion(index, field, value) {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
  }

  function addQuestion() {
    setQuestions((qs) => [...qs, emptyQuestion()]);
  }

  function removeQuestion(index) {
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    const form = e.target;
    try {
      await createQuiz(token, {
        title: form.title.value,
        subjectId: form.subjectId.value,
        gradeLevel: form.gradeLevel.value,
        openDate: form.openDate.value,
        closeDate: form.closeDate.value,
        questions,
      });
      setSuccess("Quiz created.");
      form.reset();
      setQuestions([emptyQuestion()]);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardLayout title="Holiday Quizzes" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}
      {success && <p className="login-success">{success}</p>}

      <div className="admin-panel">
        <h2>Create Holiday Quiz</h2>
        <form className="admin-form" onSubmit={handleCreate}>
          <label>Title<input name="title" required /></label>
          <label>
            Subject
            <select name="subjectId" required defaultValue="">
              <option value="" disabled>Select subject</option>
              {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label>Grade Level<input name="gradeLevel" type="number" required /></label>
          <label>Opens<input name="openDate" type="date" required /></label>
          <label>Closes<input name="closeDate" type="date" required /></label>

          <h3 style={{ marginTop: 12 }}>Questions</h3>
          {questions.map((q, i) => (
            <div key={i} className="quiz-question-row">
              <input
                placeholder={`Question ${i + 1}`}
                value={q.question}
                onChange={(e) => updateQuestion(i, "question", e.target.value)}
                required
              />
              <div className="quiz-options-grid">
                <input placeholder="Option A" value={q.optionA} onChange={(e) => updateQuestion(i, "optionA", e.target.value)} required />
                <input placeholder="Option B" value={q.optionB} onChange={(e) => updateQuestion(i, "optionB", e.target.value)} required />
                <input placeholder="Option C" value={q.optionC} onChange={(e) => updateQuestion(i, "optionC", e.target.value)} required />
                <input placeholder="Option D" value={q.optionD} onChange={(e) => updateQuestion(i, "optionD", e.target.value)} required />
              </div>
              <div className="quiz-correct-row">
                <label>
                  Correct Answer
                  <select value={q.correctOption} onChange={(e) => updateQuestion(i, "correctOption", e.target.value)}>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </label>
                {questions.length > 1 && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => removeQuestion(i)}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <button type="button" className="btn btn-outline btn-sm" onClick={addQuestion} style={{ alignSelf: "flex-start" }}>
            + Add Question
          </button>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Creating..." : "Create Quiz"}
          </button>
        </form>
      </div>

      <h2 style={{ marginTop: 40 }}>All Holiday Quizzes</h2>
      <table className="data-table">
        <thead><tr><th>Title</th><th>Subject</th><th>Grade</th><th>Questions</th><th>Attempts</th></tr></thead>
        <tbody>
          {quizzes.length === 0 && (
            <tr><td colSpan="5" style={{ color: "var(--muted)" }}>No quizzes created yet.</td></tr>
          )}
          {quizzes.map((q) => (
            <tr key={q.id}>
              <td>{q.title}</td>
              <td>{q.subject.name}</td>
              <td>{q.gradeLevel}</td>
              <td>{q.questions.length}</td>
              <td>{q.attempts.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
