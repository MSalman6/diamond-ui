// Add JavaScript to ensure content is visible and handle animations
document.addEventListener("DOMContentLoaded", () => {
  // Make sure all fade-in elements are visible
  const fadeElements = document.querySelectorAll(".fade-in")

  // Add visible class to all fade elements immediately
  fadeElements.forEach((element) => {
    element.classList.add("visible")
  })

  // Mobile menu toggle
  document.querySelector(".mobile-menu-btn").addEventListener("click", function () {
    document.querySelector(".nav-links").classList.toggle("active")
    this.classList.toggle("active")
  })

  // Copy address functionality
  document.getElementById("copy-address").addEventListener("click", () => {
    const address = document.getElementById("validator-address").textContent
    navigator.clipboard.writeText(address).then(() => {
      // Show a temporary tooltip or notification
      alert("Address copied to clipboard!")
    })
  })

  // View in explorer functionality
  document.getElementById("view-explorer").addEventListener("click", () => {
    const address = document.getElementById("validator-address").textContent
    // Open explorer in a new tab (replace with actual explorer URL)
    window.open(`https://explorer.dmd.com/validator/${address}`, "_blank")
  })

  // Stake button functionality
  const stakeButtons = document.querySelectorAll("#stake-button, #delegate-button")
  const stakeModal = document.getElementById("stake-modal")
  const closeButtons = document.querySelectorAll(".close-modal")
  const confirmStakeBtn = document.getElementById("confirm-stake")
  const stakingProgressModal = document.getElementById("staking-progress-modal")

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
