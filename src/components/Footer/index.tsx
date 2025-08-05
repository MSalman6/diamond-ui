import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>DMD Diamond</h3>
            <ul>
              <li><a href="https://bit.diamonds/" target="_blank">About</a></li>
              <li><Link href="/wiki">Ecosystem</Link></li>
              <li><a href="https://discord.com/channels/1267133854154756178/1267151457346392065" target="_blank">Community</a></li>
              <li><a href="https://bit.diamonds/blog/" target="_blank">Blog</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Developers</h3>
            <ul>
              <li><a href="https://github.com/DMDcoin/diamond-contracts-core" target="_blank">Documentation</a></li>
              <li><a href="https://github.com/DMDcoin" target="_blank">GitHub</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Resources</h3>
            <ul>
              <li><a href="https://github.com/DMDcoin/whitepaper/wiki" target="_blank">Whitepaper</a></li>
              <li><a href="https://github.com/DMDcoin/whitepaper/wiki/J.-Roadmap" target="_blank">Roadmap</a></li>
              <li><Link href="/faqs">FAQs</Link></li>
              <li><a href="https://discord.com/channels/1267133854154756178/1267406282835624029" target="_blank">Support</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Connect</h3>
            <ul>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Discord</a></li>
              <li><a href="#">Telegram</a></li>
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