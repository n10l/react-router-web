import React from 'react';

type RouteContext = {
  actualHost: any;
  location: any;
  status: any;
  setStatus: any;
  setLocation?: any;
};

const ROUTE_CONTEXT_DEFAULT_VALUE: RouteContext = {
  actualHost: null,
  location: null,
  status: null,
  setStatus: null,
  setLocation: null,
};

const RouteContext = React.createContext<RouteContext>(ROUTE_CONTEXT_DEFAULT_VALUE);

export { RouteContext, ROUTE_CONTEXT_DEFAULT_VALUE };
