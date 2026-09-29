const pathways = [
  { name: "STEM Pathway", text: "Sciences, Mathematics, and Technical subjects for learners headed into technical and scientific fields." },
  { name: "Social Sciences Pathway", text: "Humanities, languages, and business subjects for learners suited to social and business careers." },
  { name: "Arts & Sports Science Pathway", text: "Creative arts, performing arts, and sports science for learners with talent-based interests." },
];

export default function Academics() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Academics</p>
          <h1>Competency Based Curriculum, Senior School</h1>
          <p className="page-hero-sub">
            Learners choose a pathway aligned with their strengths and career
            goals, assessed continuously rather than by a single final exam.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 style={{ textAlign: "center" }}>Learning Pathways</h2>
          <div className="features-grid">
            {pathways.map((p) => (
              <div key={p.name} className="feature-card">
                <h3>{p.name}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container about-grid">
          <div>
            <h2>Continuous Assessment</h2>
            <p className="body-text">
              Performance is tracked through formative assessments, projects,
              and termly evaluations recorded directly by teachers in the
              system, giving parents and students real-time progress reports.
            </p>
          </div>
          <div>
            <h2>Holiday Quizzes</h2>
            <p className="body-text">
              To keep learners sharp between terms, structured holiday
              quizzes are issued and auto-graded, with results feeding
              straight into each student's academic profile.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
