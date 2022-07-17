import { useContext, useRef } from 'react';
import { canUseDOM } from '../../shared/miscUtil';
import navigate from '../../shared/navigate';
import { RouteContext } from '../Router';
import './index.css';
import { LinkProps } from './index.types';

function Link({
  inline = true,
  target,
  href,
  children,
  className,
  activeClassName = 'active',
  onClick,
  replace = false,
}: LinkProps) {
  const { location } = useContext(RouteContext);
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
      className={`route-link${!inline ? ' route-link--block ' : ''}${
        href && activeClassName && location?.trim() === href?.trim()
          ? ` ${activeClassName} `
          : ''
      } ${className ?? ''}`.trim()}
      href={href}
      ref={linkRef}
      target={target}
      onClick={handleClick}>
      {children}
    </a>
  );
}

export default Link;
