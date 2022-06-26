export type ReactComponent = React.FC | React.ComponentClass;

export type RouteMap = {
  regex?: RegExp;
  matchGroups?: any[];
  propsObject?: any;
  component: ReactComponent;
  prefetch?: any;
};

export type Route = {
  match: string;
  exact: boolean;
  preferTrailingSlash: boolean;
  component: React.FC;
};

export type RouterProps = {
  setCurrentRoute: (route: string) => void;
  NotFoundPage: ReactComponent;
  notFoundPagePrefetch: string[];
};
