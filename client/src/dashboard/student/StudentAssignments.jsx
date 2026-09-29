import { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getStudentAssignments, submitAssignment } from "../../lib/api";

const navItems = [
  { label: "My Grades", to: "/dashboard/student" },
  { label: "Assignments", to: "/dashboard/student/assignments" },
];

export default function StudentAssignments() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [submittingId, setSubmittingId] = useState(null);

  function load() {
    getStudentAssignments(token).then(setAssignments).catch((e) => setError(e.message));
  }

  useEffect(() => { if (token) load(); }, [token]);

  async function handleSubmit(id) {
    setSubmittingId(id);
    try {
      await submitAssignment(token, id);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <DashboardLayout title="My Assignments" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}

      <table className="data-table">
        <thead><tr><th>Title</th><th>Subject</th><th>Due</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {assignments.length === 0 && (
            <tr><td colSpan="5" style={{ color: "var(--muted)" }}>No assignments yet.</td></tr>
          )}
          {assignments.map((a) => {
            const submitted = a.submissions.length > 0 && a.submissions[0].submittedAt;
            return (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.subject.name}</td>
                <td>{new Date(a.dueDate).toLocaleDateString()}</td>
                <td>{submitted ? "Submitted" : "Pending"}</td>
                <td>
                  {!submitted && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSubmit(a.id)}
                      disabled={submittingId === a.id}
                    >
                      {submittingId === a.id ? "Submitting..." : "Mark Submitted"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
