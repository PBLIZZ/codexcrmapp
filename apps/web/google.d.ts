// apps/web/src/google.d.ts
import 'google-one-tap'; // Ensures types from @types/google-one-tap are loaded

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: google.accounts.id.IdConfiguration) => void;
          prompt: (
            momentNotification?: (
              notification: google.accounts.id.PromptMomentNotification
            ) => void
          ) => void;
          renderButton: (
            parent: HTMLElement,
            options: google.accounts.id.GsiButtonConfiguration,
            clickListener?: (
              response: google.accounts.id.CredentialResponse
            ) => void
          ) => void;
          disableAutoSelect: () => void;
          storeCredential: (
            credential: google.accounts.id.CredentialResponse,
            callback?: () => void
          ) => void;
          cancel: () => void;
          revoke: (id: string, callback?: () => void) => void;
        };
        oauth2?: unknown; // Placeholder for OAuth2 specific parts if needed in the future
      };
    };
  }
}

export {}; // This ensures the file is treated as a module.
