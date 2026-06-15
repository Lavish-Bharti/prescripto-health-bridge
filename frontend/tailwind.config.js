//  /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#0EA5E9",
//         "primary-dark": "#0284C7",
//         "primary-light": "#E0F2FE",
//         accent: "#10B981",
//         surface: "#F8FAFC",
//         dark: "#0F172A",
//         muted: "#64748B",
//       },
//       fontFamily: {
//         display: ["'Playfair Display'", "Georgia", "serif"],
//         body: ["'DM Sans'", "sans-serif"],
//       },
//       boxShadow: {
//         card: "0 4px 24px rgba(14,165,233,0.08)",
//         "card-hover": "0 8px 40px rgba(14,165,233,0.18)",
//         glass: "0 8px 32px rgba(0,0,0,0.06)",
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:        "#00D4FF",
        "primary-dark": "#0EA5E9",
        "primary-light":"rgba(0,212,255,0.12)",
        violet:         "#7C3AED",
        cyan:           "#00D4FF",
        emerald:        "#10B981",
        rose:           "#F43F5E",
        gold:           "#F59E0B",
        navy:           "#0A0F1E",
        "navy-2":       "#111827",
        "navy-3":       "#1F2937",
        dark:           "#0A0F1E",
        "dark-secondary":"#111827",
        surface:        "#111827",
        muted:          "rgba(255,255,255,0.45)",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body:    ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        card:       "0 4px 24px rgba(0,212,255,0.08)",
        "card-hover":"0 8px 40px rgba(0,212,255,0.18)",
        glass:      "0 8px 32px rgba(0,0,0,0.4)",
        glow:       "0 0 20px rgba(0,212,255,0.25)",
        "glow-v":   "0 0 20px rgba(124,58,237,0.25)",
      },
      backgroundImage: {
        "hero-gradient":   "linear-gradient(135deg,#00D4FF,#7C3AED)",
        "card-gradient":   "linear-gradient(135deg,rgba(0,212,255,0.08),rgba(124,58,237,0.12))",
        "button-gradient": "linear-gradient(135deg,#0EA5E9,#7C3AED)",
      },
      animation: {
        "fade-in":   "fadeIn 0.5s ease forwards",
        "slide-up":  "slideUp 0.5s ease forwards",
        "pulse-glow":"pulseGlow 2s ease-in-out infinite",
        "float":     "float 6s ease-in-out infinite",
        "orb":       "orbDrift 8s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn:     { from:{ opacity:0 }, to:{ opacity:1 } },
        slideUp:    { from:{ opacity:0, transform:"translateY(24px)" }, to:{ opacity:1, transform:"translateY(0)" } },
        pulseGlow:  { "0%,100%":{ boxShadow:"0 0 0 0 rgba(0,212,255,0.4)" }, "50%":{ boxShadow:"0 0 0 8px rgba(0,212,255,0)" } },
        float:      { "0%,100%":{ transform:"translateY(0)" }, "50%":{ transform:"translateY(-10px)" } },
        orbDrift:   { "0%":{ transform:"translate(0,0) scale(1)" }, "100%":{ transform:"translate(40px,30px) scale(1.1)" } },
      },
      backdropBlur: { xs:"2px" },
    },
  },
  plugins: [],
};