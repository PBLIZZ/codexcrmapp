'use client';

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Returns true when the window width is below the mobile breakpoint (768px by default).
 * The first render returns `false` until the effect runs on the client to avoid
 * hydration mismatches.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleChange = () => {
      setIsMobile(mql.matches);
    };

    handleChange(); // set initial value
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}
