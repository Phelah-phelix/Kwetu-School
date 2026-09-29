import { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getTeacherClasses, getTeacherAssignments, createTeacherAssignment } from "../../lib/api";

const navItems = [
  { label: "My Classes", to: "/dashboard/teacher" },
  { label: "Assignments", to: "/dashboard/teacher/assignments" },
];

export default function TeacherAssignments() {
  const { token } = useAuth();
  const [classAssignments, setClassAssignments] = useState([]);
  const [homework, setHomework] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function load() {
    getTeacherAssignments(token).then(setHomework).catch((e) => setError(e.message));
  }

  useEffect(() => {
    if (!token) return;
    getTeacherClasses(token).then(setClassAssignments).catch((e) => setError(e.message));
    load();
  }, [token]);

  async function handleCreate(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    const form = e.target;
    const [classId, subjectId] = form.classSubject.value.split("|");
    try {
      await createTeacherAssignment(token, {
        title: form.title.value,
        description: form.description.value,
        classId,
        subjectId,
        dueDate: form.dueDate.value,
      });
      setSuccess("Assignment posted.");
      form.reset();
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <DashboardLayout title="Assignments" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}
      {success && <p className="login-success">{success}</p>}

      <div className="admin-panel">
        <h2>Post New Assignment</h2>
        <form className="admin-form" onSubmit={handleCreate}>
          <label>
            Class & Subject
            <select name="classSubject" required defaultValue="">
              <option value="" disabled>Select</option>
              {classAssignments.map((a) => (
                <option key={a.id} value={`${a.classId}|${a.subjectId}`}>
                  {a.class.name} — {a.subject.name}
                </option>
              ))}
            </select>
          </label>
          <label>Title<input name="title" required /></label>
          <label>Description<textarea name="description" rows="3" /></label>
          <label>Due Date<input name="dueDate" type="date" required /></label>
          <button type="submit" className="btn btn-primary">Post Assignment</button>
        </form>
      </div>

      <h2 style={{ marginTop: 40 }}>My Posted Assignments</h2>
      <table className="data-table">
        <thead><tr><th>Title</th><th>Class</th><th>Subject</th><th>Due</th><th>Submissions</th></tr></thead>
        <tbody>
          {homework.length === 0 && (
            <tr><td colSpan="5" style={{ color: "var(--muted)" }}>No assignments posted yet.</td></tr>
          )}
          {homework.map((h) => (
            <tr key={h.id}>
              <td>{h.title}</td>
              <td>{h.class.name}</td>
              <td>{h.subject.name}</td>
              <td>{new Date(h.dueDate).toLocaleDateString()}</td>
              <td>{h.submissions.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
