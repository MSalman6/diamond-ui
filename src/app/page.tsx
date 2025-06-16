'use client';

import "./page.css";
import { useEffect } from 'react';
import FAQ from '../components/FAQ';

export default function Home() {
  // Initialize fade-in animations
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    fadeElements.forEach(element => {
      observer.observe(element);
    });

    return () => {
      fadeElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  // Add Link functionality to Connect Wallet button
  useEffect(() => {
    const connectWalletBtn = document.getElementById('connect-wallet-btn');
    
    if (connectWalletBtn) {
      // Store original content and styles
      const originalOnClick = connectWalletBtn.onclick;
      
      // Create a Link-like behavior by adding click handler
      const handleWalletClick = (e: Event) => {
        e.preventDefault();
        window.location.href = '/profile';
      };
      
      // Add the click handler
      connectWalletBtn.addEventListener('click', handleWalletClick);
      
      // Cleanup function to remove the click handler when component unmounts or page changes
      return () => {
        if (connectWalletBtn) {
          connectWalletBtn.removeEventListener('click', handleWalletClick);
          // Restore original onclick if it existed
          if (originalOnClick) {
            connectWalletBtn.onclick = originalOnClick;
          }
        }
      };
    }
  }, []);

  return (
    <div>
        {/* Unauthenticated View */}
        <div id="unauthenticated-view">
          {/* Hero Section */}
          <section className="hero">
            <div className="cosmic-grid"></div>
            <div className="cosmic-elements">
              <div className="glow glow-1"></div>
              <div className="glow glow-2"></div>
            </div>
            <div className="container">
              <div className="hero-content">
                <h1>Become DMD Chain Participant</h1>
                <p>
                  Welcome to the DMD Diamond Staking Platform – your gateway to earning rewards while contributing to the security and functionality of the DMD network. Embark on your staking adventure with us and unlock the full potential of your digital assets.
                </p>
                <div className="hero-buttons">
                  <a href="#" className="btn-primary" id="connect-wallet-btn">Connect wallet <i className="fas fa-arrow-right"></i></a>
                  <a href="https://github.com/DMDcoin/whitepaper/wiki/A.-Home" target="_blank" className="btn-secondary">GitHub Wiki <i className="fas fa-arrow-right"></i></a>
                </div>
              </div>
              <div className="hero-visual">
                <div className="diamond-custom diamond-custom-1"></div>
                <div className="diamond-custom diamond-custom-2"></div>
                <div className="diamond-custom diamond-custom-3"></div>
                <div className="glow-custom glow-custom-1"></div>
                <div className="glow-custom glow-custom-2"></div>
              </div>
            </div>
            <div className="partners-bar">
              <div className="partners-scroll">
                <div className="partners-track">
                  <div className="partner-logo">P2P b2b</div>
                  <div className="partner-logo">BitMart</div>
                  <div className="partner-logo">XeggeX</div>
                  <div className="partner-logo">BlockServ</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Create Pool Modal */}
        <div className="modal" id="create-pool-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create a Validator Pool</h3>
              <span className="close-modal">&times;</span>
            </div>
            <div className="modal-body">
              <form id="create-pool-form">
                <div className="form-group">
                  <label htmlFor="initial-stake">Initial Stake (DMD)</label>
                  <input type="number" id="initial-stake" placeholder="Minimum 10000 DMD"/>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Create Pool</button>
                  <button type="button" className="btn-secondary cancel-modal">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Update Rewards Modal */}
        <div className="modal" id="update-rewards-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Shared Rewards</h3>
              <span className="close-modal">&times;</span>
            </div>
            <div className="modal-body">
              <form id="update-rewards-form">
                <div className="form-group">
                  <label htmlFor="new-reward-share">New Reward Share (%)</label>
                  <input type="number" id="new-reward-share" placeholder="Enter percentage (0-100)"/>
                  <p className="form-help">This is the percentage of rewards that will be shared with your delegates.</p>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Update</button>
                  <button type="button" className="btn-secondary cancel-modal">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <div className="section-header">
              <h2 className="fade-in">Blockchain that scales</h2>
              <p>DMD Diamond is a fair-launched, truly decentralized Layer 1 blockchain, built by a dedicated community — without a company, premine, or ICO. Established in 2013, it has continuously evolved to prioritize security, efficiency, and decentralization.</p>
              <a href="https://github.com/DMDcoin/whitepaper/wiki/A.-Home" target="_blank" className="btn-primary">Learn more about DMD <i className="fas fa-arrow-right"></i></a>
            </div>

            <div className="features-grid">
              <div className="feature-card fade-in">
                <div className="feature-icon">
                  <i className="fas fa-network-wired"></i>
                </div>
                <h3>Decentralized</h3>
              </div>
              <div className="feature-card fade-in">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Secure</h3>
              </div>
              <div className="feature-card fade-in">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Scalable</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Design Section */}
        <section className="design-section">
          <div className="container">
            <div className="design-grid">
              <div className="design-content">
                <h2>The Next Evolution of DMD Diamond</h2>
                <p>DMD Diamond is relaunching as a fully EVM-compatible Layer 1, designed to empower developers and projects with cutting-edge blockchain technology.</p>
                <a href="https://github.com/DMDcoin/whitepaper/wiki/A.-Home" target="_blank" className="btn-primary">Explore the ecosystem <i className="fas fa-arrow-right"></i></a>
              </div>
              <div className="design-features">
                <div className="design-feature">
                  <div className="feature-icon">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <div className="feature-text">
                    <h4>Lightning Fast</h4>
                    <p>500ms block times</p>
                  </div>
                </div>
                <div className="design-feature">
                  <div className="feature-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className="feature-text">
                    <h4>HBBFT Protocol</h4>
                    <p>Secure cross-chain transfers</p>
                  </div>
                </div>
                <div className="design-feature">
                  <div className="feature-icon">
                    <i className="fas fa-code-branch"></i>
                  </div>
                  <div className="feature-text">
                    <h4>EVM Compatibility</h4>
                    <p>Build exactly what you need</p>
                  </div>
                </div>
                <div className="design-feature">
                  <div className="feature-icon">
                    <i className="fas fa-server"></i>
                  </div>
                  <div className="feature-text">
                    <h4>Validator Network</h4>
                    <p>Decentralized consensus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Contracts Section */}
        <section className="smart-contracts">
          <div className="container">
            <div className="smart-contracts-grid">
              <div className="smart-contracts-content">
                <h2 className="fade-in">Smart contracts<br/>done smarter</h2>
                <p>The Diamond platform offers a secure, energy-efficient environment for smart contract execution—leveraging DMD's high-performance blockchain architecture.</p>
                <a href="validators.html" className="btn-primary">Start Staking <i className="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
          <div className="cosmic-elements contracts-elements">
            <div className="glow glow-blue"></div>
          </div>
        </section>

        {/* Network Statistics Section */}
        <section className="statistics">
          <div className="container">
            <div className="statistics-header">
              <h2 className="fade-in">DMD: your protocol's<br/>connection to the<br/>global digital economy</h2>
              <div className="big-stat">
                <span className="big-stat-value">4M+</span>
                <span className="big-stat-label">Total DMD Emission</span>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-card fade-in">
                <h3>Current Epoch</h3>
                <p className="stat-value">396</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Key Gen. Round</h3>
                <p className="stat-value">1</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Epoch Start Time</h3>
                <p className="stat-value">22 May 2025 16:41:57</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Epoch Start Block</h3>
                <p className="stat-value">112839</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Active Validators</h3>
                <p className="stat-value">25</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Valid Candidates</h3>
                <p className="stat-value">61</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Min. Gas Fee</h3>
                <p className="stat-value">1 Gwei</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Reinsert Pot</h3>
                <p className="stat-value">345662.1747 DMD</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Delta Pot</h3>
                <p className="stat-value">512829.4899 DMD</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Claiming Pot</h3>
                <p className="stat-value">2114280.8052 DMD</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="testimonial">
          <div className="container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a true blockchain purist, DMD Diamond's core values ​include complete decentralization. DMD Diamond is a community-driven project with no corporations behind us."</p>
                <div className="testimonial-author">
                  <div className="author-logo">Origin</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="community">
          <div className="container">
            <h2 className="fade-in">A fast-growing, global <br/> community</h2>
            <p>Whether you're a developer, creator, or supporter, there's a place for you in the Diamond ecosystem. Build dApps on our fast, secure, and energy-efficient chain. Help shape the future of the blockchain with the help of decentralized governance. Or simply stake and participate in consensus—every role matters.
              Join the community. Build with purpose. Own your impact.</p>

            <div className="community-stats">
              <div className="community-stat">
                <i className="fas fa-users"></i>
                <h3>Community Size</h3>
                <p>1,500+ members</p>
              </div>
              <div className="community-stat">
                <i className="fas fa-code"></i>
                <h3>Core team</h3>
                <p>10+ active developers</p>
              </div>
              <div className="community-stat">
                <i className="fas fa-project-diagram"></i>
                <h3>Projects Built</h3>
                <p>5+ on top of DMD chain</p>
              </div>
              <div className="community-stat">
                <i className="fas fa-globe"></i>
                <h3>Global Reach</h3>
                <p>50+ countries</p>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="news">
          <div className="container">
            <h2 className="fade-in">News & Updates</h2>
            <div className="news-card">
              <div className="news-content">
                <h3>Connect to DMD</h3>
                <p>Are you a third-party company seeking a sustainable blockchain solution with industry-leading features for hosting your project? Look no further!</p>
                <a href="#" className="btn-small">Learn more</a>
              </div>
              <div className="news-image">
              </div>
            </div>
          </div>
        </section>

        {/* Become Participant Section */}
        <section className="participate">
          <div className="container">
            <h2 className="fade-in">Start Staking</h2>
            <div className="participate-grid">
              <div className="participate-card fade-in">
                <div className="participate-icon">
                  <i className="fas fa-wallet"></i>
                </div>
                <h3>Seamless Staking Experience</h3>
                <p>Begin your journey by connecting your cryptocurrency wallet and explore the variety of staking options available. Our intuitive UI ensures a smooth and straightforward staking process.</p>
              </div>
              <div className="participate-card fade-in">
                <div className="participate-icon">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h3>Real-Time Analytics</h3>
                <p>Stay informed with transparent data on staking pools, performance, and rewards. Our platform provides you with the insights needed to make the best staking decisions.</p>
              </div>
              <div className="participate-card fade-in">
                <div className="participate-icon">
                  <i className="fas fa-coins"></i>
                </div>
                <h3>Earn Rewards</h3>
                <p>By staking your DMD coins, you actively participate in transaction validation, securing the blockchain, and in return, receive additional DMD as rewards.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq">
          <div className="container">
            <h2 className="fade-in">Frequently Asked Questions</h2>
            <FAQ count={6} />
            <div className="faq-actions">
              <a href="faqs.html" className="btn-primary">See all FAQs <i className="fas fa-arrow-right"></i></a>
            </div>
          </div>
        </section>
    </div>
  );
}
