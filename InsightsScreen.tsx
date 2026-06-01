@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 40 24% 94%;
    --foreground: 0 0% 10%;
    --card: 40 33% 96%;
    --card-foreground: 0 0% 10%;
    --popover: 40 33% 96%;
    --popover-foreground: 0 0% 10%;
    --primary: 20 64% 47%;
    --primary-foreground: 0 0% 100%;
    --secondary: 30 14% 67%;
    --secondary-foreground: 0 0% 10%;
    --muted: 30 14% 67%;
    --muted-foreground: 25 8% 40%;
    --accent: 40 33% 96%;
    --accent-foreground: 0 0% 10%;
    --destructive: 0 72% 51%;
    --destructive-foreground: 0 0% 98%;
    --border: 30 14% 80%;
    --input: 30 14% 80%;
    --ring: 20 64% 47%;
    --radius: 0.75rem;

    --color-parchment: #F5F0E8;
    --color-charcoal: #1A1A1A;
    --color-burnt-orange: #C45D2B;
    --color-muted-clay: #B8A89A;
    --color-warm-stone: #3D3833;
    --color-soft-cream: #FAF7F2;
    --color-deep-espresso: #2C2825;
    --color-sage-mist: #A8B5A0;
    --color-dusty-rose: #C9A9A6;
  }

  .dark {
    --background: 30 8% 16%;
    --foreground: 40 24% 94%;
    --card: 30 8% 20%;
    --card-foreground: 40 24% 94%;
    --popover: 30 8% 20%;
    --popover-foreground: 40 24% 94%;
    --primary: 20 64% 47%;
    --primary-foreground: 0 0% 100%;
    --secondary: 30 8% 25%;
    --secondary-foreground: 40 24% 94%;
    --muted: 30 8% 25%;
    --muted-foreground: 30 14% 60%;
    --accent: 30 8% 25%;
    --accent-foreground: 40 24% 94%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 30 8% 25%;
    --input: 30 8% 25%;
    --ring: 20 64% 47%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-parchment text-charcoal font-body antialiased;
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html {
    scroll-behavior: smooth;
  }
}

@layer utilities {
  .text-display-xl {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 48px;
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }
  .text-display-lg {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 36px;
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }
  .text-display-md {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 28px;
    font-weight: 400;
    line-height: 1.2;
  }
  .text-display-sm {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.25;
  }
  .text-body-lg {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.6;
  }
  .text-body {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.6;
  }
  .text-body-sm {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
  }
  .text-caption {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: 0.04em;
  }
  .text-label {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11px;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .safe-top {
    padding-top: env(safe-area-inset-top, 0px);
  }
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
}
