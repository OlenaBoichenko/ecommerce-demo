'use client';

import { useEffect } from 'react';

export function DisableLogs() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Save original console methods
      const originalLog = console.log;
      const originalInfo = console.info;
      const originalWarn = console.warn;

      // Override console.log to filter Fast Refresh messages
      console.log = (...args: any[]) => {
        const message = args.join(' ');
        if (
          message.includes('[Fast Refresh]') ||
          message.includes('HMR') ||
          message.includes('hot-reloader') ||
          message.includes('webpack')
        ) {
          return; // Skip these logs
        }
        originalLog.apply(console, args);
      };

      // Override console.info
      console.info = (...args: any[]) => {
        const message = args.join(' ');
        if (
          message.includes('[Fast Refresh]') ||
          message.includes('HMR') ||
          message.includes('hot-reloader')
        ) {
          return;
        }
        originalInfo.apply(console, args);
      };

      // Override console.warn
      console.warn = (...args: any[]) => {
        const message = args.join(' ');
        if (
          message.includes('[Fast Refresh]') ||
          message.includes('HMR')
        ) {
          return;
        }
        originalWarn.apply(console, args);
      };
    }
  }, []);

  return null;
}
