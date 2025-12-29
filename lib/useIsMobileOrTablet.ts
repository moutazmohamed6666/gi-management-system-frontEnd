"use client";

import { useEffect, useState } from "react";

const TABLET_BREAKPOINT = 1024;

export function useIsMobileOrTablet() {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(
    typeof window !== "undefined" ? window.innerWidth < TABLET_BREAKPOINT : false
  );

  useEffect(() => {
    const query = `(max-width: ${TABLET_BREAKPOINT - 1}px)`;
    const mediaQueryList = window.matchMedia(query);
    const handleChange = () => {
      setIsMobileOrTablet(window.innerWidth < TABLET_BREAKPOINT);
    };

    mediaQueryList.addEventListener("change", handleChange);
    handleChange();

    return () => {
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, []);

  return isMobileOrTablet;
}

export { TABLET_BREAKPOINT };

