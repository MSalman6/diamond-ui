// DAO Governance Page JavaScript
document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu toggle
  document.querySelector(".mobile-menu-btn").addEventListener("click", function () {
    document.querySelector(".nav-links").classList.toggle("active")
    this.classList.toggle("active")
  })

  // Intersection Observer for fade-in animations
  const fadeElements = document.querySelectorAll(".fade-in")

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
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

  // Tab switching
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".proposals-tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.dataset.tab

      // Update active tab button
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      this.classList.add("active")

      // Show selected tab content
      tabContents.forEach((content) => content.classList.remove("active"))
      document.getElementById(`${tabId}-tab`).classList.add("active")

      // Check if there are proposals to show or hide empty state
      const activeTab = document.getElementById(`${tabId}-tab`)
      const tableRows = activeTab.querySelectorAll("tbody tr")
      const emptyState = document.querySelector(".empty-state")

      if (tableRows.length === 0) {
        emptyState.style.display = "flex"
      } else {
        emptyState.style.display = "none"
      }
    })
  })

  // Countdown timer
  function updateCountdown() {
    const now = new Date()
    const endDate = new Date(now)
    endDate.setDate(endDate.getDate() + 2)
    endDate.setHours(endDate.getHours() + 18)
    endDate.setMinutes(endDate.getMinutes() + 45)
    endDate.setSeconds(endDate.getSeconds() + 32)

    const diff = endDate - now

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    document.querySelector(".countdown-item:nth-child(1) .countdown-value").textContent = days
      .toString()
      .padStart(2, "0")
    document.querySelector(".countdown-item:nth-child(2) .countdown-value").textContent = hours
      .toString()
      .padStart(2, "0")
    document.querySelector(".countdown-item:nth-child(3) .countdown-value").textContent = minutes
      .toString()
      .padStart(2, "0")
    document.querySelector(".countdown-item:nth-child(4) .countdown-value").textContent = seconds
      .toString()
      .padStart(2, "0")
  }

  // Update countdown every second
  updateCountdown()
  setInterval(updateCountdown, 1000)

  // Search functionality
  const searchInput = document.getElementById("proposal-search")
  searchInput.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase()
    const activeTab = document.querySelector(".proposals-tab-content.active")
    const tableRows = activeTab.querySelectorAll("tbody tr")
    let hasVisibleRows = false

    tableRows.forEach((row) => {
      const title = row.querySelector(".proposal-title span").textContent.toLowerCase()
      const creator = row.querySelector(".creator-address span").textContent.toLowerCase()

      if (title.includes(searchTerm) || creator.includes(searchTerm)) {
        row.style.display = ""
        hasVisibleRows = true
      } else {
        row.style.display = "none"
      }
    })

    // Show/hide empty state
    const emptyState = document.querySelector(".empty-state")
    emptyState.style.display = hasVisibleRows ? "none" : "flex"
  })

  // Filter functionality
  const proposalFilter = document.getElementById("proposal-filter")
  proposalFilter.addEventListener("change", function () {
    const filterValue = this.value.toLowerCase()
    const activeTab = document.querySelector(".proposals-tab-content.active")
    const tableRows = activeTab.querySelectorAll("tbody tr")
    let hasVisibleRows = false

    tableRows.forEach((row) => {
      const type = row.querySelector(".proposal-type").textContent.toLowerCase()

      if (filterValue === "all" || type === filterValue) {
        row.style.display = ""
        hasVisibleRows = true
      } else {
        row.style.display = "none"
      }
    })

    // Show/hide empty state
    const emptyState = document.querySelector(".empty-state")
    emptyState.style.display = hasVisibleRows ? "none" : "flex"
  })

  // Sorting functionality
  const sortIcons = document.querySelectorAll(".proposals-table th i.fa-sort")
  sortIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const columnIndex = Array.from(this.closest("tr").children).indexOf(this.closest("th"))
      const activeTab = document.querySelector(".proposals-tab-content.active")
      const tableBody = activeTab.querySelector("tbody")
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
        let aValue, bValue

        // Handle different column types
        if (columnIndex === 0) {
          // Date column
          aValue = new Date(a.cells[columnIndex].textContent)
          bValue = new Date(b.cells[columnIndex].textContent)
        } else if (columnIndex === 4) {
          // Participation column
          aValue = Number.parseFloat(a.querySelector(".participation-value").textContent)
          bValue = Number.parseFloat(b.querySelector(".participation-value").textContent)
        } else if (columnIndex === 5) {
          // Exceeding Yes column
          aValue = Number.parseFloat(a.querySelector(".exceeding-value").textContent.replace("%", ""))
          bValue = Number.parseFloat(b.querySelector(".exceeding-value").textContent.replace("%", ""))
        } else if (columnIndex === 6) {
          // Voted column
          aValue = a.querySelector(".voted-status").classList.contains("voted")
          bValue = b.querySelector(".voted-status").classList.contains("voted")
        } else {
          aValue = a.cells[columnIndex].textContent.trim().toLowerCase()
          bValue = b.cells[columnIndex].textContent.trim().toLowerCase()
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

  // Modal functionality
  const createProposalBtns = document.querySelectorAll(".create-proposal-btn")
  const createProposalModal = document.getElementById("create-proposal-modal")
  const voteBtns = document.querySelectorAll(".btn-vote")
  const voteModal = document.getElementById("vote-modal")
  const closeButtons = document.querySelectorAll(".close-modal")

  // Open create proposal modal
  createProposalBtns.forEach((button) => {
    button.addEventListener("click", () => {
      createProposalModal.classList.add("show")
    })
  })

  // Open vote modal
  voteBtns.forEach((button) => {
    button.addEventListener("click", function () {
      const row = this.closest("tr")
      const title = row.querySelector(".proposal-title span").textContent
      const type = row.querySelector(".proposal-type").className.split(" ")[1]
      const date = row.cells[0].textContent

      // Update modal with proposal data
      document.getElementById("vote-proposal-title").textContent = title
      document.querySelector("#vote-modal .proposal-meta .proposal-type").className = `proposal-type ${type}`
      document.querySelector("#vote-modal .proposal-date").textContent = `Created on ${date}`

      voteModal.classList.add("show")
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

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.classList.remove("show")
    }
  })

  // Vote button selection
  const voteOptions = document.querySelectorAll(".vote-btn")
  const confirmVoteBtn = document.getElementById("confirm-vote")

  voteOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove selected class from all options
      voteOptions.forEach((opt) => opt.classList.remove("selected"))

      // Add selected class to clicked option
      this.classList.add("selected")

      // Enable confirm button
      confirmVoteBtn.disabled = false
    })
  })

  // Confirm vote
  confirmVoteBtn.addEventListener("click", () => {
    // Get selected vote
    const selectedVote = document.querySelector(".vote-btn.selected")

    if (selectedVote) {
      const voteType = selectedVote.classList.contains("vote-yes")
        ? "Yes"
        : selectedVote.classList.contains("vote-no")
          ? "No"
          : "Abstain"

      // Close modal
      voteModal.classList.remove("show")

      // Show success message
      alert(`Your vote (${voteType}) has been submitted successfully!`)

      // Update UI to show voted status
      const activeTab = document.querySelector(".proposals-tab-content.active")
      if (activeTab.id === "actions-tab") {
        // Refresh the actions tab to remove the voted proposal
        setTimeout(() => {
          document.querySelector('.tab-btn[data-tab="current"]').click()
          setTimeout(() => {
            document.querySelector('.tab-btn[data-tab="actions"]').click()
          }, 100)
        }, 500)
      }
    }
  })

  // Submit proposal
  const submitProposalBtn = document.getElementById("submit-proposal")

  submitProposalBtn.addEventListener("click", () => {
    const title = document.getElementById("proposal-title").value
    const type = document.getElementById("proposal-type").value
    const description = document.getElementById("proposal-description").value

    if (title && type && description) {
      // Close modal
      createProposalModal.classList.remove("show")

      // Show success message
      alert("Your proposal has been submitted successfully!")

      // Reset form
      document.getElementById("proposal-title").value = ""
      document.getElementById("proposal-description").value = ""
      document.getElementById("proposal-changes").value = ""
    } else {
      alert("Please fill in all required fields.")
    }
  })
})
