// Add JavaScript to ensure content is visible and handle animations
document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")

  // Initialize theme based on localStorage or system preference
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-theme")
    themeToggle.checked = true
  } else if (localStorage.getItem("theme") === "dark") {
    document.body.classList.remove("light-theme")
    themeToggle.checked = false
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light-theme")
    themeToggle.checked = true
  }

  // Toggle theme when the switch is clicked
  themeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("light-theme")
      localStorage.setItem("theme", "light")
    } else {
      document.body.classList.remove("light-theme")
      localStorage.setItem("theme", "dark")
    }
  })

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const navLinks = document.querySelector(".nav-links")

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", function () {
      this.classList.toggle("active")
      navLinks.classList.toggle("active")
    })
  }

  // Dropdown toggle on mobile
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault()
        this.parentElement.classList.toggle("active")
      }
    })
  })

  // Modal functionality
  const stakeButton = document.getElementById("stake-button")
  const stakeModal = document.getElementById("stake-modal")
  const confirmStakeButton = document.getElementById("confirm-stake")
  const stakingProgressModal = document.getElementById("staking-progress-modal")
  const closeModalButtons = document.querySelectorAll(".close-modal")

  // Open stake modal
  if (stakeButton) {
    stakeButton.addEventListener("click", () => {
      stakeModal.classList.add("show")
    })
  }

  // Close modals
  closeModalButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal")
      if (modal) {
        modal.classList.remove("show")
      }
    })
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.classList.remove("show")
    }
  })

  // Confirm stake and show progress modal
  if (confirmStakeButton) {
    confirmStakeButton.addEventListener("click", () => {
      stakeModal.classList.remove("show")
      setTimeout(() => {
        stakingProgressModal.classList.add("show")
      }, 300)
    })
  }

  // MAX button functionality
  const maxButton = document.querySelector(".btn-max")
  const stakeAmountInput = document.getElementById("stake-amount")

  if (maxButton && stakeAmountInput) {
    maxButton.addEventListener("click", () => {
      stakeAmountInput.value = "25000" // Set to available balance
    })
  }

  // Copy address button
  const copyAddressButton = document.getElementById("copy-address")
  const validatorAddress = document.getElementById("validator-address")

  if (copyAddressButton && validatorAddress) {
    copyAddressButton.addEventListener("click", () => {
      const address = validatorAddress.textContent
      navigator.clipboard
        .writeText(address)
        .then(() => {
          alert("Address copied to clipboard!")
        })
        .catch((err) => {
          console.error("Could not copy text: ", err)
        })
    })
  }

  // View in explorer button
  const viewExplorerButton = document.getElementById("view-explorer")

  if (viewExplorerButton && validatorAddress) {
    viewExplorerButton.addEventListener("click", () => {
      const address = validatorAddress.textContent
      window.open(`https://explorer.example.com/validator/${address}`, "_blank")
    })
  }

  // Rewards history button
  const rewardsHistoryButton = document.getElementById("rewards-history-button")

  if (rewardsHistoryButton) {
    rewardsHistoryButton.addEventListener("click", () => {
      alert("History will be displayed here. This feature is coming soon!")
    })
  }

  // Tooltip functionality for info icons
  const infoIcons = document.querySelectorAll(".info-icon")

  infoIcons.forEach((icon) => {
    const tooltip = icon.getAttribute("title")
    if (tooltip) {
      icon.setAttribute("data-tooltip", tooltip)
      icon.removeAttribute("title")

      icon.addEventListener("mouseenter", function () {
        const tooltipEl = document.createElement("div")
        tooltipEl.className = "tooltip"
        tooltipEl.textContent = this.getAttribute("data-tooltip")
        document.body.appendChild(tooltipEl)

        const iconRect = this.getBoundingClientRect()
        tooltipEl.style.top = `${iconRect.top - tooltipEl.offsetHeight - 10}px`
        tooltipEl.style.left = `${iconRect.left + (iconRect.width / 2) - tooltipEl.offsetWidth / 2}px`
        tooltipEl.style.opacity = "1"
      })

      icon.addEventListener("mouseleave", () => {
        const tooltip = document.querySelector(".tooltip")
        if (tooltip) {
          tooltip.remove()
        }
      })
    }
  })

  // Add fade-in animation to elements
  const fadeElements = document.querySelectorAll(".fade-in")

  const fadeInObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
          fadeInObserver.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  fadeElements.forEach((element) => {
    element.style.opacity = "0"
    element.style.transform = "translateY(20px)"
    fadeInObserver.observe(element)
  })

  // Stake button functionality
  const stakeButtons = document.querySelectorAll("#stake-button, #delegate-button")
  const closeButtons = document.querySelectorAll(".close-modal")
  const confirmStakeBtn = document.getElementById("confirm-stake")

  // Open stake modal
  stakeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      stakeModal.classList.add("show")
    })
  })

  // Close modals
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const openModals = document.querySelectorAll(".modal.show")
      openModals.forEach((modal) => {
        modal.classList.remove("show")
      })
    })
  })

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    const openModals = document.querySelectorAll(".modal.show")
    openModals.forEach((modal) => {
      if (event.target === modal) {
        modal.classList.remove("show")
      }
    })
  })

  // Confirm stake and show progress
  if (confirmStakeBtn) {
    confirmStakeBtn.addEventListener("click", () => {
      stakeModal.classList.remove("show")
      stakingProgressModal.classList.add("show")

      // Simulate progress steps
      simulateStakingProgress()
    })
  }

  // Simulate staking progress
  function simulateStakingProgress() {
    const steps = document.querySelectorAll(".progress-step")
    const connectors = document.querySelectorAll(".progress-connector")
    const txMessage = document.querySelector(".transaction-message")

    // Step 1 is already marked as completed in the HTML

    // After 3 seconds, complete step 2
    setTimeout(() => {
      steps[1].classList.remove("active")
      steps[1].classList.add("completed")
      steps[1].querySelector(".step-icon").innerHTML = '<i class="fas fa-check"></i>'

      connectors[1].classList.add("active")
      steps[2].classList.add("active")
      txMessage.textContent = "Transaction confirmed! Processing stake..."

      // After 2 more seconds, complete step 3
      setTimeout(() => {
        steps[2].classList.remove("active")
        steps[2].classList.add("completed")
        steps[2].querySelector(".step-icon").innerHTML = '<i class="fas fa-check"></i>'

        connectors[2].classList.add("active")
        steps[3].classList.add("active")
        steps[3].classList.add("completed")
        txMessage.textContent = "Stake completed successfully!"

        // Update the confirm button to say "Done"
        const footerBtn = stakingProgressModal.querySelector(".modal-footer .btn-secondary")
        footerBtn.textContent = "Done"
        footerBtn.classList.remove("btn-secondary")
        footerBtn.classList.add("btn-primary")
      }, 2000)
    }, 3000)
  }

  // Sorting functionality for tables
  const sortIcons = document.querySelectorAll("th i.fa-sort")
  sortIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const columnIndex = Array.from(this.closest("tr").children).indexOf(this.closest("th"))
      const tableBody = this.closest("table").querySelector("tbody")
      const rows = Array.from(tableBody.querySelectorAll("tr"))

      // Toggle sort direction
      const isAscending = !this.classList.contains("fa-sort-up")

      // Update sort icons
      sortIcons.forEach((i) => {
        i.className = "fas fa-sort"
      })

      this.className = isAscending ? "fas fa-sort-up" : "fas fa-sort-down"

      // Sort rows
      rows.sort((a, b) => {
        let aValue = a.children[columnIndex].textContent.trim()
        let bValue = b.children[columnIndex].textContent.trim()

        // Handle numeric values
        if (!isNaN(Number.parseFloat(aValue.replace(/[^0-9.-]/g, "")))) {
          aValue = Number.parseFloat(aValue.replace(/[^0-9.-]/g, ""))
          bValue = Number.parseFloat(bValue.replace(/[^0-9.-]/g, ""))
        }

        if (aValue < bValue) return isAscending ? -1 : 1
        if (aValue > bValue) return isAscending ? 1 : -1
        return 0
      })

      // Reorder rows
      rows.forEach((row) => {
        tableBody.appendChild(row)
      })
    })
  })

  // Pagination functionality
  const paginationButtons = document.querySelectorAll(".pagination-btn")

  paginationButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Skip if it's a navigation arrow or already active
      if (
        this.classList.contains("active") ||
        this.querySelector("i.fa-chevron-left") ||
        this.querySelector("i.fa-chevron-right")
      ) {
        return
      }

      // Update active button
      const paginationContainer = this.closest(".pagination")
      paginationContainer.querySelectorAll(".pagination-btn").forEach((btn) => {
        btn.classList.remove("active")
      })
      this.classList.add("active")

      // Here you would typically load the appropriate page data
      // For this demo, we'll just scroll to the top of the table
      this.closest("section").querySelector(".table-container").scrollTop = 0
    })
  })
})
