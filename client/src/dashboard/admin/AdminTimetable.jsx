import { useEffect, useState } from "react";
import DashboardLayout from "../DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminClasses, getAdminSubjects, getAdminTeachers,
  getAdminTimetable, createTimetableSlot,
} from "../../lib/api";

const navItems = [
  { label: "Overview", to: "/dashboard/admin" },
  { label: "Users", to: "/dashboard/admin/users" },
  { label: "Classes & Teachers", to: "/dashboard/admin/classes" },
  { label: "Timetable", to: "/dashboard/admin/timetable" },
  { label: "Holiday Quizzes", to: "/dashboard/admin/quizzes" },
];

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
];

export default function AdminTimetable() {
  const { token } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;
    getAdminClasses(token).then(setClasses).catch((e) => setError(e.message));
    getAdminSubjects(token).then(setSubjects).catch(() => {});
    getAdminTeachers(token).then(setTeachers).catch(() => {});
  }, [token]);

  function loadSlots(classId) {
    setSelectedClass(classId);
    if (!classId) return setSlots([]);
    getAdminTimetable(token, classId).then(setSlots).catch((e) => setError(e.message));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(""); setSuccess("");
    const form = e.target;
    try {
      await createTimetableSlot(token, {
        classId: selectedClass,
        subjectId: form.subjectId.value,
        teacherId: form.teacherId.value,
        dayOfWeek: form.dayOfWeek.value,
        startTime: form.startTime.value,
        endTime: form.endTime.value,
      });
      setSuccess("Slot added.");
      form.reset();
      loadSlots(selectedClass);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <DashboardLayout title="Timetable Builder" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}
      {success && <p className="login-success">{success}</p>}

      <label style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 320, fontWeight: 500, fontSize: "0.9rem" }}>
        Select Class
        <select value={selectedClass} onChange={(e) => loadSlots(e.target.value)}>
          <option value="">— Choose a class —</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>

      {selectedClass && (
        <>
          <div className="admin-panel" style={{ marginTop: 24 }}>
            <h2>Add Timetable Slot</h2>
            <form className="admin-form" onSubmit={handleCreate}>
              <label>
                Subject
                <select name="subjectId" required defaultValue="">
                  <option value="" disabled>Select subject</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </label>
              <label>
                Teacher
                <select name="teacherId" required defaultValue="">
                  <option value="" disabled>Select teacher</option>
                  {teachers.map((t) => <option key={t.id} value={t.id}>{t.user.fullName}</option>)}
                </select>
              </label>
              <label>
                Day
                <select name="dayOfWeek" required defaultValue="">
                  <option value="" disabled>Select day</option>
                  {DAYS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </label>
              <label>Start Time<input name="startTime" type="time" required /></label>
              <label>End Time<input name="endTime" type="time" required /></label>
              <button type="submit" className="btn btn-primary">Add Slot</button>
            </form>
          </div>

          <h2 style={{ marginTop: 32 }}>Current Timetable</h2>
          <table className="data-table">
            <thead><tr><th>Day</th><th>Time</th><th>Subject</th><th>Teacher</th></tr></thead>
            <tbody>
              {slots.length === 0 && (
                <tr><td colSpan="4" style={{ color: "var(--muted)" }}>No slots added yet.</td></tr>
              )}
              {slots.map((s) => (
                <tr key={s.id}>
                  <td>{DAYS.find((d) => d.value === s.dayOfWeek)?.label}</td>
                  <td>{s.startTime} – {s.endTime}</td>
                  <td>{s.subject.name}</td>
                  <td>{s.teacher.user.fullName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </DashboardLayout>
  );
}
