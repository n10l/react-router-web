import { HISTORY_SEQUENCE_SESSION_STORAGE_KEY } from './constants';

export const dispatchCustomEvent = (eventName: string, eventData: any, type?: string) => {
  if (!canUseDOM) {
    return;
  }
  let customEvent;
  if (type === 'custom') {
    customEvent = new CustomEvent(eventName, eventData);
  } else if (typeof Event === 'function') {
    customEvent = new Event(eventName, eventData);
  } else {
    // Correctly fire popstate event on IE11 to prevent app crash.
    customEvent = document.createEvent('Event');
    customEvent.initEvent(eventName, true, true); // Not passing event data due to deprecation, may not work
  }
  window.dispatchEvent(customEvent);
};

export const syncLocalHistorySequence = () => {
  if (canUseDOM && !window.localHistorySequence) {
    window.localHistorySequence = { previous: 0, current: 0 };
    if (window.sessionStorage) {
      let sessionHistorySequence = window.sessionStorage.getItem(
        HISTORY_SEQUENCE_SESSION_STORAGE_KEY,
      );
      try {
        if (sessionHistorySequence) {
          sessionHistorySequence = JSON.parse(sessionHistorySequence);
        }
        if (
          sessionHistorySequence &&
          Object.prototype.hasOwnProperty.call(sessionHistorySequence, 'current')
        ) {
          window.localHistorySequence = sessionHistorySequence;
        }
      } catch {
        // Do nothing
      }
    }
  }
};

export const canUseDOM =
  typeof window !== 'undefined' && window.document && window.document.createElement;

export const formatRoute = (route: string, preferTrailingSlash: boolean) => {
  if (route !== '/' && route?.endsWith('/') && !preferTrailingSlash) {
    return route.slice(0, -1);
  } else if (!route?.endsWith('/') && preferTrailingSlash) {
    return `${route}/`;
  }

  return route;
};
