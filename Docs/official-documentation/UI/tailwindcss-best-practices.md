# Tailwind CSS Best Practices - Enterprise Styling Standards

## Document Information
- **Name**: tailwindcss-best-practices.mdc
- **Description**: Comprehensive best practices for using Tailwind CSS in enterprise applications
- **File Patterns**: `**/*.{tsx,jsx,css}`
- **Always Apply**: true

## Executive Summary

This document establishes enterprise-grade Tailwind CSS development standards focusing on maintainable utility-first styling, design system consistency, and performance optimization. These practices ensure scalable, accessible, and consistent user interfaces that align with Model Context Protocol (MCP) requirements.

## 1. Configuration and Setup Standards

### 1.1 Production-Ready tailwind.config.js

**Professional Configuration Setup:**
```javascript
// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  // Dark mode configuration
  darkMode: ['class'],
  
  theme: {
    // Container configuration
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },

    extend: {
      // Custom color palette
      colors: {
        // Semantic colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Primary brand colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50))',
          100: 'hsl(var(--primary-100))',
          200: 'hsl(var(--primary-200))',
          300: 'hsl(var(--primary-300))',
          400: 'hsl(var(--primary-400))',
          500: 'hsl(var(--primary-500))',
          600: 'hsl(var(--primary-600))',
          700: 'hsl(var(--primary-700))',
          800: 'hsl(var(--primary-800))',
          900: 'hsl(var(--primary-900))',
          950: 'hsl(var(--primary-950))',
        },

        // Secondary colors
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // Destructive colors
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        // Muted colors
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        // Accent colors
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        // Popover colors
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        // Card colors
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Status colors
        success: {
          DEFAULT: 'hsl(142, 76%, 36%)',
          foreground: 'hsl(138, 76%, 97%)',
          50: 'hsl(138, 76%, 97%)',
          100: 'hsl(141, 84%, 93%)',
          200: 'hsl(141, 79%, 85%)',
          300: 'hsl(142, 77%, 73%)',
          400: 'hsl(142, 69%, 58%)',
          500: 'hsl(142, 76%, 36%)',
          600: 'hsl(142, 72%, 29%)',
          700: 'hsl(142, 64%, 24%)',
          800: 'hsl(143, 54%, 20%)',
          900: 'hsl(144, 61%, 20%)',
          950: 'hsl(145, 80%, 10%)',
        },

        warning: {
          DEFAULT: 'hsl(38, 92%, 50%)',
          foreground: 'hsl(48, 96%, 89%)',
          50: 'hsl(48, 96%, 89%)',
          100: 'hsl(48, 100%, 80%)',
          200: 'hsl(48, 95%, 76%)',
          300: 'hsl(46, 92%, 68%)',
          400: 'hsl(43, 89%, 58%)',
          500: 'hsl(38, 92%, 50%)',
          600: 'hsl(32, 95%, 44%)',
          700: 'hsl(26, 90%, 37%)',
          800: 'hsl(23, 83%, 31%)',
          900: 'hsl(22, 78%, 26%)',
          950: 'hsl(15, 86%, 15%)',
        },

        error: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          foreground: 'hsl(0, 93%, 94%)',
          50: 'hsl(0, 93%, 94%)',
          100: 'hsl(0, 96%, 89%)',
          200: 'hsl(0, 93%, 81%)',
          300: 'hsl(0, 94%, 71%)',
          400: 'hsl(0, 91%, 71%)',
          500: 'hsl(0, 84%, 60%)',
          600: 'hsl(0, 72%, 51%)',
          700: 'hsl(0, 74%, 42%)',
          800: 'hsl(0, 70%, 35%)',
          900: 'hsl(0, 63%, 31%)',
          950: 'hsl(0, 75%, 15%)',
        },
      },

      // Typography scale
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
        heading: ['var(--font-heading)', ...fontFamily.sans],
      },

      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },

      // Spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },

      // Border radius
      borderRadius: {
        'lg': '0.5rem',
        'md': '0.375rem',
        'sm': '0.125rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },

      // Box shadows
      boxShadow: {
        'elevation-1': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'elevation-2': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'elevation-3': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'elevation-4': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'elevation-5': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'elevation-6': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },

      // Animation and transitions
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'fade-out': 'fadeOut 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-out': 'slideOut 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-out': 'scaleOut 0.2s ease-out',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },

      // Z-index scale
      zIndex: {
        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
    },
  },

  plugins: [
    // Form styles
    require('@tailwindcss/forms'),
    
    // Typography plugin
    require('@tailwindcss/typography'),
    
    // Container queries
    require('@tailwindcss/container-queries'),

    // Custom utility plugins
    plugin(function ({ addUtilities, addComponents, theme }) {
      // Custom utilities
      addUtilities({
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: theme('colors.muted.DEFAULT'),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme('colors.muted.foreground'),
            borderRadius: theme('borderRadius.full'),
          },
        },
      })

      // Component styles
      addComponents({
        '.btn': {
          '@apply inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50': {},
        },
        '.btn-primary': {
          '@apply bg-primary text-primary-foreground hover:bg-primary/90': {},
        },
        '.btn-secondary': {
          '@apply bg-secondary text-secondary-foreground hover:bg-secondary/80': {},
        },
        '.btn-destructive': {
          '@apply bg-destructive text-destructive-foreground hover:bg-destructive/90': {},
        },
        '.btn-outline': {
          '@apply border border-input bg-background hover:bg-accent hover:text-accent-foreground': {},
        },
        '.btn-ghost': {
          '@apply hover:bg-accent hover:text-accent-foreground': {},
        },
        '.btn-link': {
          '@apply text-primary underline-offset-4 hover:underline': {},
        },
        '.btn-sm': {
          '@apply h-9 rounded-md px-3': {},
        },
        '.btn-default': {
          '@apply h-10 px-4 py-2': {},
        },
        '.btn-lg': {
          '@apply h-11 rounded-md px-8': {},
        },
        '.btn-icon': {
          '@apply h-10 w-10': {},
        },
      })
    }),

    // Custom animations plugin
    plugin(function ({ addUtilities, matchUtilities, theme }) {
      addUtilities({
        '.animate-in': {
          'animation-name': 'enter',
          'animation-duration': theme('animationDuration.DEFAULT'),
          '--tw-enter-opacity': 'initial',
          '--tw-enter-scale': 'initial',
          '--tw-enter-rotate': 'initial',
          '--tw-enter-translate-x': 'initial',
          '--tw-enter-translate-y': 'initial',
        },
        '.animate-out': {
          'animation-name': 'exit',
          'animation-duration': theme('animationDuration.DEFAULT'),
          '--tw-exit-opacity': 'initial',
          '--tw-exit-scale': 'initial',
          '--tw-exit-rotate': 'initial',
          '--tw-exit-translate-x': 'initial',
          '--tw-exit-translate-y': 'initial',
        },
      })
    }),
  ],
}
```

