import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getAdminStats } from "../lib/api";

const navItems = [
  { label: "Overview", to: "/dashboard/admin" },
  { label: "Users", to: "/dashboard/admin/users" },
  { label: "Classes & Teachers", to: "/dashboard/admin/classes" },
  { label: "Timetable", to: "/dashboard/admin/timetable" },
  { label: "Holiday Quizzes", to: "/dashboard/admin/quizzes" },
];

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getAdminStats(token)
      .then(setStats)
      .catch((err) => setError(err.message));
  }, [token]);

  return (
    <DashboardLayout title="Admin Overview" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}
      <div className="dash-cards">
        <div className="dash-card">
          <p className="dash-card-label">Total Students</p>
          <p className="dash-card-value">{stats ? stats.students : "—"}</p>
        </div>
        <div className="dash-card">
          <p className="dash-card-label">Total Teachers</p>
          <p className="dash-card-value">{stats ? stats.teachers : "—"}</p>
        </div>
        <div className="dash-card">
          <p className="dash-card-label">Active Classes</p>
          <p className="dash-card-value">{stats ? stats.classes : "—"}</p>
        </div>
        <div className="dash-card">
          <p className="dash-card-label">Open Assignments</p>
          <p className="dash-card-value">{stats ? stats.openAssignments : "—"}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
