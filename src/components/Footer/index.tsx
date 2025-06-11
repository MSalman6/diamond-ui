export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>DMD Diamond</h3>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Ecosystem</a></li>
              <li><a href="#">Community</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Developers</h3>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">Tutorials</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">SDK</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Whitepaper</a></li>
              <li><a href="#">Roadmap</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Connect</h3>
            <ul>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Discord</a></li>
              <li><a href="#">Telegram</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 DMD Diamond. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}