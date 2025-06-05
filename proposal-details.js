// Proposal Details Page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  document.querySelector(".mobile-menu-btn").addEventListener("click", function () {
    document.querySelector(".nav-links").classList.toggle("active")
    this.classList.toggle("active")
  })

  // Initialize ClipboardJS for copy buttons
  const clipboard = new ClipboardJS(".copy-btn")

  clipboard.on("success", (e) => {
    // Add copied class to show tooltip
    e.trigger.classList.add("copied")

    // Remove copied class after 2 seconds
    setTimeout(() => {
      e.trigger.classList.remove("copied")
    }, 2000)

    e.clearSelection()
  })

  // Expandable sections
  const expandCallDataBtn = document.getElementById("expand-call-data")
  const callDataContent = document.querySelector(".call-data-content")

  expandCallDataBtn.addEventListener("click", function () {
    callDataContent.classList.toggle("collapsed")

    if (callDataContent.classList.contains("collapsed")) {
      this.innerHTML = '<i class="fas fa-chevron-down"></i> Expand'
    } else {
      this.innerHTML = '<i class="fas fa-chevron-up"></i> Collapse'
    }
  })

  const expandDecodedDataBtn = document.getElementById("expand-decoded-data")
  const decodedDataContent = document.querySelector(".decoded-data-content")

  expandDecodedDataBtn.addEventListener("click", function () {
    decodedDataContent.classList.toggle("collapsed")

    if (decodedDataContent.classList.contains("collapsed")) {
      this.innerHTML = '<i class="fas fa-chevron-down"></i> Expand'
    } else {
      this.innerHTML = '<i class="fas fa-chevron-up"></i> Collapse'
    }
  })

  // Voting progress bar tooltip positioning
  const progressBar = document.querySelector(".voting-progress-bar")
  const tooltip = document.getElementById("progress-tooltip")

  progressBar.addEventListener("mousemove", function (e) {
    const rect = this.getBoundingClientRect()
    const x = e.clientX - rect.left

    // Position tooltip at mouse position
    tooltip.style.left = `${x}px`

    // Ensure tooltip doesn't go off the edge
    if (x < 100) {
      tooltip.style.left = "0"
    } else if (x > rect.width - 100) {
      tooltip.style.left = `${rect.width - 200}px`
    }
  })

  // Proposal type switcher (for demo purposes)
  const typeButtons = document.querySelectorAll(".type-btn")
  const proposalContents = {
    "parameter-change": document.getElementById("parameter-change-content"),
    "funding-request": document.getElementById("funding-request-content"),
    "contract-upgrade": document.getElementById("contract-upgrade-content"),
  }

  // Proposal titles for each type
  const proposalTitles = {
    "parameter-change": "Increase Min. Delegator Fee",
    "funding-request": "Community Development Fund Allocation Q2",
    "contract-upgrade": "Staking Upgrade",
  }

  typeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const type = this.dataset.type

      // Update active button
      typeButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Show selected content
      Object.values(proposalContents).forEach((content) => {
        content.classList.add("hidden")
      })

      proposalContents[type].classList.remove("hidden")

      // Update proposal title based on type
      const proposalTitle = document.getElementById("proposal-title")
      proposalTitle.textContent = proposalTitles[type]

      // Add animation to the newly shown content
      proposalContents[type].style.opacity = "0"
      proposalContents[type].style.transform = "translateY(20px)"

      setTimeout(() => {
        proposalContents[type].style.transition = "opacity 0.5s ease, transform 0.5s ease"
        proposalContents[type].style.opacity = "1"
        proposalContents[type].style.transform = "translateY(0)"
      }, 50)

      // Reset transition after animation completes
      setTimeout(() => {
        proposalContents[type].style.transition = ""
      }, 550)
    })
  })
  
  // Animate the progress bar on load
  const progressYes = document.querySelector(".progress-yes")
  const progressNo = document.querySelector(".progress-no")

  progressYes.style.width = "0"
  progressNo.style.width = "0"

  setTimeout(() => {
    progressYes.style.transition = "width 1.5s ease-out"
    progressNo.style.transition = "width 1.5s ease-out"

    progressYes.style.width = "68%"
    progressNo.style.width = "22%"
  }, 500)

  // Intersection Observer for fade-in animations
  const fadeElements = document.querySelectorAll(".proposal-card")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "0"
          entry.target.style.transform = "translateY(20px)"

          setTimeout(() => {
            entry.target.style.transition = "opacity 0.5s ease, transform 0.5s ease"
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }, 100)

          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  fadeElements.forEach((element) => {
    observer.observe(element)
  })

  // Add hover effects for resource cards
  const resourceCards = document.querySelectorAll(".resource-card")
  resourceCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)"
      this.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = ""
      this.style.boxShadow = ""
    })
  })

  // Add hover effects for related proposal items
  const relatedProposals = document.querySelectorAll(".related-proposal-item")
  relatedProposals.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)"
      this.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.2)"
    })

    item.addEventListener("mouseleave", function () {
      this.style.transform = ""
      this.style.boxShadow = ""
    })
  })

  // Add animation for timeline items
  const timelineItems = document.querySelectorAll(".timeline-item")

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "0"
          entry.target.style.transform = "translateX(-20px)"

          setTimeout(() => {
            entry.target.style.transition = "opacity 0.5s ease, transform 0.5s ease"
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateX(0)"
          }, 100 * index)

          timelineObserver.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.1,
    },
  )

  timelineItems.forEach((item) => {
    timelineObserver.observe(item)
  })
})
