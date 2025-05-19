// Client-only effect to set meta theme-color based on localStorage and system preference
'use client';
import { useEffect } from 'react';

export function ThemeColorMetaEffect() {
  useEffect(() => {
    try {
      if (
        localStorage.theme === 'dark' ||
        ((!('theme' in localStorage) || localStorage.theme === 'system') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', '#09090b');
      } else {
        document
          .querySelector('meta[name="theme-color"]')
          ?.setAttribute('content', '#ffffff');
      }
    } catch (_) {}
  }, []);
  return null;
}
