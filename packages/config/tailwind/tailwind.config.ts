// packages/config/tailwind/tailwind.config.ts
import tailwindcssAnimate from 'tailwindcss-animate';

/**
 * This is the shared Tailwind CSS configuration preset.
 * It doesn't contain a `content` property, which must be defined in the consuming app's config.
 */
export const tailwindPreset = {
  darkMode: ['class', 'media'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      // THE FIX IS HERE.
      // We are mapping the semantic CSS variables you defined in globals.css
      // to Tailwind's color palette.
      colors: {
        // This tells Tailwind: "When you see 'border', use the color defined by var(--border)".
        // Now classes like `border-border`, `bg-border`, `text-border` will work.
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          // This maps `bg-primary`, `text-primary`, etc. to var(--primary)
          DEFAULT: 'hsl(var(--primary))',
          // This maps `bg-primary-foreground`, etc. to var(--primary-foreground)
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 2px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // This plugin adds the base styles you were trying to create with @apply
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function ({ addBase }: any) {
      addBase({
        // This is the correct way to apply global styles.
        // It injects them into the same `@layer base` as your variables.
        '*': {
          // It's generally better to set the border color on components
          // rather than globally on every single element with '*'.
          // But if you must, this is how you'd do it.
          // borderColor: 'hsl(var(--border))',
        },
        body: {
          // This correctly applies the background and foreground colors to the body.
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          // You can add other base body styles here
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
      });
    },
  ],
};
