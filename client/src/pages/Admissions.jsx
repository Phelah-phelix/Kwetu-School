import { Link } from "react-router-dom";

const steps = [
  { step: "01", title: "Inquiry", text: "Contact the admissions office or submit an inquiry form." },
  { step: "02", title: "Assessment", text: "Learner sits a short placement assessment and interview." },
  { step: "03", title: "Documentation", text: "Submit KCPE/JSS results, birth certificate, and passport photos." },
  { step: "04", title: "Enrollment", text: "Pay fees and confirm the learner's pathway and class placement." },
];

export default function Admissions() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Admissions</p>
          <h1>Join Kwetu School</h1>
          <p className="page-hero-sub">
            Admissions are open for Grade 10 (Senior School) intake. Follow
            the steps below to begin the process.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.step} className="step-card">
                <p className="step-number">{s.step}</p>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>

          <div className="admissions-cta">
            <Link to="/contact" className="btn btn-primary">Start Your Application</Link>
          </div>
        </div>
      </section>
    </>
  );
}
