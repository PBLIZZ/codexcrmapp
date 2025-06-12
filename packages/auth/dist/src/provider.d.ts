import { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
type AuthContextType = {
    user: User | null;
    isLoading: boolean;
};
export declare const AuthContext: import("react").Context<AuthContextType | null>;
/**
 * AuthProvider component that wraps the application to provide authentication state.
 * It handles fetching the initial user session and listens for auth state changes.
 */
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Custom hook `useAuth` to easily access the auth context from any client component.
 * It uses the new React 19 `use` hook for cleaner context consumption.
 */
export declare function useAuth(): any;
export {};
//# sourceMappingURL=provider.d.ts.map