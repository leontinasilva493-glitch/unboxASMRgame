"use client";

import { useEffect } from "react";

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}

export function AnalyticsEvents() {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>("[data-event]");
      if (!element) return;
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: element.dataset.event });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  return null;
}
