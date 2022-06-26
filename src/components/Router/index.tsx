import React, { useContext, useEffect, useMemo, useState } from 'react';

import { RouteContext } from '../../contexts/RouteContext';
import {
  HISTORY_ACTION,
  HISTORY_SEQUENCE_SESSION_STORAGE_KEY,
} from '../../shared/constants';
import {
  canUseDOM,
  dispatchCustomEvent,
  syncLocalHistorySequence,
} from '../../shared/miscUtil';
import { buildRouteMapping } from '../../shared/routeHelper';
import { ReactComponent, Route, RouteMap, RouterProps } from './index.types';

let routeMapping: RouteMap[] = [];

function init(routes: Route[]) {
  if (routes) {
    routeMapping = buildRouteMapping(routes);
  } else {
    routeMapping = [];
  }

  syncLocalHistorySequence();
}

function attachQueryParamProps(routeMatch: RouteMap, queryParams: any) {
  const newRouteMatch = routeMatch;
  if (queryParams && Object.keys(queryParams).length) {
    // Available in child components as queryParams prop
    if (newRouteMatch.propsObject) {
      newRouteMatch.propsObject.queryParams = queryParams;
    } else {
      newRouteMatch.propsObject = { queryParams };
    }
  }

  return newRouteMatch;
}

function getRouteMatch(
  currentOriginalPath: string,
  NotFoundPage: ReactComponent,
  notFoundPagePrefetch: any,
) {
  let currentPath: string | undefined = currentOriginalPath;
  const queryParams: any = {};
  if (currentOriginalPath.includes('?')) {
    const pathParts = currentOriginalPath.split('?');
    currentPath = pathParts.shift();
    pathParts
      .shift()
      ?.split('&')
      .forEach(keyValue => {
        const keyValueParts = keyValue.split('=');
        queryParams[keyValueParts[0]] = keyValueParts[1] || null;
      });
  }

  for (let i = 0; i < routeMapping.length; i += 1) {
    if (currentPath && routeMapping[i]?.regex?.test(currentPath)) {
      if (!routeMapping[i].matchGroups || !routeMapping[i].matchGroups?.length) {
        return attachQueryParamProps(routeMapping[i], queryParams);
      }
      const propsObject: any = routeMapping[i].propsObject || {};
      const regexMatches = currentPath.match(routeMapping[i].regex as RegExp);
      const routeMatchGroups = routeMapping[i].matchGroups as any[];
      for (let j = 0; j < routeMatchGroups.length; j += 1) {
        if (regexMatches?.length && regexMatches[j + 1]) {
          propsObject[routeMatchGroups[j]] = regexMatches[j + 1];
        }
      }

      return attachQueryParamProps({ ...routeMapping[i], propsObject }, queryParams);
    }
    if (!routeMapping[i].regex) {
      return attachQueryParamProps(routeMapping[i], queryParams);
    }
  }

  return attachQueryParamProps(
    {
      component: NotFoundPage,
      prefetch: notFoundPagePrefetch || [],
    },
    queryParams,
  );
}

function getPage(
  currentPath: string | null,
  NotFoundPage: ReactComponent,
  notFoundPagePrefetch: any,
) {
  if (currentPath) {
    const routeMatch = getRouteMatch(currentPath, NotFoundPage, notFoundPagePrefetch);
    if (routeMatch) {
      if (routeMatch.propsObject) {
        return React.createElement(routeMatch.component, routeMatch.propsObject);
      }
      if (routeMatch.component) {
        return React.createElement(routeMatch.component);
      }
    }
  }
  if (NotFoundPage) {
    return <NotFoundPage />;
  }

  return <div>Page Not Found</div>;
}

function Router({ setCurrentRoute, NotFoundPage, notFoundPagePrefetch }: RouterProps) {
  const { location, ...otherProps } = useContext(RouteContext);

  const [currentPath, setCurrentPath] = useState(
    (canUseDOM && window.location && window.location.pathname) || location || null,
  );

  const historyChangeHandler = (event: PopStateEvent) => {
    let historyAction;
    const fromSequence = window.localHistorySequence;
    const toSequence = window?.history?.state?.localHistorySequence;

    if (!toSequence || (fromSequence && fromSequence.previous === toSequence.current)) {
      historyAction = HISTORY_ACTION.BACK;
    }
    if (toSequence && fromSequence && fromSequence.current === toSequence.previous) {
      historyAction = HISTORY_ACTION.FORWARD;
    }
    window.localHistorySequence = toSequence;
    if (window.sessionStorage) {
      window.sessionStorage.setItem(
        HISTORY_SEQUENCE_SESSION_STORAGE_KEY,
        JSON.stringify(window.localHistorySequence),
      );
    }
    if (!historyAction) {
      historyAction = window?.history?.state?.replace
        ? HISTORY_ACTION.REPLACE
        : HISTORY_ACTION.PUSH;
    }

    dispatchCustomEvent('historyAction', { detail: historyAction }, 'custom');

    if (event.state && event.state.pathname) {
      const statePath = event.state.pathname;
      setCurrentPath(statePath.startsWith('/') ? statePath : `/${statePath}`);
    } else if (window.location && window.location.pathname) {
      setCurrentPath(window.location.pathname || '/');
      if (canUseDOM) {
        window.scrollTo(0, 0);
      }
    }
  };

  useEffect(() => {
    if (setCurrentRoute) {
      setCurrentRoute(currentPath);
    }
  }, [currentPath]);

  useEffect(() => {
    window.removeEventListener('popstate', historyChangeHandler, true);
    window.addEventListener('popstate', historyChangeHandler, true);

    return function cleanup() {
      window.removeEventListener('popstate', historyChangeHandler, true);
    };
  }, []);

  const locationMemo = useMemo(
    () => ({ location: currentPath, ...otherProps }),
    [currentPath],
  );

  return (
    <RouteContext.Provider value={locationMemo}>
      {getPage(currentPath, NotFoundPage, notFoundPagePrefetch)}
    </RouteContext.Provider>
  );
}

export { Router, init, getRouteMatch, RouteContext, HISTORY_ACTION };
