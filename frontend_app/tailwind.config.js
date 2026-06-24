export default {
  content:[
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: "#0046cc",
        "primary-container": "#0b5cff",
        "on-primary": "#ffffff",
        "on-primary-container": "#ecedff",
        secondary: "#505f76",
        "secondary-container": "#d0e1fb",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#54647a",
        tertiary: "#9b2d00",
        "tertiary-container": "#c53b00",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        background: "#faf8ff",
        "on-background": "#191b24",
        surface: "#faf8ff",
        "surface-dim": "#d9d9e6",
        "surface-bright": "#faf8ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f2ff",
        "surface-container": "#ededfa",
        "surface-container-high": "#e7e7f4",
        "surface-container-highest": "#e1e1ef",
        "on-surface": "#191b24",
        "on-surface-variant": "#434656",
        outline: "#737688",
        "outline-variant": "#c3c5d9",
      }
    },
  },
   plugins:[
    require('@tailwindcss/typography'), 
  ],
}