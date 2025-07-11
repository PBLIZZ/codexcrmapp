// packages/ui/src/lib/theme.ts

/**
 * Type for nested color values in themeConfig
 */
type ColorValue = string | { [key: string]: ColorValue };

/**
 * A JavaScript representation of the CSS theme variables.
 * This is primarily consumed by the tailwind.config.js file.
 */
export const themeConfig = {
  colors: {
    // Raw Color Ramps
    slate: {
      50: 'var(--slate-50)',
      100: 'var(--slate-100)',
      200: 'var(--slate-200)',
      600: 'var(--slate-600)',
      900: 'var(--slate-900)',
    },
    teal: {
      50: 'var(--teal-50)',
      100: 'var(--teal-100)',
      200: 'var(--teal-200)',
      300: 'var(--teal-300)',
      400: 'var(--teal-400)',
      500: 'var(--teal-500)',
      600: 'var(--teal-600)',
      700: 'var(--teal-700)',
      800: 'var(--teal-800)',
      900: 'var(--teal-900)',
      950: 'var(--teal-950)',
    },
    violet: {
      50: 'var(--violet-50)',
      100: 'var(--violet-100)',
    },
    amber: {
      50: 'var(--amber-50)',
      100: 'var(--amber-100)',
    },
    sky: {
      50: 'var(--sky-50)',
      100: 'var(--sky-100)',
    },
    // Semantic Colors
    border: 'var(--border)',
    input: 'var(--input)',
    ring: 'var(--ring)',
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    primary: {
      DEFAULT: 'var(--primary)',
      foreground: 'var(--primary-foreground)',
    },
    secondary: {
      DEFAULT: 'var(--secondary)',
      foreground: 'var(--secondary-foreground)',
    },
    destructive: {
      DEFAULT: 'var(--destructive)',
      foreground: 'var(--destructive-foreground)',
    },
    muted: {
      DEFAULT: 'var(--muted)',
      foreground: 'var(--muted-foreground)',
    },
    accent: {
      DEFAULT: 'var(--accent)',
      foreground: 'var(--accent-foreground)',
    },
    popover: {
      DEFAULT: 'var(--popover)',
      foreground: 'var(--popover-foreground)',
    },
    card: {
      DEFAULT: 'var(--card)',
      foreground: 'var(--card-foreground)',
    },
  },
  borderRadius: {
    lg: 'var(--radius)',
    md: 'calc(var(--radius) - 2px)',
    sm: 'calc(var(--radius) - 4px)',
  },
};

/**
 * THE BUILD FIX IS HERE!
 * This is the corrected, type-safe helper function that will resolve your build error.
 * Get a color value from the theme programmatically.
 * @param path - Path to the color in the theme config (e.g., 'primary.500')
 * @returns CSS variable or direct color value, or an empty string if not found.
 */
export function getThemeColor(path: string): string {
  const parts = path.split('.');
  // Start with the JS theme config object
  let current: any = themeConfig.colors;

  for (const part of parts) {
    // Check if current is an object and the part exists as a key
    if (typeof current !== 'object' || current === null || !(part in current)) {
      console.warn(`[getThemeColor] Path not found: ${path}`);
      return ''; // Return empty string if the path is invalid
    }
    current = current[part];
  }

  // After the loop, `current` holds the final value. Check if it's a string.
  if (typeof current === 'string') {
    return current; // The path correctly resolved to a string value
  }

  // Handle cases like 'primary' where we want the DEFAULT value
  if (
    typeof current === 'object' &&
    current !== null &&
    'DEFAULT' in current &&
    typeof current.DEFAULT === 'string'
  ) {
    return current.DEFAULT;
  }

  console.warn(`[getThemeColor] Path did not resolve to a string value: ${path}`);
  return '';
}
