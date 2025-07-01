'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useWeb3Context } from '@/contexts/Web3';
import { truncateAddress } from '@/utils/common';
import { useState, useEffect, useRef } from 'react';
import { useWalletConnect } from '@/contexts/WalletConnect';

export default function Header() {
  const router = useRouter();
  const { open: openWalletModal, address, isConnected } = useWalletConnect();
  const { userWallet } = useWeb3Context();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [logoSrc, setLogoSrc] = useState('/logos/dmd-logo.png');
  const navLinksRef = useRef<HTMLUListElement>(null);
  const mobileMenuBtnRef = useRef<HTMLDivElement>(null);

  // Handle wallet connect button click
  const handleWalletConnect = () => {
    if (isConnected && userWallet.myAddr) {
      // If connected, redirect to profile page
      router.push('/profile');
    } else {
      // If not connected, open wallet modal
      openWalletModal();
    }
  };
  
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

  // Theme detection and logo switching
  useEffect(() => {
    const updateLogo = () => {
      const isLightTheme = document.body.classList.contains('light-theme');
      setLogoSrc(isLightTheme ? '/logos/dmd-logo-dark.png' : '/logos/dmd-logo.png');
    };

    updateLogo();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateLogo();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header>
      <div className="container">
        <div className="logo">
          <Link href="/">
            <Image 
              className="logo-img" 
              src={logoSrc}
              alt="DMD Diamond Logo"
              width={150}
              height={0}
              style={{
                width: '150px',
                height: 'auto',
              }}
              priority
            />
          </Link>
        </div>
        
        <nav>
          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} ref={navLinksRef}>
            <li>
              <Link href="/validators" onClick={handleRegularLinkClick}>
                Validators
              </Link>
            </li>
            
            {isConnected && userWallet.myAddr && (
              <li>
                <Link href="/dao" onClick={handleRegularLinkClick}>
                  DAO
                </Link>
              </li>
            )}
            
            <li>
              <Link href="/faqs" onClick={handleRegularLinkClick}>
                FAQs
              </Link>
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
          
          {isConnected && userWallet.myAddr ? (
            <div className="user-wallet-info" onClick={handleWalletConnect} style={{ cursor: 'pointer' }}>
              <div className="wallet-icon">
                <div className="wallet-icon-inner"></div>
              </div>
              <div className="wallet-address">{truncateAddress(userWallet.myAddr)}</div>
              <i className="fas fa-chevron-right"></i>
            </div>
          ) : (
            <div className="cta-button" onClick={handleWalletConnect} style={{ cursor: 'pointer' }}>
              <i className="fas fa-wallet"></i> Connect Wallet
            </div>
          )}
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