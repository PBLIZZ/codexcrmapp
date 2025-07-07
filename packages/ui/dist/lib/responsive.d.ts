/**
 * Responsive design utilities and constants for consistent responsive behavior
 */
export declare const breakpoints: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
};
export type Breakpoint = keyof typeof breakpoints;
export declare const mediaQueries: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    xsMax: string;
    smMax: string;
    mdMax: string;
    lgMax: string;
    xlMax: string;
    smOnly: string;
    mdOnly: string;
    lgOnly: string;
    xlOnly: string;
    portrait: string;
    landscape: string;
    dark: string;
    light: string;
    motion: string;
    reducedMotion: string;
    hover: string;
    touch: string;
    highDPI: string;
};
export declare const containerMaxWidths: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
};
export declare const spacing: {
    0: string;
    px: string;
    0.5: string;
    1: string;
    1.5: string;
    2: string;
    2.5: string;
    3: string;
    3.5: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
    9: string;
    10: string;
    11: string;
    12: string;
    14: string;
    16: string;
    20: string;
    24: string;
    28: string;
    32: string;
    36: string;
    40: string;
    44: string;
    48: string;
    52: string;
    56: string;
    60: string;
    64: string;
    72: string;
    80: string;
    96: string;
    responsive: {
        sm: {
            page: string;
            section: string;
            component: string;
        };
        md: {
            page: string;
            section: string;
            component: string;
        };
        lg: {
            page: string;
            section: string;
            component: string;
        };
        xl: {
            page: string;
            section: string;
            component: string;
        };
    };
};
export declare const fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
    '6xl': string;
    '7xl': string;
    '8xl': string;
    '9xl': string;
    responsive: {
        h1: {
            base: string;
            md: string;
            lg: string;
        };
        h2: {
            base: string;
            md: string;
            lg: string;
        };
        h3: {
            base: string;
            md: string;
            lg: string;
        };
        h4: {
            base: string;
            md: string;
            lg: string;
        };
        h5: {
            base: string;
            md: string;
            lg: string;
        };
        h6: {
            base: string;
            md: string;
            lg: string;
        };
    };
};
export declare const zIndices: {
    hide: number;
    auto: string;
    base: number;
    docked: number;
    dropdown: number;
    sticky: number;
    banner: number;
    overlay: number;
    modal: number;
    popover: number;
    skipLink: number;
    toast: number;
    tooltip: number;
};
export declare const touchTargets: {
    sm: string;
    md: string;
    lg: string;
};
export declare const grid: {
    columns: number;
    gutter: {
        sm: string;
        md: string;
        lg: string;
    };
};
/**
 * Utility function to get a responsive value based on the current breakpoint
 * @param values Object containing values for different breakpoints
 * @param defaultValue Default value to use if no breakpoint matches
 * @returns The value for the current breakpoint
 */
export declare function getResponsiveValue<T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T): T;
/**
 * Hook to get the current breakpoint
 * @returns The current breakpoint
 */
export declare function useBreakpoint(): Breakpoint;
/**
 * Utility to generate responsive class names based on breakpoints
 * @param baseClass The base class name
 * @param breakpointClasses Object containing class names for different breakpoints
 * @returns A string of class names
 */
export declare function responsiveClasses(baseClass: string, breakpointClasses: Partial<Record<Breakpoint, string>>): string;
/**
 * Utility to check if the current device is touch-enabled
 * @returns Boolean indicating if the device is touch-enabled
 */
export declare function isTouchDevice(): boolean;
/**
 * Utility to check if the current device is a mobile device
 * @returns Boolean indicating if the device is a mobile device
 */
export declare function isMobileDevice(): boolean;
/**
 * Utility to check if the current device is in landscape orientation
 * @returns Boolean indicating if the device is in landscape orientation
 */
export declare function isLandscapeOrientation(): boolean;
/**
 * Utility to check if the current device supports hover
 * @returns Boolean indicating if the device supports hover
 */
export declare function supportsHover(): boolean;
/**
 * Utility to check if the user prefers reduced motion
 * @returns Boolean indicating if the user prefers reduced motion
 */
export declare function prefersReducedMotion(): boolean;
/**
 * Utility to check if the user prefers dark mode
 * @returns Boolean indicating if the user prefers dark mode
 */
export declare function prefersDarkMode(): boolean;
//# sourceMappingURL=responsive.d.ts.map