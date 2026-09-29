import { Link } from "react-router-dom";

const stats = [
  { value: "500+", label: "Students Enrolled" },
  { value: "40+", label: "Qualified Teachers" },
  { value: "98%", label: "CBC Transition Rate" },
  { value: "12", label: "Learning Pathways" },
];

const features = [
  {
    title: "Role-Based Dashboards",
    text: "Separate, focused dashboards for students, teachers, parents, workers, principals, and admins — everyone sees only what they need.",
  },
  {
    title: "Live Performance Tracking",
    text: "Continuous CBC assessment records, term reports, and progress trends tracked automatically as teachers grade.",
  },
  {
    title: "Class & Teacher Allocation",
    text: "Admins assign classes, subjects, and teachers centrally, with instant visibility across the school.",
  },
  {
    title: "Timetables & Assignments",
    text: "Digital timetables and assignment tracking keep every class on schedule and every submission on record.",
  },
  {
    title: "Holiday Quizzes",
    text: "Structured holiday quizzes keep students engaged and sharp between terms, with results feeding back into their profile.",
  },
  {
    title: "Full Oversight",
    text: "Principals and admins get a real-time, school-wide view — attendance, performance, staffing, and more.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="eyebrow">Kenyan Senior Secondary &middot; CBC</p>
            <h1>Learn Today,<br />Build Tomorrow.</h1>
            <p className="hero-sub">
              Kwetu School delivers the Competency Based Curriculum with the
              structure, care, and accountability of an international school —
              for students, teachers, parents, and staff alike.
            </p>
            <div className="hero-actions">
              <Link to="/admissions" className="btn btn-primary">Apply for Admission</Link>
              <Link to="/login" className="btn btn-outline">Portal Login</Link>
            </div>
          </div>

          <div className="hero-badge">
            <img src="/badge.png" alt="Kwetu School badge" />
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <p className="stat-value">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow" style={{ textAlign: "center" }}>Why Kwetu School</p>
          <h2 style={{ textAlign: "center", marginTop: "10px" }}>
            One system, every role covered
          </h2>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
            </section>

      <section className="cta">
        <div className="container cta-inner">
          <div>
            <h2 style={{ color: "#fff" }}>Ready to join Kwetu School?</h2>
            <p>Admissions for the next intake are open. Start your application today.</p>
          </div>
          <div className="cta-actions">
            <Link to="/admissions" className="btn btn-cta">Start Application</Link>
            <Link to="/contact" className="btn btn-cta-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}