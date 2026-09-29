import { useEffect, useState } from "react";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import { getParentChildren, getChildPerformance } from "../lib/api";

const navItems = [{ label: "My Children", to: "/dashboard/parent" }];

export default function ParentDashboard() {
  const { token } = useAuth();
  const [children, setChildren] = useState([]);
  const [selected, setSelected] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getParentChildren(token)
      .then((kids) => {
        setChildren(kids);
        if (kids.length > 0) openChild(kids[0]);
      })
      .catch((e) => setError(e.message));
  }, [token]);

  function openChild(child) {
    setSelected(child);
    getChildPerformance(token, child.id)
      .then(setPerformance)
      .catch((e) => setError(e.message));
  }

  return (
    <DashboardLayout title="My Children" navItems={navItems}>
      {error && <p className="login-error">{error}</p>}

      {children.length === 0 && !error && (
        <p style={{ color: "var(--muted)" }}>No children linked to your account yet.</p>
      )}

      <div className="class-tabs">
        {children.map((c) => (
          <button
            key={c.id}
            className={`class-tab ${selected?.id === c.id ? "active" : ""}`}
            onClick={() => openChild(c)}
          >
            {c.user.fullName}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div className="dash-cards" style={{ marginTop: 24, marginBottom: 24 }}>
            <div className="dash-card">
              <p className="dash-card-label">Admission No.</p>
              <p className="dash-card-value" style={{ fontSize: "1.2rem" }}>{selected.admissionNumber}</p>
            </div>
            <div className="dash-card">
              <p className="dash-card-label">Class</p>
              <p className="dash-card-value" style={{ fontSize: "1.2rem" }}>{selected.class?.name || "Unassigned"}</p>
            </div>
            <div className="dash-card">
              <p className="dash-card-label">Pathway</p>
              <p className="dash-card-value" style={{ fontSize: "1.2rem" }}>{selected.pathway || "—"}</p>
            </div>
          </div>

          <h2>Performance Records</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th><th>Term</th><th>Year</th><th>Score</th><th>Competency</th><th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {performance.length === 0 && (
                <tr><td colSpan="6" style={{ color: "var(--muted)" }}>No grades recorded yet.</td></tr>
              )}
              {performance.map((p) => (
                <tr key={p.id}>
                  <td>{p.subject.name}</td>
                  <td>{p.term.replace("_", " ")}</td>
                  <td>{p.year}</td>
                  <td>{p.score}</td>
                  <td>{p.competencyLevel}</td>
                  <td>{p.remarks || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </DashboardLayout>
  );
}
