/**
 * Type for nested color values in themeConfig
 */
type ColorValue = string | { [key: string]: ColorValue };

/**
 * Theme configuration for the wellness design system
 */
export const themeConfig = {
  colors: {
    primary: {
      50: 'var(--primary-50)',
      100: 'var(--primary-100)',
      200: 'var(--primary-200)',
      300: 'var(--primary-300)',
      400: 'var(--primary-400)',
      500: 'var(--primary-500)',
      600: 'var(--primary-600)',
      700: 'var(--primary-700)',
      800: 'var(--primary-800)',
      900: 'var(--primary-900)',
      950: 'var(--primary-950)',
      DEFAULT: 'var(--primary)',
      foreground: 'var(--primary-foreground)',
    },
    accent: {
      50: 'var(--accent-50)',
      100: 'var(--accent-100)',
      200: 'var(--accent-200)',
      300: 'var(--accent-300)',
      400: 'var(--accent-400)',
      500: 'var(--accent-500)',
      600: 'var(--accent-600)',
      700: 'var(--accent-700)',
      800: 'var(--accent-800)',
      900: 'var(--accent-900)',
      950: 'var(--accent-950)',
      DEFAULT: 'var(--accent)',
      foreground: 'var(--accent-foreground)',
    },
    wellness: {
      teal: {
        50: '#e6f7f7',
        100: '#ccefef',
        200: '#99dfdf',
        300: '#66cfcf',
        400: '#33bfbf',
        500: '#00afaf',
        600: '#008c8c',
        700: '#006969',
        800: '#004646',
        900: '#002323',
        950: '#001111',
      },
      orange: {
        50: '#fff7e6',
        100: '#ffefcc',
        200: '#ffdf99',
        300: '#ffcf66',
        400: '#ffbf33',
        500: '#ffaf00',
        600: '#cc8c00',
        700: '#996900',
        800: '#664600',
        900: '#332300',
        950: '#1a1100',
      },
    },
  },
  borderRadius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
  },
  spacing: {
    content: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
  },
  typography: {
    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'var(--font-mono)',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

/**
 * Get a color value from the theme
 * @param path - Path to the color in the theme config (e.g., 'primary.500')
 * @returns CSS variable or direct color value
 */
export function getThemeColor(path: string): string {
  const parts = path.split('.');
  let current: ColorValue = themeConfig.colors;

  for (const part of parts) {
    if (current[part] === undefined) {
      return '';
    }
    current = current[part];
  }

  return current;
}

/**
 * Check if the current theme is dark mode
 * @returns Boolean indicating if dark mode is active
 */
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

/**
 * Toggle between light and dark mode
 * @param isDark - Force a specific mode (optional)
 */
export function toggleDarkMode(isDark?: boolean): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const newDarkMode =
    isDark !== undefined ? isDark : !root.classList.contains('dark');

  if (newDarkMode) {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

/**
 * Initialize theme based on user preference or system setting
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
