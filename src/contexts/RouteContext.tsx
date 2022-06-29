import React from 'react';

type RouteContext = {
  actualHost: any;
  location: any;
  status: any;
  setStatus: any;
  setLocation?: any;
  routeProps?: any;
  setRouteProps?: any;
};

const ROUTE_CONTEXT_DEFAULT_VALUE: RouteContext = {
  actualHost: null,
  location: null,
  status: null,
  setStatus: null,
  setLocation: null,
  routeProps: {},
  setRouteProps: null,
};

const RouteContext = React.createContext<RouteContext>(ROUTE_CONTEXT_DEFAULT_VALUE);

export { RouteContext, ROUTE_CONTEXT_DEFAULT_VALUE };
