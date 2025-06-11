export const initializeTheme = () => {
  // Theme toggle functionality
  const themeToggle = document.getElementById("theme-toggle") as HTMLInputElement | null
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
      "--bg": "#ffffff",
      "--darker-bg": "#f0f4fa",
      "--card-bg": "rgba(0, 0, 0, 0.04)",
      "--card-hover": "rgba(0, 0, 0, 0.08)",
      "--border-color": "rgba(0, 0, 0, 0.15)",
      "--text": "#121826",
      "--text-secondary": "rgba(18, 24, 38, 0.75)",
      "--purple-glow": "rgba(138, 43, 226, 0.25)",
      "--blue-glow": "rgba(0, 157, 255, 0.25)",
      "--teal-glow": "rgba(0, 255, 191, 0.25)",
      "--header-bg": "rgba(255, 255, 255, 0.95)",
      "--diamond-1-color": "rgba(1, 69, 178, 0.25)",
      "--diamond-2-color": "rgba(138, 43, 226, 0.25)",
      "--diamond-3-color": "rgba(0, 157, 255, 0.25)",
      "--cosmic-grid-color": "rgba(0, 0, 0, 0.06)",
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
    themeToggle.addEventListener("change", function (this: HTMLInputElement) {
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
  function applyTheme(themeName: "light" | "dark") {
    const theme = themes[themeName]
    document.body.classList.toggle("light-theme", themeName === "light")

    // Apply CSS variables
    for (const [property, value] of Object.entries(theme)) {
      htmlRoot.style.setProperty(property, value as string)
    }

    // Update diamond colors if they exist
    const diamonds = document.querySelectorAll(".diamond-custom")
    if (diamonds.length > 0) {
      diamonds.forEach((diamond, index) => {
        const htmlDiamond = diamond as HTMLElement
        if (index === 0) htmlDiamond.style.background = theme["--diamond-1-color"]
        if (index === 1) htmlDiamond.style.background = theme["--diamond-2-color"]
        if (index === 2) htmlDiamond.style.background = theme["--diamond-3-color"]
      })
    }
    // Update cosmic grid if it exists
    const cosmicGrid = document.querySelector(".cosmic-grid") as HTMLElement | null
    if (cosmicGrid) {
      cosmicGrid.style.backgroundImage = `linear-gradient(${theme["--cosmic-grid-color"]} 1px, transparent 1px), 
                                         linear-gradient(90deg, ${theme["--cosmic-grid-color"]} 1px, transparent 1px)`
    }

    // Update logo based on theme
    const logoImg = document.querySelector(".logo-img") as HTMLImageElement | null
    if (logoImg) {
      if (themeName === "light") {
        logoImg.src = "/logos/dmd-logo-dark.png"
      } else {
        logoImg.src = "/logos/dmd-logo.png"
      }
    }
  }
}