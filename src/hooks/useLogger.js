import { useCallback } from 'react';

export const useLogger = (attemptId) => {
  const logEvent = useCallback((type, metadata = {}) => {
    const event = {
      id: crypto.randomUUID(),
      eventType: type,
      timestamp: new Date().toISOString(),
      attemptId,
      metadata: {
        ...metadata,
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    };

    // 1. Persist locally (JSON only)
    const logs = JSON.parse(localStorage.getItem(`logs_${attemptId}`) || '[]');
    localStorage.setItem(`logs_${attemptId}`, JSON.stringify([...logs, event]));

    // 2. Mock Backend Sync (Batching)
    console.log("Logged Security Event:", event);
  }, [attemptId]);

  return { logEvent };
};
