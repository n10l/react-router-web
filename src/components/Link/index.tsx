import { useRef } from 'react';
import { HISTORY_SEQUENCE_SESSION_STORAGE_KEY } from '../../shared/constants';
import {
  canUseDOM,
  dispatchCustomEvent,
  syncLocalHistorySequence,
} from '../../shared/miscUtil';
import './index.css';
import { LinkProps } from './index.types';

function navigate(internalPath: string, replace: boolean) {
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

function Link({
  inline = true,
  target,
  href,
  children,
  className,
  onClick,
  replace = false,
}: LinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  function handleClick(event: React.MouseEvent) {
    if (!canUseDOM || target === '_blank') {
      return;
    }
    if (linkRef?.current?.contains(event.target as Node)) {
      const linkEl = document.createElement('a');
      linkEl.href = linkRef.current.href;

      if (window.location.hostname === linkEl.hostname) {
        event.persist();
        event.preventDefault();
        navigate(linkEl.pathname, replace);
      }
    }
    if (onClick) {
      onClick(event);
    }
  }

  return (
    <a
      className={`route-link ${!inline ? 'route-link--block' : ''} ${className}`}
      href={href}
      ref={linkRef}
      target={target}
      onClick={handleClick}>
      {children}
    </a>
  );
}

export { Link, navigate };
