# Welcome to React Router Web

Ultrafast 2.6kB (Min + Zip) customizable / SSR-friendly react-router written from scratch in typescript with react hooks.

If using yarn:

`yarn add react-router-web`

If using npm:

`npm install react-router-web`

- Reference code:

In index.ts / index.js of your React app, wrap your `<App/>` inside `<RouteContextProvider></RouteContextProvider>`:

```javascript
import { RouteContextProvider } from 'react-router-web';

<React.StrictMode>
  <RouteContextProvider>
    <App />
  </RouteContextProvider>
</React.StrictMode>;
```

Then, create a routes.ts / routes.js file to add routes as below:

```javascript
const routes = [
  {
    match: '/home',
    exact: true,
    preferTrailingSlash: false,
    component: HomePage,
  },
  {
    match: '/about',
    exact: true,
    preferTrailingSlash: false,
    component: AboutPage,
  },
  {
    match: '/sample',
    exact: true,
    preferTrailingSlash: false,
    component: SamplePage,
  },
];
```

Then, inside App.ts / App.js

```javascript
import { initRoutes, Link, RouteContext, Router } from 'react-router-web';
import { useContext } from 'react';
import { routes } from './routes';

function App() {
  const { location } = useContext(RouteContext);

  initRoutes(routes);

  return (
    <div className="app">
      <div>
        <h2>Currently selected route: {location}</h2>
        <ul>
          <li>
            <Link href="/home">Home Page</Link>
          </li>
          <li>
            <Link href="/dashboard">Dashboard Page</Link>
          </li>
          <li>
            <Link href="/about">About Page</Link>
          </li>
        </ul>
      </div>
      <div>
        <h2>Pages</h2>
        <Router />
      </div>
    </div>
  );
}

export default App;
```

## Editor Configuration

- Editor of your preference. I used some VSCode specific config in .vscode folder and recommend plugins for enhanced experience.

Recommended VSCode Extensions:

- Prettier (Official) - Code formatter
- ESLint (Official) - Real time JS syntax validation

## Technologies Used

- React 18
- Typescript
- Rollup.js
- Yarn
- Prettier + ESlint
- Jest
- Generated using boilerplate [https://github.com/n10l/react-lib-boilerplate](https://github.com/n10l/react-lib-boilerplate)

## Available Scripts

In the project directory, you can run:

### `yarn build`

To build the project

### `yarn fix:all`

Runs prettier formatter followed by eslint, to format code and fix lint issues.
