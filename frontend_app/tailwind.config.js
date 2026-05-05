export default {
  content:[
    "./index.html",
    "./src*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004ac6",
        "primary-container": "#2563eb",
        "on-primary": "#ffffff",
        secondary: "#006c49",
        "secondary-container": "#6cf8bb",
        tertiary: "#ab0b1c",
        "tertiary-container": "#cf2c30",
        error: "#ba1a1a",
        surface: "#f8f9ff",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#434655",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        outline: "#737686",
        "outline-variant": "#c3c6d7",
      }
    },
  },
   plugins:[
    require('@tailwindcss/typography'), 
  ],
}