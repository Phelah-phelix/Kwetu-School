import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getWorkerMe } from "../lib/api";

const navItems = [{ label: "My Profile", to: "/dashboard/worker" }];

export default function WorkerDashboard() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getWorkerMe(token).then(setProfile).catch((e) => setError(e.message));
  }, [token]);

  return (
    <DashboardLayout title="My Profile" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}

      {profile && (
        <div className="dash-cards">
          <div className="dash-card">
            <p className="dash-card-label">Staff Number</p>
            <p className="dash-card-value" style={{ fontSize: "1.2rem" }}>{profile.staffNumber}</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">Department</p>
            <p className="dash-card-value" style={{ fontSize: "1.2rem" }}>{profile.department}</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">Job Title</p>
            <p className="dash-card-value" style={{ fontSize: "1.2rem" }}>{profile.jobTitle}</p>
          </div>
          <div className="dash-card">
            <p className="dash-card-label">Email</p>
            <p className="dash-card-value" style={{ fontSize: "1rem" }}>{profile.user.email}</p>
          </div>
        </div>
      )}

      <p style={{ marginTop: 24, color: "var(--muted)" }}>
        Task assignments and schedules will appear here in a future update.
      </p>
    </DashboardLayout>
  );
}
