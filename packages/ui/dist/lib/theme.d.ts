/**
 * A JavaScript representation of the CSS theme variables.
 * This is primarily consumed by the tailwind.config.js file.
 */
export declare const themeConfig: {
    colors: {
        slate: {
            50: string;
            100: string;
            200: string;
            600: string;
            900: string;
        };
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
        violet: {
            50: string;
            100: string;
        };
        amber: {
            50: string;
            100: string;
        };
        sky: {
            50: string;
            100: string;
        };
        border: string;
        input: string;
        ring: string;
        background: string;
        foreground: string;
        primary: {
            DEFAULT: string;
            foreground: string;
        };
        secondary: {
            DEFAULT: string;
            foreground: string;
        };
        destructive: {
            DEFAULT: string;
            foreground: string;
        };
        muted: {
            DEFAULT: string;
            foreground: string;
        };
        accent: {
            DEFAULT: string;
            foreground: string;
        };
        popover: {
            DEFAULT: string;
            foreground: string;
        };
        card: {
            DEFAULT: string;
            foreground: string;
        };
    };
    borderRadius: {
        lg: string;
        md: string;
        sm: string;
    };
};
/**
 * THE BUILD FIX IS HERE!
 * This is the corrected, type-safe helper function that will resolve your build error.
 * Get a color value from the theme programmatically.
 * @param path - Path to the color in the theme config (e.g., 'primary.500')
 * @returns CSS variable or direct color value, or an empty string if not found.
 */
export declare function getThemeColor(path: string): string;
//# sourceMappingURL=theme.d.ts.map