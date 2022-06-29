export type ReactComponent = React.FC | React.ComponentClass;

export type RouteMap = {
  regex?: RegExp;
  matchGroups?: any[];
  routeProps?: any;
  preferTrailingSlash?: boolean;
  component: ReactComponent;
  prefetch?: any;
};

export type Route = {
  match: string;
  exact: boolean;
  component: React.FC;
};

export type RouterProps = {
  NotFoundPage?: ReactComponent;
  notFoundPagePrefetch?: string[];
};