### 1.2 CSS Variables Setup

**Professional CSS Variables Structure:**
```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Primary color variables */
    --primary-50: 250 245 255;
    --primary-100: 243 232 255;
    --primary-200: 233 213 255;
    --primary-300: 216 180 254;
    --primary-400: 196 181 253;
    --primary-500: 168 85 247;
    --primary-600: 147 51 234;
    --primary-700: 126 34 206;
    --primary-800: 107 33 168;
    --primary-900: 88 28 135;
    --primary-950: 59 7 100;

    /* Semantic color variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 262.1 83.3% 57.8%;
    --primary-foreground: 210 20% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 262.1 83.3% 57.8%;
    --radius: 0.5rem;

    /* Typography variables */
    --font-sans: 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --font-heading: 'Cal Sans', system-ui, sans-serif;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 20% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 20% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 20% 98%;
    --primary: 263.4 70% 50.4%;
    --primary-foreground: 210 20% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 20% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 263.4 70% 50.4%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: 'rlig' 1, 'calt' 1;
  }

  /* Typography base styles */
  h1, h2, h3, h4, h5, h6 {
    @apply font-heading font-semibold tracking-tight;
  }

  h1 {
    @apply text-4xl lg:text-5xl;
  }

  h2 {
    @apply text-3xl lg:text-4xl;
  }

  h3 {
    @apply text-2xl lg:text-3xl;
  }

  h4 {
    @apply text-xl lg:text-2xl;
  }

  h5 {
    @apply text-lg lg:text-xl;
  }

  h6 {
    @apply text-base lg:text-lg;
  }

  p {
    @apply leading-7 [&:not(:first-child)]:mt-6;
  }

  blockquote {
    @apply mt-6 border-l-2 pl-6 italic;
  }

  /* Focus styles */
  :focus-visible {
    @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
  }

  /* Selection styles */
  ::selection {
    @apply bg-primary/20;
  }

  /* Scrollbar styles */
  ::-webkit-scrollbar {
    @apply w-2 h-2;
  }

  ::-webkit-scrollbar-track {
    @apply bg-muted;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-muted-foreground/50 rounded-full;
  }

  ::-webkit-scrollbar-thumb:hover {
    @apply bg-muted-foreground/70;
  }
}

@layer components {
  /* Component-level styles */
  .prose {
    @apply text-foreground;
  }

  .prose h1,
  .prose h2,
  .prose h3,
  .prose h4,
  .prose h5,
  .prose h6 {
    @apply text-foreground font-heading;
  }

  .prose a {
    @apply text-primary no-underline hover:underline;
  }

  .prose code {
    @apply bg-muted px-1.5 py-0.5 rounded text-sm;
  }

  .prose pre {
    @apply bg-muted/50 border;
  }

  .prose blockquote {
    @apply border-l-primary/20;
  }
}
```

