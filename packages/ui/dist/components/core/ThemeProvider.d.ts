import { type ReactNode } from 'react';
type ThemeProviderProps = {
    children: ReactNode;
    defaultTheme?: 'light' | 'dark' | 'system';
};
type ThemeContextType = {
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    isDarkMode: boolean;
};
export declare function ThemeProvider({ children, defaultTheme, }: ThemeProviderProps): import("react/jsx-runtime").JSX.Element;
export declare const useTheme: () => ThemeContextType;
export declare function ThemeToggle(): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ThemeProvider.d.ts.map