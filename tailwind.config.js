/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        parchment: '#0a0a0f',
        charcoal: '#f0ede6',
        burnt: {
          DEFAULT: 'var(--app-primary, #c8a45c)',
          orange: 'var(--app-primary, #c8a45c)',
        },
        clay: '#8a8794',
        stone: {
          warm: '#1a1a28',
        },
        cream: {
          soft: '#13131f',
        },
        espresso: {
          deep: '#0a0a0f',
        },
        sage: {
          DEFAULT: '#7fb069',
          mist: '#7fb069',
        },
        rose: {
          dusty: '#c87e8a',
        },
        gold: {
          DEFAULT: '#2dd4bf',
          dim: 'rgba(45, 212, 191, 0.15)',
          glow: 'rgba(45, 212, 191, 0.4)',
        },
        surface: {
          DEFAULT: '#0e0e18',
          elevated: '#13131f',
          card: '#1a1a28',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--app-primary, #c8a45c)",
          foreground: "#0a0a0f",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
        'card': '0 2px 16px rgba(0,0,0,0.4)',
        'card-hover': '0 4px 24px rgba(200, 164, 92, 0.12)',
        'float': '0 4px 24px rgba(0,0,0,0.4)',
        'fab': '0 4px 20px rgba(200, 164, 92, 0.25)',
        'gold': '0 0 30px rgba(200, 164, 92, 0.15)',
        'glass': '0 8px 32px rgba(0,0,0,0.3)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(200, 164, 92, 0)" },
          "50%": { boxShadow: "0 0 24px 4px rgba(200, 164, 92, 0.2)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "shimmer": "shimmer 1.5s infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.25s ease-out",
        "scale-in": "scale-in 0.25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
