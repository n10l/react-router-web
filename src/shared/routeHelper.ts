export const buildRouteMapping = (routeMapping: any[]) => {
  let matchString;
  for (let i = 0; i < routeMapping.length; i += 1) {
    matchString = routeMapping[i].match;
    if (matchString) {
      if (matchString.includes(':')) {
        const matchGroups = [];
        const pathParts = matchString.split('/');
        for (let j = 0; j < pathParts.length; j += 1) {
          if (pathParts[j].startsWith(':')) {
            matchGroups.push(pathParts[j].substring(1));
            pathParts[j] = '([^\\s/]+)';
          }
        }
        // eslint-disable-next-line no-param-reassign
        routeMapping[i].matchGroups = matchGroups;
        matchString = pathParts.join('/');
      }
      matchString = `^${matchString}${routeMapping[i].exact ? '$' : ''}`;
      // eslint-disable-next-line no-param-reassign
      routeMapping[i].matchString = matchString.replace(/\//g, '\\/');
      // eslint-disable-next-line no-param-reassign
      routeMapping[i].regex = new RegExp(matchString, 'i');
    }
  }

  return routeMapping;
};
