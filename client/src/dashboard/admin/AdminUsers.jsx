import { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { getUsers, createUser, setUserActive, getAdminClasses } from "../../lib/api";

const navItems = [
  { label: "Overview", to: "/dashboard/admin" },
  { label: "Users", to: "/dashboard/admin/users" },
  { label: "Classes & Teachers", to: "/dashboard/admin/classes" },
];

const ROLES = ["ADMIN", "PRINCIPAL", "TEACHER", "STUDENT", "PARENT", "WORKER"];

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  function loadUsers() {
    getUsers(token).then(setUsers).catch((e) => setError(e.message));
  }

  useEffect(() => {
    if (!token) return;
    loadUsers();
    getAdminClasses(token).then(setClasses).catch(() => {});
  }, [token]);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const form = e.target;
    const payload = {
      email: form.email.value,
      password: form.password.value,
      fullName: form.fullName.value,
      role,
    };

    if (role === "STUDENT") {
      payload.admissionNumber = form.admissionNumber.value;
      payload.pathway = form.pathway?.value || undefined;
      payload.classId = form.classId?.value || undefined;
    } else if (role === "TEACHER") {
      payload.staffNumber = form.staffNumber.value;
      payload.specialization = form.specialization?.value || undefined;
    } else if (role === "WORKER") {
      payload.staffNumber = form.staffNumber.value;
      payload.department = form.department.value;
      payload.jobTitle = form.jobTitle.value;
    }

    setSaving(true);
    try {
      await createUser(token, payload);
      setSuccess(`${role} account created.`);
      form.reset();
      loadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(u) {
    try {
      await setUserActive(token, u.id, !u.active);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <DashboardLayout title="Manage Users" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}
      {success && <p className="login-success">{success}</p>}

      <div className="admin-panel">
        <h2>Create Account</h2>
        <form className="admin-form" onSubmit={handleCreate}>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label>Full Name<input name="fullName" required /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Password<input name="password" type="password" required /></label>

          {role === "STUDENT" && (
            <>
              <label>Admission Number<input name="admissionNumber" required /></label>
              <label>Pathway<input name="pathway" placeholder="STEM / Social Sciences / Arts" /></label>
              <label>
                Class
                <select name="classId" defaultValue="">
                  <option value="">Unassigned</option>
                  {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
            </>
          )}

          {role === "TEACHER" && (
            <>
              <label>Staff Number<input name="staffNumber" required /></label>
              <label>Specialization<input name="specialization" placeholder="e.g. Mathematics" /></label>
            </>
          )}

          {role === "WORKER" && (
            <>
              <label>Staff Number<input name="staffNumber" required /></label>
              <label>Department<input name="department" required /></label>
              <label>Job Title<input name="jobTitle" required /></label>
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>

      <h2 style={{ marginTop: 40 }}>All Users</h2>
      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.active ? "Active" : "Inactive"}</td>
              <td>
                <button className="btn btn-outline btn-sm" onClick={() => toggleActive(u)}>
                  {u.active ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
