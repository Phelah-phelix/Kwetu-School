export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/badge.png" alt="Kwetu School" />
          <div>
            <strong>Kwetu School</strong>
            <p>Learn Today, Build Tomorrow</p>
          </div>
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Kwetu School. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
