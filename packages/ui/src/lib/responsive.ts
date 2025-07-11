/**
 * Responsive design utilities and constants for consistent responsive behavior
 */

// Breakpoint values in pixels
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Breakpoint types
export type Breakpoint = keyof typeof breakpoints;

// Media query strings for use in styled-components or CSS-in-JS
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs}px)`,
  sm: `@media (min-width: ${breakpoints.sm}px)`,
  md: `@media (min-width: ${breakpoints.md}px)`,
  lg: `@media (min-width: ${breakpoints.lg}px)`,
  xl: `@media (min-width: ${breakpoints.xl}px)`,
  '2xl': `@media (min-width: ${breakpoints['2xl']}px)`,
  // Max-width queries
  xsMax: `@media (max-width: ${breakpoints.sm - 1}px)`,
  smMax: `@media (max-width: ${breakpoints.md - 1}px)`,
  mdMax: `@media (max-width: ${breakpoints.lg - 1}px)`,
  lgMax: `@media (max-width: ${breakpoints.xl - 1}px)`,
  xlMax: `@media (max-width: ${breakpoints['2xl'] - 1}px)`,
  // Range queries
  smOnly: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  mdOnly: `@media (min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  lgOnly: `@media (min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
  xlOnly: `@media (min-width: ${breakpoints.xl}px) and (max-width: ${breakpoints['2xl'] - 1}px)`,
  // Special queries
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
  dark: '@media (prefers-color-scheme: dark)',
  light: '@media (prefers-color-scheme: light)',
  motion: '@media (prefers-reduced-motion: no-preference)',
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  hover: '@media (hover: hover)',
  touch: '@media (hover: none)',
  highDPI: '@media (min-resolution: 2dppx)',
};

// Container max-widths for each breakpoint
export const containerMaxWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Spacing scale for consistent spacing across screen sizes
export const spacing = {
  // Base spacing scale
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
  // Responsive spacing adjustments
  // These can be used to adjust spacing based on screen size
  responsive: {
    sm: {
      page: '1rem',
      section: '1.5rem',
      component: '0.75rem',
    },
    md: {
      page: '1.5rem',
      section: '2rem',
      component: '1rem',
    },
    lg: {
      page: '2rem',
      section: '3rem',
      component: '1.5rem',
    },
    xl: {
      page: '3rem',
      section: '4rem',
      component: '2rem',
    },
  },
};

// Font sizes with responsive adjustments
export const fontSizes = {
  // Base font sizes
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
  // Responsive heading sizes
  responsive: {
    h1: {
      base: '1.875rem', // 3xl
      md: '2.25rem', // 4xl
      lg: '3rem', // 5xl
    },
    h2: {
      base: '1.5rem', // 2xl
      md: '1.875rem', // 3xl
      lg: '2.25rem', // 4xl
    },
    h3: {
      base: '1.25rem', // xl
      md: '1.5rem', // 2xl
      lg: '1.875rem', // 3xl
    },
    h4: {
      base: '1.125rem', // lg
      md: '1.25rem', // xl
      lg: '1.5rem', // 2xl
    },
    h5: {
      base: '1rem', // base
      md: '1.125rem', // lg
      lg: '1.25rem', // xl
    },
    h6: {
      base: '0.875rem', // sm
      md: '1rem', // base
      lg: '1.125rem', // lg
    },
  },
};

// Z-index scale for consistent layering
export const zIndices = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Touch target sizes for better mobile usability
export const touchTargets = {
  sm: '36px', // Minimum size for secondary or less frequently used actions
  md: '44px', // Standard size for most interactive elements
  lg: '48px', // Larger size for primary actions
};

// Grid system configuration
export const grid = {
  columns: 12,
  gutter: {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  },
};

/**
 * Utility function to get a responsive value based on the current breakpoint
 * @param values Object containing values for different breakpoints
 * @param defaultValue Default value to use if no breakpoint matches
 * @returns The value for the current breakpoint
 */
export function getResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T {
  // This function would typically be used in a client-side context
  // where window is available. For SSR compatibility, we need to check
  // if window is defined.
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  const width = window.innerWidth;

  // Check breakpoints from largest to smallest
  if (width >= breakpoints['2xl'] && values['2xl'] !== undefined) {
    return values['2xl']!;
  }
  if (width >= breakpoints.xl && values.xl !== undefined) {
    return values.xl!;
  }
  if (width >= breakpoints.lg && values.lg !== undefined) {
    return values.lg!;
  }
  if (width >= breakpoints.md && values.md !== undefined) {
    return values.md!;
  }
  if (width >= breakpoints.sm && values.sm !== undefined) {
    return values.sm!;
  }
  if (values.xs !== undefined) {
    return values.xs!;
  }

  return defaultValue;
}

/**
 * Hook to get the current breakpoint
 * @returns The current breakpoint
 */
export function useBreakpoint(): Breakpoint {
  // This would be implemented as a React hook in a real application
  // For this example, we'll just return a placeholder implementation
  if (typeof window === 'undefined') {
    return 'md'; // Default for SSR
  }

  const width = window.innerWidth;

  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

/**
 * Utility to generate responsive class names based on breakpoints
 * @param baseClass The base class name
 * @param breakpointClasses Object containing class names for different breakpoints
 * @returns A string of class names
 */
export function responsiveClasses(
  baseClass: string,
  breakpointClasses: Partial<Record<Breakpoint, string>>
): string {
  let classes = baseClass;

  Object.entries(breakpointClasses).forEach(([breakpoint, className]) => {
    if (className) {
      switch (breakpoint) {
        case 'xs':
          classes += ` ${className}`;
          break;
        case 'sm':
          classes += ` sm:${className}`;
          break;
        case 'md':
          classes += ` md:${className}`;
          break;
        case 'lg':
          classes += ` lg:${className}`;
          break;
        case 'xl':
          classes += ` xl:${className}`;
          break;
        case '2xl':
          classes += ` 2xl:${className}`;
          break;
      }
    }
  });

  return classes;
}

/**
 * Utility to check if the current device is touch-enabled
 * @returns Boolean indicating if the device is touch-enabled
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') {
    return false; // Default for SSR
  }

  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Utility to check if the current device is a mobile device
 * @returns Boolean indicating if the device is a mobile device
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false; // Default for SSR
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Utility to check if the current device is in landscape orientation
 * @returns Boolean indicating if the device is in landscape orientation
 */
export function isLandscapeOrientation(): boolean {
  if (typeof window === 'undefined') {
    return false; // Default for SSR
  }

  return window.matchMedia('(orientation: landscape)').matches;
}

/**
 * Utility to check if the current device supports hover
 * @returns Boolean indicating if the device supports hover
 */
export function supportsHover(): boolean {
  if (typeof window === 'undefined') {
    return true; // Default for SSR
  }

  return window.matchMedia('(hover: hover)').matches;
}

/**
 * Utility to check if the user prefers reduced motion
 * @returns Boolean indicating if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return false; // Default for SSR
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Utility to check if the user prefers dark mode
 * @returns Boolean indicating if the user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') {
    return false; // Default for SSR
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
