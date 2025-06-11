'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navLinksRef = useRef<HTMLUListElement>(null);
  const mobileMenuBtnRef = useRef<HTMLDivElement>(null);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => {
      const newState = !prev;
      
      // When closing the menu, also close any open dropdowns
      if (!newState) {
        setActiveDropdown(null);
        document.body.style.overflow = '';
      } else {
        document.body.style.overflow = 'hidden';
      }
      
      return newState;
    });
  };

  // Handle dropdown toggle
  const handleDropdownToggle = (dropdownName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only handle click behavior on mobile
    if (window.innerWidth <= 768) {
      setActiveDropdown(prev => prev === dropdownName ? null : dropdownName);
    }
  };

  // Close mobile menu when clicking regular links
  const handleRegularLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
      document.body.style.overflow = '';
    }
  };

  // Setup event listeners
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Element;
      
      // Close dropdown when clicking outside on mobile
      if (window.innerWidth <= 768) {
        if (!target.closest('.dropdown') && !target.closest('.mobile-menu-btn')) {
          setActiveDropdown(null);
        }
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
        document.body.style.overflow = '';
      }
    };

    const handleResize = () => {
      // Reset overflow if menu is closed on resize to desktop
      if (window.innerWidth > 768) {
        document.body.style.overflow = '';
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleEscKey);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleEscKey);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <header>
      <div className="container">
        <div className="logo">
          <a href="">
            <Image 
              className="logo-img" 
              src="/logos/dmd-logo.png" 
              alt="DMD Diamond Logo"
              width={150}
              height={0}
              style={{
                width: '150px',
                height: 'auto',
              }}
              priority
            />
          </a>
        </div>
        
        <nav>
          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} ref={navLinksRef}>
            <li>
              <a href="validators.html" onClick={handleRegularLinkClick}>
                Validators
              </a>
            </li>
            
            <li className={`dropdown ${activeDropdown === 'ecosystem' ? 'active' : ''}`}>
              <a 
                href="#" 
                className="dropdown-toggle"
                onClick={(e) => handleDropdownToggle('ecosystem', e)}
              >
                DMD Ecosystem <i className="fas fa-chevron-down"></i>
              </a>
              <div className="dropdown-menu">
                <div className="dropdown-content">
                  <div className="dropdown-section">
                    <ul>
                      <li>
                        <a href="https://bit.diamonds" target="_blank" rel="noopener noreferrer">
                          Bit Diamonds<i className="fas fa-external-link-alt"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://dmd.diamonds" target="_blank" rel="noopener noreferrer">
                          DMD Explorer<i className="fas fa-external-link-alt"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
            
            <li className={`dropdown ${activeDropdown === 'thirdparty' ? 'active' : ''}`}>
              <a 
                href="#" 
                className="dropdown-toggle"
                onClick={(e) => handleDropdownToggle('thirdparty', e)}
              >
                3rd Party Projects <i className="fas fa-chevron-down"></i>
              </a>
              <div className="dropdown-menu">
                <div className="dropdown-content">
                  <div className="dropdown-section">
                    <ul>
                      <li>
                        <a href="https://uniq.directory/" target="_blank" rel="noopener noreferrer">
                          NFT Marketplace <i className="fas fa-external-link-alt"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://uniq.diamonds/" target="_blank" rel="noopener noreferrer">
                          uNiq Diamonds <i className="fas fa-external-link-alt"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://gladiators.diamonds/" target="_blank" rel="noopener noreferrer">
                          uNiq Gladiators <i className="fas fa-external-link-alt"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        
        <div className="header-right">
          <div className="theme-toggle-wrapper">
            <label className="theme-toggle">
              <input type="checkbox" id="theme-toggle" />
              <span className="theme-toggle-slider">
                <i className="fas fa-sun theme-toggle-icon sun"></i>
                <i className="fas fa-moon theme-toggle-icon moon"></i>
              </span>
            </label>
          </div>
          
          <div className="user-wallet-info" id="user-wallet-info" style={{display: "none"}}>
            <div className="wallet-icon">
              <div className="wallet-icon-inner"></div>
            </div>
            <div className="wallet-address">0x7F...A3D2</div>
            <i className="fas fa-chevron-down"></i>
          </div>
          
          <div className="cta-button" id="connect-wallet-btn">
            <i className="fas fa-wallet"></i> Connect Wallet
          </div>
        </div>
        
        <div 
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
          ref={mobileMenuBtnRef}
          onClick={toggleMobileMenu}
        >
          <i className="fas fa-bars"></i>
          <i className="fas fa-times"></i>
        </div>
      </div>
    </header>
  );
}