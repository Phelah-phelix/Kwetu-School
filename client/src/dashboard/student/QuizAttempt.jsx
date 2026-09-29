import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getStudentQuiz, attemptQuiz } from "../../lib/api";

const navItems = [
  { label: "My Grades", to: "/dashboard/student" },
  { label: "Assignments", to: "/dashboard/student/assignments" },
  { label: "Holiday Quizzes", to: "/dashboard/student/quizzes" },
];

export default function QuizAttempt() {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    getStudentQuiz(token, id).then(setQuiz).catch((e) => setError(e.message));
  }, [token, id]);

  function selectAnswer(questionId, option) {
    setAnswers((a) => ({ ...a, [questionId]: option }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await attemptQuiz(token, id, answers);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!quiz) {
    return (
      <DashboardLayout title="Quiz" navItems={navItems}>
        {error ? <p className="login-error">{error}</p> : <p>Loading...</p>}
      </DashboardLayout>
    );
  }

  if (result) {
    return (
      <DashboardLayout title={quiz.title} navItems={navItems}>
        <div className="admin-panel" style={{ textAlign: "center" }}>
          <p className="eyebrow">Quiz Complete</p>
          <h2 style={{ marginTop: 8 }}>You scored {result.score}%</h2>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>
            {result.correctCount} out of {result.total} correct.
          </p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate("/dashboard/student/quizzes")}>
            Back to Quizzes
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={quiz.title} navItems={navItems}>
      {error && <p className="login-error">{error}</p>}
      <p style={{ color: "var(--muted)", marginBottom: 20 }}>{quiz.subject.name}</p>

      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, i) => (
          <div key={q.id} className="admin-panel" style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 12 }}>{i + 1}. {q.question}</p>
            {["A", "B", "C", "D"].map((opt) => (
              <label key={opt} className="quiz-option-label">
                <input
                  type="radio"
                  name={q.id}
                  required
                  checked={answers[q.id] === opt}
                  onChange={() => selectAnswer(q.id, opt)}
                />
                {q[`option${opt}`]}
              </label>
            ))}
          </div>
        ))}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </form>
    </DashboardLayout>
  );
}
