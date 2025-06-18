'use client';

import './FAQs.css';
import { useEffect } from 'react';
import FAQ from '../../components/FAQ';

export default function FAQsPage() {
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

  return (
    <div className="faqs-page">
      {/* Hero Section */}
      <section className="faqs-hero">
        <div className="cosmic-grid"></div>
        <div className="cosmic-elements">
          <div className="glow glow-1"></div>
          <div className="glow glow-2"></div>
        </div>
        <div className="container">
          <div className="faqs-hero-content">
            <h1 className="fade-in">Frequently Asked Questions</h1>
            <p className="fade-in">
              Find answers to common questions about DMD Diamond staking, validators, rewards, and more. 
              If you can't find what you're looking for, feel free to reach out to our community.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <FAQ count="all" />
          
          <div className="faq-contact fade-in">
            <h3>Still have questions?</h3>
            <p>
              Join our community and get help from experienced validators and stakers.
            </p>
            <div className="contact-links">
              <a href="https://github.com/DMDcoin/whitepaper/wiki/A.-Home" target="_blank" rel="noopener noreferrer" className="btn-primary">
                Read Documentation <i className="fas fa-external-link-alt"></i>
              </a>
              <a href="#" className="btn-secondary">
                Join Community <i className="fas fa-users"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
