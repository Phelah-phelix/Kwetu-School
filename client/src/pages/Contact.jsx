export default function Contact() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>Get in Touch</h1>
          <p className="page-hero-sub">
            Have a question about admissions, academics, or the portal?
            Reach out and our office will respond promptly.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <h3>Address</h3>
              <p>Kwetu School, Nairobi, Kenya</p>
            </div>
            <div className="contact-item">
              <h3>Phone</h3>
              <p>+254 700 000 000</p>
            </div>
            <div className="contact-item">
              <h3>Email</h3>
              <p>info@kwetuschool.ac.ke</p>
            </div>
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <label>
              Full Name
              <input type="text" placeholder="Your name" required />
            </label>
            <label>
              Email
              <input type="email" placeholder="you@example.com" required />
            </label>
            <label>
              Message
              <textarea rows="5" placeholder="How can we help?" required />
            </label>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </section>
    </>
  );
}
