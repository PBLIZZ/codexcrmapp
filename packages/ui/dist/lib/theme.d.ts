/**
 * Theme configuration for the wellness design system
 */
export declare const themeConfig: {
    colors: {
        primary: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            950: string;
            DEFAULT: string;
            foreground: string;
        };
        accent: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            950: string;
            DEFAULT: string;
            foreground: string;
        };
        wellness: {
            teal: {
                50: string;
                100: string;
                200: string;
                300: string;
                400: string;
                500: string;
                600: string;
                700: string;
                800: string;
                900: string;
                950: string;
            };
            orange: {
                50: string;
                100: string;
                200: string;
                300: string;
                400: string;
                500: string;
                600: string;
                700: string;
                800: string;
                900: string;
                950: string;
            };
        };
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    spacing: {
        content: {
            xs: string;
            sm: string;
            md: string;
            lg: string;
            xl: string;
        };
    };
    typography: {
        fontFamily: {
            sans: string;
            mono: string;
        };
    };
    shadows: {
        sm: string;
        DEFAULT: string;
        md: string;
        lg: string;
        xl: string;
    };
};
/**
 * Get a color value from the theme
 * @param path - Path to the color in the theme config (e.g., 'primary.500')
 * @returns CSS variable or direct color value
 */
export declare function getThemeColor(path: string): string;
/**
 * Check if the current theme is dark mode
 * @returns Boolean indicating if dark mode is active
 */
export declare function isDarkMode(): boolean;
/**
 * Toggle between light and dark mode
 * @param isDark - Force a specific mode (optional)
 */
export declare function toggleDarkMode(isDark?: boolean): void;
/**
 * Initialize theme based on user preference or system setting
 */
export declare function initializeTheme(): void;
//# sourceMappingURL=theme.d.ts.map