## 2. Design System Implementation

### 2.1 Component Class Patterns

**Professional Component Styling:**
```typescript
// lib/utils.ts - Class name utility
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// components/ui/button.tsx
import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
```

### 2.2 Responsive Design Patterns

**Professional Responsive Implementation:**
```typescript
// components/responsive-grid.tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className,
  cols = {
    default: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  },
  gap = {
    default: 4,
    sm: 4,
    md: 6,
    lg: 6,
    xl: 8,
    '2xl': 8,
  },
}) => {
  const gridClasses = cn(
    'grid',
    // Columns
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    cols['2xl'] && `2xl:grid-cols-${cols['2xl']}`,
    // Gaps
    gap.default && `gap-${gap.default}`,
    gap.sm && `sm:gap-${gap.sm}`,
    gap.md && `md:gap-${gap.md}`,
    gap.lg && `lg:gap-${gap.lg}`,
    gap.xl && `xl:gap-${gap.xl}`,
    gap['2xl'] && `2xl:gap-${gap['2xl']}`,
    className
  )

  return (
    <div className={gridClasses}>
      {children}
    </div>
  )
}

// components/responsive-typography.tsx
interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'primary' | 'destructive'
  responsive?: boolean
}

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  className,
  size = 'base',
  weight = 'normal',
  color = 'default',
  responsive = true,
}) => {
  const textClasses = cn(
    // Base size classes
    {
      'text-xs': size === 'xs',
      'text-sm': size === 'sm',
      'text-base': size === 'base',
      'text-lg': size === 'lg',
      'text-xl': size === 'xl',
      'text-2xl': size === '2xl',
      'text-3xl': size === '3xl',
      'text-4xl': size === '4xl',
      'text-5xl': size === '5xl',
    },
    // Responsive adjustments
    responsive && {
      'sm:text-sm': size === 'xs',
      'sm:text-base': size === 'sm',
      'sm:text-lg': size === 'base',
      'sm:text-xl': size === 'lg',
      'sm:text-2xl': size === 'xl',
      'sm:text-3xl': size === '2xl',
      'sm:text-4xl': size === '3xl',
      'sm:text-5xl': size === '4xl',
      'sm:text-6xl': size === '5xl',
    },
    // Font weights
    {
      'font-normal': weight === 'normal',
      'font-medium': weight === 'medium',
      'font-semibold': weight === 'semibold',
      'font-bold': weight === 'bold',
    },
    // Colors
    {
      'text-foreground': color === 'default',
      'text-muted-foreground': color === 'muted',
      'text-primary': color === 'primary',
      'text-destructive': color === 'destructive',
    },
    className
  )

  return <span className={textClasses}>{children}</span>
}

// Usage examples
export function ResponsiveLayoutExample() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <ResponsiveText 
          size="5xl" 
          weight="bold" 
          className="mb-4 leading-tight"
        >
          Enterprise Solutions
        </ResponsiveText>
        <ResponsiveText 
          size="xl" 
          color="muted" 
          className="max-w-2xl mx-auto"
        >
          Build scalable applications with our comprehensive design system
        </ResponsiveText>
      </div