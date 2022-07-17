import { HISTORY_SEQUENCE_SESSION_STORAGE_KEY } from './constants';
import { canUseDOM, dispatchCustomEvent, syncLocalHistorySequence } from './miscUtil';

function navigate(internalPath: string, replace = false) {
  if (
    !canUseDOM ||
    (window.history &&
      window.history.state &&
      internalPath === window.history.state.pathname)
  ) {
    return;
  }

  if (!replace) {
    syncLocalHistorySequence();

    window.localHistorySequence = {
      previous: window.localHistorySequence.current,
      current: window.localHistorySequence.current + 1,
    };

    if (window.sessionStorage) {
      window.sessionStorage.setItem(
        HISTORY_SEQUENCE_SESSION_STORAGE_KEY,
        JSON.stringify(window.localHistorySequence),
      );
    }
  }

  const eventData = {
    pathname: internalPath,
    replace,
    localHistorySequence: window.localHistorySequence,
  };

  if (replace) {
    window.history.replaceState(eventData, '', internalPath);
  } else {
    window.history.pushState(eventData, '', internalPath);
  }

  dispatchCustomEvent('popstate', eventData);
}

export default navigate;
