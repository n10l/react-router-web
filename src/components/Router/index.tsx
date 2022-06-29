import React, { useContext, useEffect, useMemo, useState } from 'react';

import { RouteContext, ROUTE_CONTEXT_DEFAULT_VALUE } from '../../contexts/RouteContext';
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

function initRoutes(routes: Route[]) {
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
    if (newRouteMatch.routeProps) {
      newRouteMatch.routeProps.queryParams = queryParams;
    } else {
      newRouteMatch.routeProps = { queryParams };
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
      const routeProps: any = routeMapping[i].routeProps || {};
      const regexMatches = currentPath.match(routeMapping[i].regex as RegExp);
      const routeMatchGroups = routeMapping[i].matchGroups as any[];
      for (let j = 0; j < routeMatchGroups.length; j += 1) {
        if (regexMatches?.length && regexMatches[j + 1]) {
          routeProps[routeMatchGroups[j]] = regexMatches[j + 1];
        }
      }

      return attachQueryParamProps({ ...routeMapping[i], routeProps }, queryParams);
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
): { component: ReactComponent | React.ReactElement; routeProps: any } {
  let matchedComponent: React.ReactElement | null = null;
  let routeProps: any = null;
  if (currentPath) {
    const routeMatch = getRouteMatch(currentPath, NotFoundPage, notFoundPagePrefetch);
    if (routeMatch) {
      if (routeMatch.routeProps) {
        matchedComponent = React.createElement(
          routeMatch.component,
          routeMatch.routeProps,
        );
        routeProps = routeMatch.routeProps;
      }
      if (routeMatch.component) {
        matchedComponent = React.createElement(routeMatch.component);
      }
    }
  }

  return {
    component: matchedComponent || <NotFoundPage />,
    routeProps,
  };
}

function Router({
  NotFoundPage = function () {
    return <div>Page Not Found</div>;
  },
  notFoundPagePrefetch,
}: RouterProps) {
  const { location, setLocation, setRouteProps, ...otherProps } =
    useContext(RouteContext);

  const [currentPath, setCurrentPath] = useState(
    canUseDOM ? window.location?.pathname : location || null,
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
    } else if (window.location?.pathname) {
      setCurrentPath(window.location.pathname || '/');
      if (canUseDOM) {
        window.scrollTo(0, 0);
      }
    }
  };

  const pageMatchMemo = useMemo(
    () => getPage(currentPath, NotFoundPage, notFoundPagePrefetch),
    [currentPath],
  );

  const locationMemo = useMemo(
    () => ({
      location: currentPath,
      ...otherProps,
      routeProps: pageMatchMemo.routeProps || {},
    }),
    [currentPath],
  );

  useEffect(() => {
    if (setLocation) {
      setLocation(currentPath);
    }

    if (setRouteProps) {
      setRouteProps(pageMatchMemo.routeProps || {});
    }
  }, [currentPath]);

  useEffect(() => {
    window.removeEventListener('popstate', historyChangeHandler, true);
    window.addEventListener('popstate', historyChangeHandler, true);

    return function cleanup() {
      window.removeEventListener('popstate', historyChangeHandler, true);
    };
  }, []);

  return (
    <RouteContext.Provider value={locationMemo}>
      <>{pageMatchMemo.component}</>
    </RouteContext.Provider>
  );
}

function RouteContextProvider({ children }: { children: React.ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState(ROUTE_CONTEXT_DEFAULT_VALUE.location);
  const [routeProps, setRouteProps] = useState(ROUTE_CONTEXT_DEFAULT_VALUE.routeProps);

  return (
    <RouteContext.Provider
      value={{
        ...ROUTE_CONTEXT_DEFAULT_VALUE,
        location: currentRoute,
        setLocation: setCurrentRoute,
        routeProps,
        setRouteProps,
      }}>
      {children}
    </RouteContext.Provider>
  );
}

export {
  Router,
  initRoutes,
  getRouteMatch,
  RouteContext,
  RouteContextProvider,
  HISTORY_ACTION,
};
