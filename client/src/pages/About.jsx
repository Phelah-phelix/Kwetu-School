const values = [
  { title: "Excellence", text: "High standards in academics, character, and competency development." },
  { title: "Integrity", text: "Honesty and accountability in everything we teach and do." },
  { title: "Innovation", text: "Modern teaching methods matched with modern school management." },
  { title: "Community", text: "Students, teachers, parents, and staff working as one team." },
];

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About Us</p>
          <h1>Built on CBC. Run like an international school.</h1>
          <p className="page-hero-sub">
            Kwetu School is a Kenyan senior secondary school delivering the
            Competency Based Curriculum with the discipline, transparency, and
            technology of a modern international institution.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container about-grid">
          <div>
            <h2>Our Mission</h2>
            <p className="body-text">
              To nurture confident, competent learners equipped for further
              education, the world of work, and responsible citizenship —
              guided by the CBC framework and supported by a school system
              built for real accountability.
            </p>
          </div>
          <div>
            <h2>Our Vision</h2>
            <p className="body-text">
              To be a leading CBC senior secondary school in Kenya, known for
              academic excellence, strong character, and a well-run,
              transparent institution for every stakeholder.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 style={{ textAlign: "center" }}>Our Core Values</h2>
          <div className="values-grid">
            {values.map((v) => (
              <div key={v.title} className="value-card">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
