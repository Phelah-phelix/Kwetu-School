import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ title, navItems, children }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    signOut();
    navigate("/login");
  }

  return (
    <div className="dash-shell">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <img src="/badge.png" alt="Kwetu School" />
          <span>Kwetu School</span>
        </div>

        <nav className="dash-nav">
          {navItems.map((item) => (
            <Link key={item.label} to={item.to} className="dash-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <button onClick={handleSignOut} className="dash-signout">
          Sign Out
        </button>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <h1>{title}</h1>
          <div className="dash-user">
            <span>{user?.fullName}</span>
            <span className="dash-role">{user?.role}</span>
          </div>
        </header>

        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}
