import { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminClasses, createClass, getAdminSubjects, getAdminTeachers, createAssignment,
} from "../../lib/api";

const navItems = [
  { label: "Overview", to: "/dashboard/admin" },
  { label: "Users", to: "/dashboard/admin/users" },
  { label: "Classes & Teachers", to: "/dashboard/admin/classes" },
];

export default function AdminClasses() {
  const { token } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function loadClasses() {
    getAdminClasses(token).then(setClasses).catch((e) => setError(e.message));
  }

  useEffect(() => {
    if (!token) return;
    loadClasses();
    getAdminSubjects(token).then(setSubjects).catch(() => {});
    getAdminTeachers(token).then(setTeachers).catch(() => {});
  }, [token]);

  async function handleCreateClass(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    const form = e.target;
    try {
      await createClass(token, {
        name: form.name.value,
        gradeLevel: form.gradeLevel.value,
        pathway: form.pathway.value || undefined,
      });
      setSuccess("Class created.");
      form.reset();
      loadClasses();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAssign(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    const form = e.target;
    try {
      await createAssignment(token, {
        teacherId: form.teacherId.value,
        classId: form.classId.value,
        subjectId: form.subjectId.value,
      });
      setSuccess("Teacher assigned.");
      form.reset();
      loadClasses();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <DashboardLayout title="Classes & Teacher Allocation" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}
      {success && <p className="login-success">{success}</p>}

      <div className="admin-panel-row">
        <div className="admin-panel">
          <h2>Create Class</h2>
          <form className="admin-form" onSubmit={handleCreateClass}>
            <label>Name<input name="name" placeholder="Grade 10 West" required /></label>
            <label>Grade Level<input name="gradeLevel" type="number" required /></label>
            <label>Pathway<input name="pathway" placeholder="STEM / Social Sciences / Arts" /></label>
            <button type="submit" className="btn btn-primary">Create Class</button>
          </form>
        </div>

        <div className="admin-panel">
          <h2>Assign Teacher</h2>
          <form className="admin-form" onSubmit={handleAssign}>
            <label>
              Teacher
              <select name="teacherId" required defaultValue="">
                <option value="" disabled>Select teacher</option>
                {teachers.map((t) => <option key={t.id} value={t.id}>{t.user.fullName}</option>)}
              </select>
            </label>
            <label>
              Class
              <select name="classId" required defaultValue="">
                <option value="" disabled>Select class</option>
                {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label>
              Subject
              <select name="subjectId" required defaultValue="">
                <option value="" disabled>Select subject</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </label>
            <button type="submit" className="btn btn-primary">Assign</button>
          </form>
        </div>
      </div>

      <h2 style={{ marginTop: 40 }}>All Classes</h2>
      <table className="data-table">
        <thead><tr><th>Class</th><th>Grade</th><th>Pathway</th></tr></thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}><td>{c.name}</td><td>{c.gradeLevel}</td><td>{c.pathway || "—"}</td></tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
