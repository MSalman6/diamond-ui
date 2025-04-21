// Theme management for DMD Blockchain website
document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle")
  const htmlRoot = document.documentElement

  // Theme variables
  const themes = {
    dark: {
      "--bg": "#030014",
      "--darker-bg": "#020010",
      "--card-bg": "rgba(255, 255, 255, 0.05)",
      "--card-hover": "rgba(255, 255, 255, 0.1)",
      "--border-color": "rgba(255, 255, 255, 0.1)",
      "--text": "#ffffff",
      "--text-secondary": "rgba(255, 255, 255, 0.7)",
      "--purple-glow": "rgba(138, 43, 226, 0.4)",
      "--blue-glow": "rgba(0, 157, 255, 0.4)",
      "--teal-glow": "rgba(0, 255, 191, 0.4)",
      "--header-bg": "rgba(3, 0, 20, 0.5)",
      "--diamond-1-color": "rgba(1, 69, 178, 0.08)",
      "--diamond-2-color": "rgba(138, 43, 226, 0.08)",
      "--diamond-3-color": "rgba(0, 157, 255, 0.08)",
      "--cosmic-grid-color": "rgba(255, 255, 255, 0.05)",
    },
    light: {
      "--bg": "#f8f9fc",
      "--darker-bg": "#eef1f8",
      "--card-bg": "rgba(0, 0, 0, 0.03)",
      "--card-hover": "rgba(0, 0, 0, 0.06)",
      "--border-color": "rgba(0, 0, 0, 0.1)",
      "--text": "#1a1a2e",
      "--text-secondary": "rgba(26, 26, 46, 0.7)",
      "--purple-glow": "rgba(138, 43, 226, 0.15)",
      "--blue-glow": "rgba(0, 157, 255, 0.15)",
      "--teal-glow": "rgba(0, 255, 191, 0.15)",
      "--header-bg": "rgba(248, 249, 252, 0.8)",
      "--diamond-1-color": "rgba(1, 69, 178, 0.15)",
      "--diamond-2-color": "rgba(138, 43, 226, 0.15)",
      "--diamond-3-color": "rgba(0, 157, 255, 0.15)",
      "--cosmic-grid-color": "rgba(0, 0, 0, 0.03)",
    },
  }

  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  // Set initial theme
  if (savedTheme === "light") {
    applyTheme("light")
    if (themeToggle) themeToggle.checked = true
  } else if (savedTheme === "dark" || prefersDark) {
    applyTheme("dark")
    if (themeToggle) themeToggle.checked = false
  }

  // Toggle theme when checkbox changes
  if (themeToggle) {
    themeToggle.addEventListener("change", function () {
      const newTheme = this.checked ? "light" : "dark"
      applyTheme(newTheme)
      localStorage.setItem("theme", newTheme)

      // Animate theme transition
      document.body.classList.add("theme-transition")
      setTimeout(() => {
        document.body.classList.remove("theme-transition")
      }, 1000)
    })
  }

  // Apply theme function
  function applyTheme(themeName) {
    const theme = themes[themeName]
    document.body.classList.toggle("light-theme", themeName === "light")

    // Apply CSS variables
    for (const [property, value] of Object.entries(theme)) {
      htmlRoot.style.setProperty(property, value)
    }

    // Update diamond colors if they exist
    const diamonds = document.querySelectorAll(".diamond-custom")
    if (diamonds.length > 0) {
      diamonds.forEach((diamond, index) => {
        if (index === 0) diamond.style.background = theme["--diamond-1-color"]
        if (index === 1) diamond.style.background = theme["--diamond-2-color"]
        if (index === 2) diamond.style.background = theme["--diamond-3-color"]
      })
    }

    // Update cosmic grid if it exists
    const cosmicGrid = document.querySelector(".cosmic-grid")
    if (cosmicGrid) {
      cosmicGrid.style.backgroundImage = `linear-gradient(${theme["--cosmic-grid-color"]} 1px, transparent 1px), 
                                         linear-gradient(90deg, ${theme["--cosmic-grid-color"]} 1px, transparent 1px)`
    }
  }
})
