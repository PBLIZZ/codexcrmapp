// apps/web/src/google.d.ts
import 'google-one-tap'; // Ensures types from @types/google-one-tap are loaded

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfiguration) => void;
          prompt: (callback?: (notification: GooglePromptNotification) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
          renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void;
          revoke: (hint: string, callback: (done: GoogleRevokeResponse) => void) => void;
        };
      };
    };
  }
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  nonce?: string;
  context?: string;
  state_cookie_domain?: string;
  ux_mode?: string;
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: () => void;
  itp_support?: boolean;
  use_fedcm_for_prompt?: boolean;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GooglePromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  getDismissedReason: () => string;
}

interface GoogleButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  locale?: string;
  click_listener?: () => void;
}

interface GoogleRevokeResponse {
  successful: boolean;
  error?: string;
}

export {};
