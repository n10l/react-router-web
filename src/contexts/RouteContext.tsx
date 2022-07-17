import React from 'react';

type RouteContextProps = {
  actualHost: any;
  location: any;
  status: any;
  setStatus: any;
  setLocation?: any;
  routeProps?: any;
  setRouteProps?: any;
};

const ROUTE_CONTEXT_DEFAULT_VALUE: RouteContextProps = {
  actualHost: null,
  location: null,
  status: null,
  setStatus: null,
  setLocation: null,
  routeProps: {},
  setRouteProps: null,
};

const RouteContext = React.createContext<RouteContextProps>(ROUTE_CONTEXT_DEFAULT_VALUE);

export { RouteContext, ROUTE_CONTEXT_DEFAULT_VALUE };
