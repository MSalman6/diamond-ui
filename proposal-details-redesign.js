document.addEventListener("DOMContentLoaded", () => {
  // Initialize clipboard.js
  let clipboard
  try {
    clipboard = new ClipboardJS(".copy-btn")

    clipboard.on("success", (e) => {
      // Create tooltip
      const tooltip = document.createElement("div")
      tooltip.className = "copy-tooltip"
      tooltip.textContent = "Copied!"

      // Position tooltip near the button
      // const buttonRect = e.trigger.getBoundingClientRect()
      // tooltip.style.position = "absolute"
      // tooltip.style.top = `${buttonRect.top - 30}px`
      // tooltip.style.left = `${buttonRect.left + buttonRect.width / 2}px`
      // tooltip.style.transform = "translateX(-50%)"
      // tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.8)"
      // tooltip.style.color = "#fff"
      // tooltip.style.padding = "5px 10px"
      // tooltip.style.borderRadius = "4px"
      // tooltip.style.fontSize = "12px"
      // tooltip.style.zIndex = "1000"

      // Add tooltip to body
      // document.body.appendChild(tooltip)

      // Remove tooltip after 1.5 seconds
      // setTimeout(() => {
      //   tooltip.style.opacity = "0"
      //   tooltip.style.transition = "opacity 0.3s"
      //   setTimeout(() => {
      //     document.body.removeChild(tooltip)
      //   }, 300)
      // }, 1500)

      // e.clearSelection()
      const copyTooltip = document.createElement("div")
      copyTooltip.className = "copy-tooltip"
      copyTooltip.textContent = "Copied!"

      e.trigger.appendChild(copyTooltip)

      setTimeout(() => {
        copyTooltip.classList.add("show")
      }, 10)

      setTimeout(() => {
        copyTooltip.classList.remove("show")
        setTimeout(() => {
          copyTooltip.remove()
        }, 300)
      }, 1500)

      e.clearSelection()
    })
  } catch (error) {
    console.error("ClipboardJS initialization failed:", error)
    // Optionally, disable copy buttons or provide a fallback mechanism
    const copyButtons = document.querySelectorAll(".copy-btn")
    copyButtons.forEach((button) => {
      button.disabled = true
      button.title = "Copy functionality is not available."
    })
  }

  // Handle expandable sections
  const expandButtons = document.querySelectorAll(".expand-btn")

  expandButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const expandableSection = this.closest(".expandable")
      expandableSection.classList.toggle("expanded")

      const icon = this.querySelector("i")
      const text = this.querySelector("span")

      // if (expandableSection.classList.contains("expanded")) {
      //   icon.className = "fas fa-chevron-up"
      //   text.textContent = "Collapse"
      // } else {
      //   icon.className = "fas fa-chevron-down"
      //   text.textContent = "Expand"
      // }
      if (expandableSection.classList.contains("expanded")) {
        icon.classList.remove("fa-chevron-down")
        icon.classList.add("fa-chevron-up")
        text.textContent = "Collapse"
      } else {
        icon.classList.remove("fa-chevron-up")
        icon.classList.add("fa-chevron-down")
        text.textContent = "Expand"
      }
    })
  })

  // Demo: Proposal Type Selector
  const typeButtons = document.querySelectorAll(".type-btn")
  const proposalDetailsCard = document.querySelector(".proposal-details-card")

  typeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      typeButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Get the proposal type
      const proposalType = this.dataset.type

      // Update content based on proposal type
      // updateProposalContent(proposalType)
      // Remove active class from all buttons
      typeButtons.forEach((b) => b.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Get the proposal type
      const selectedProposalType = this.dataset.type

      // In a real implementation, this would update the content based on the proposal type
      console.log(`Switching to proposal type: ${selectedProposalType}`)
    })
  })

  function updateProposalContent(type) {
    const cardHeader = proposalDetailsCard.querySelector(".card-header h2")
    const cardBody = proposalDetailsCard.querySelector(".card-body")

    // Store current scroll position
    const scrollPosition = window.scrollY

    // Apply fade-out animation
    cardBody.style.opacity = "0"
    cardBody.style.transition = "opacity 0.3s"

    setTimeout(() => {
      // Update content based on type
      switch (type) {
        case "parameter-change":
          cardHeader.textContent = "Parameter Change"
          cardBody.innerHTML = `
                        <h3 class="proposal-subtitle">Validator Commission Rate Adjustment</h3>
                        
                        <div class="parameter-comparison">
                            <div class="parameter-group">
                                <div class="parameter-label">Current Value:</div>
                                <div class="parameter-value">5%</div>
                            </div>
                            <div class="parameter-arrow">
                                <i class="fas fa-arrow-right"></i>
                            </div>
                            <div class="parameter-group">
                                <div class="parameter-label">Proposed Value:</div>
                                <div class="parameter-value">7%</div>
                            </div>
                        </div>
                        
                        <div class="parameter-fee">
                            <div class="fee-label">
                                <span>Parameter Change Fee:</span>
                                <i class="fas fa-info-circle" title="Fee required to submit this type of parameter change"></i>
                            </div>
                            <div class="fee-value">500 DMD</div>
                        </div>
                        
                        <div class="description-section">
                            <h3>Description</h3>
                            <p>This proposal aims to adjust the validator commission rate from 5% to 7% to better align with network security needs and validator operational costs. The increase will help ensure validators have sufficient resources to maintain high-quality infrastructure.</p>
                        </div>
                        
                        <div class="impact-section">
                            <h3>Impact Assessment</h3>
                            <div class="impact-items">
                                <div class="impact-item">
                                    <div class="impact-icon positive">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                    <div class="impact-text">Improved validator infrastructure</div>
                                </div>
                                <div class="impact-item">
                                    <div class="impact-icon positive">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                    <div class="impact-text">Enhanced network security</div>
                                </div>
                                <div class="impact-item">
                                    <div class="impact-icon negative">
                                        <i class="fas fa-minus"></i>
                                    </div>
                                    <div class="impact-text">Slightly reduced delegator rewards</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="additional-resources">
                            <h3>Additional Resources</h3>
                            <div class="resource-links">
                                <a href="#" class="resource-link">
                                    <i class="fas fa-file-alt"></i>
                                    <span>Parameter Documentation</span>
                                </a>
                                <a href="#" class="resource-link">
                                    <i class="fas fa-chart-line"></i>
                                    <span>Economic Analysis</span>
                                </a>
                                <a href="#" class="resource-link">
                                    <i class="fas fa-comments"></i>
                                    <span>Discussion Forum</span>
                                </a>
                            </div>
                        </div>
                    `
          break
        case "funding-request":
          cardHeader.textContent = "Funding Request"
          cardBody.innerHTML = `
                        <h3 class="proposal-subtitle">Community Development Fund</h3>
                        
                        <div class="funding-purpose">
                            <h4>Purpose:</h4>
                            <p>Fund community-driven development initiatives and educational resources for the DMD ecosystem</p>
                        </div>
                        
                        <div class="detail-group">
                            <div class="detail-label">Requested Amount:</div>
                            <div class="detail-value">25,000 DMD</div>
                        </div>
                        
                        <div class="detail-group">
                            <div class="detail-label">Payout Address:</div>
                            <div class="detail-value address-container">
                                <span class="address">0x8f7c651bf6f7b6e6f4c4c4c4c4c4c4c4c4c4c4c4</span>
                                <button class="copy-btn" data-clipboard-text="0x8f7c651bf6f7b6e6f4c4c4c4c4c4c4c4c4c4c4c4">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="fund-allocation">
                            <h4>Fund Allocation:</h4>
                            <div class="allocation-item">
                                <div class="allocation-header">
                                    <div class="allocation-name">Developer Grants</div>
                                    <div class="allocation-amount">12,500 DMD (50%)</div>
                                </div>
                                <div class="allocation-bar">
                                    <div class="allocation-progress" style="width: 50%"></div>
                                </div>
                            </div>
                            <div class="allocation-item">
                                <div class="allocation-header">
                                    <div class="allocation-name">Educational Content</div>
                                    <div class="allocation-amount">7,500 DMD (30%)</div>
                                </div>
                                <div class="allocation-bar">
                                    <div class="allocation-progress" style="width: 30%"></div>
                                </div>
                            </div>
                            <div class="allocation-item">
                                <div class="allocation-header">
                                    <div class="allocation-name">Community Events</div>
                                    <div class="allocation-amount">5,000 DMD (20%)</div>
                                </div>
                                <div class="allocation-bar">
                                    <div class="allocation-progress" style="width: 20%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="milestone-timeline">
                            <h4>Milestones:</h4>
                            <div class="milestone-item">
                                <div class="milestone-marker"></div>
                                <div class="milestone-content">
                                    <div class="milestone-date">Q2 2025</div>
                                    <div class="milestone-title">Developer Grants Program Launch</div>
                                    <div class="milestone-description">Open applications for developer grants and select first cohort</div>
                                </div>
                            </div>
                            <div class="milestone-item">
                                <div class="milestone-marker"></div>
                                <div class="milestone-content">
                                    <div class="milestone-date">Q3 2025</div>
                                    <div class="milestone-title">Educational Content Series</div>
                                    <div class="milestone-description">Release comprehensive tutorial series and documentation</div>
                                </div>
                            </div>
                            <div class="milestone-item">
                                <div class="milestone-marker"></div>
                                <div class="milestone-content">
                                    <div class="milestone-date">Q4 2025</div>
                                    <div class="milestone-title">Community Hackathon</div>
                                    <div class="milestone-description">Host global virtual hackathon with prizes for top projects</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="description-section">
                            <h3>Description</h3>
                            <p>This funding request aims to establish a Community Development Fund to support grassroots initiatives that enhance the DMD ecosystem. The fund will focus on developer grants, educational content creation, and community events to drive adoption and innovation.</p>
                        </div>
                        
                        <div class="additional-resources">
                            <h3>Additional Resources</h3>
                            <div class="resource-links">
                                <a href="#" class="resource-link">
                                    <i class="fas fa-file-alt"></i>
                                    <span>Detailed Proposal</span>
                                </a>
                                <a href="#" class="resource-link">
                                    <i class="fas fa-chart-line"></i>
                                    <span>Budget Breakdown</span>
                                </a>
                                <a href="#" class="resource-link">
                                    <i class="fas fa-comments"></i>
                                    <span>Discussion Forum</span>
                                </a>
                            </div>
                        </div>
                    `
          break
        case "contract-upgrade":
          cardHeader.textContent = "Contract Upgrade"
          cardBody.innerHTML = `
                        <h3 class="proposal-subtitle">DMD Protocol Upgrade v2.6</h3>
                        
                        <div class="detail-group">
                            <div class="detail-label">Target Address:</div>
                            <div class="detail-value address-container">
                                <span class="address">0x3e5f271c4e6f7b6e6f4c4c4c4c4c4c4c4c4c4c4c4</span>
                                <button class="copy-btn" data-clipboard-text="0x3e5f271c4e6f7b6e6f4c4c4c4c4c4c4c4c4c4c4c4">
                                    <i class="fas fa-copy"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="detail-group expandable">
                            <div class="detail-label">Call Data:</div>
                            <div class="detail-value">
                                <button class="expand-btn">
                                    <i class="fas fa-chevron-down"></i>
                                    <span>Expand</span>
                                </button>
                                <div class="expandable-content">
                                    <pre class="code-block">0x3e5f271c4e6f7b6e6f4c4c4c4c4c4c4c4c4c4c4c4...</pre>
                                </div>
                            </div>
                        </div>
                        
                        <div class="detail-group expandable">
                            <div class="detail-label">Decoded Call Data:</div>
                            <div class="detail-value">
                                <button class="expand-btn">
                                    <i class="fas fa-chevron-down"></i>
                                    <span>Expand</span>
                                </button>
                                <div class="expandable-content">
                                    <pre class="code-block">function upgradeProtocol(
    address newImplementation,
    uint256 version,
    bytes calldata initData
) external onlyGovernance {
    // Implementation details
}</pre>
                                </div>
                            </div>
                        </div>
                        
                        <div class="description-section">
                            <h3>Description</h3>
                            <p>This protocol upgrade implements several performance improvements and new features for developers. The upgrade focuses on optimizing gas usage, enhancing security measures, and adding new functionality to the DMD ecosystem.</p>
                        </div>
                        
                        <div class="key-changes">
                            <h3>Key Changes</h3>
                            <ul>
                                <li><i class="fas fa-check"></i> Reduced gas costs for common operations by up to 25%</li>
                                <li><i class="fas fa-check"></i> Added new developer APIs for improved integration</li>
                                <li><i class="fas fa-check"></i> Enhanced security through improved validation mechanisms</li>
                                <li><i class="fas fa-check"></i> Fixed several edge case bugs in the previous implementation</li>
                            </ul>
                        </div>
                        
                        <div class="additional-resources">
                            <h3>Additional Resources</h3>
                            <div class="resource-links">
                                <a href="#" class="resource-link">
                                    <i class="fas fa-file-alt"></i>
                                    <span>Technical Documentation</span>
                                </a>
                                <a href="#" class="resource-link">
                                    <i class="fas fa-comments"></i>
                                    <span>Discussion Forum</span>
                                </a>
                                <a href="#" class="resource-link">
                                    <i class="fab fa-github"></i>
                                    <span>GitHub Repository</span>
                                </a>
                            </div>
                        </div>
                    `
          break
      }

      // Apply fade-in animation
      setTimeout(() => {
        cardBody.style.opacity = "1"

        // Reinitialize expandable sections
        const newExpandButtons = cardBody.querySelectorAll(".expand-btn")
        newExpandButtons.forEach((button) => {
          button.addEventListener("click", function () {
            const expandableSection = this.closest(".expandable")
            expandableSection.classList.toggle("expanded")

            const icon = this.querySelector("i")
            const text = this.querySelector("span")

            if (expandableSection.classList.contains("expanded")) {
              icon.className = "fas fa-chevron-up"
              text.textContent = "Collapse"
            } else {
              icon.className = "fas fa-chevron-down"
              text.textContent = "Expand"
            }
          })
        })

        // Reinitialize clipboard
        const newCopyButtons = cardBody.querySelectorAll(".copy-btn")
        if (newCopyButtons.length > 0) {
          try {
            clipboard = new ClipboardJS(newCopyButtons)
          } catch (error) {
            console.error("ClipboardJS re-initialization failed:", error)
            // Optionally, disable copy buttons or provide a fallback mechanism
            newCopyButtons.forEach((button) => {
              button.disabled = true
              button.title = "Copy functionality is not available."
            })
          }
        }

        // Restore scroll position
        window.scrollTo(0, scrollPosition)
      }, 300)
    }, 300)
  }

  // Add diamond animations
  function createDiamonds() {
    const container = document.querySelector(".container")
    const diamondCount = 3

    for (let i = 0; i < diamondCount; i++) {
      const diamond = document.createElement("div")
      diamond.className = "floating-diamond"
      diamond.style.position = "absolute"
      diamond.style.width = "30px"
      diamond.style.height = "30px"
      diamond.style.backgroundImage =
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237b3fe4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2.34 14.63L12 21l9.66-6.37M12 3v18M2.34 9.37L12 3l9.66 6.37'/%3E%3C/svg%3E\")"
      diamond.style.backgroundRepeat = "no-repeat"
      diamond.style.backgroundSize = "contain"
      diamond.style.opacity = "0.1"
      diamond.style.zIndex = "-1"

      // Random position
      const left = Math.random() * 100
      const top = Math.random() * document.body.scrollHeight
      diamond.style.left = `${left}%`
      diamond.style.top = `${top}px`

      // Random animation duration
      const duration = 15 + Math.random() * 15
      diamond.style.animation = `float ${duration}s ease-in-out infinite`
      diamond.style.animationDelay = `${Math.random() * 5}s`

      document.body.appendChild(diamond)
    }
  }

  createDiamonds()

  // Mobile menu functionality (from main site)
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const navLinks = document.querySelector(".nav-links")

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active")
      mobileMenuBtn.classList.toggle("active")

      if (navLinks.classList.contains("active")) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    })
  }

  // Dropdown functionality (from main site)
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")

  function setupDropdowns() {
    if (window.innerWidth <= 768) {
      // Mobile behavior
      dropdownToggles.forEach((toggle) => {
        toggle.addEventListener("click", function (e) {
          e.preventDefault()
          e.stopPropagation()

          const parent = this.parentElement

          // Close other dropdowns
          document.querySelectorAll(".dropdown").forEach((dropdown) => {
            if (dropdown !== parent) {
              dropdown.classList.remove("active")
            }
          })

          // Toggle current dropdown
          parent.classList.toggle("active")
        })
      })
    }
  }

  // Initial setup
  setupDropdowns()

  // Reconfigure on window resize
  window.addEventListener("resize", setupDropdowns)
})
