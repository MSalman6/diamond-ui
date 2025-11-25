import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Communities</h3>
            <ul>
              <li><a target="_blank" href="https://discord.com/invite/MwqZ2CYcB4">Discord</a></li>
              <li><a target="_blank" href="https://t.me/DMDcoin">Telegram</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Social Media</h3>
            <ul>
              <li><a target="_blank" href="https://www.facebook.com/dmdcoin/">Facebook</a></li>
              <li><a target="_blank" href="https://t.me/DMDcoin">Telegram</a></li>
              <li><a target="_blank" href="https://twitter.com/dmdcoin">Twitter</a></li>
              <li><a target="_blank" href="https://www.linkedin.com/company/dmd-diamond/">LinkedIn</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>More about DMD Diamond</h3>
            <ul>
              <li><a href="https://bit.diamonds/" target="_blank">Website</a></li>
              <li><a href="https://bit.diamonds/blog/" target="_blank">Blog</a></li>
              <li><a href="https://dmd-diamond.medium.com/" target="_blank">Medium</a></li>
              <li><a href="https://bitcointalk.org/index.php?topic=580725.msg64407626#msg64407626" target="_blank">Bitcointalk</a></li>
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