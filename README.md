# Welcome to React Router Web

- Generated using boilerplate [https://github.com/n10l/react-lib-boilerplate](https://github.com/n10l/react-lib-boilerplate)

Ultrafast 2.5kB (Min + Zip) react-router written from scratch in typescript.

If using yarn:

`yarn add react-router-web`

If using npm:

`npm install react-router-web`

To use in code:

- Advanced working example in /playground folder

- Reference code:

Declare `import { Router, init, Link } from 'react-router-web'`

Then in code:

In parent component of router:

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

init(routes);
```

Then to display router:

```javascript
<div>
   <h2>Menu</h2>
   <ul>
      <li>
      <Link href="/home">Home Page</Link>
      </li>
      <li>
      <Link href="/about">About Page</Link>
      </li>
      <li>
      <Link href="/sample">Sample Page</Link>
      </li>
   </ul>
</div>

<div>
   <h2>Pages</h2>
   <Router />
</div>
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

## Steps to use this project

1. Update your library/component's **name**, **license**, **publishConfig** and **repository** fields in package.json as per your need.

2. If external styles are used, replace `output: 'sample.css'` with your project's expected output bundled css file name.
   People can import styles into their project as `import "sample/dist/sample.css"`;

3. If .env file is used, make sure you updated your library/component name. Optionally, you can remove it.

4. `yarn dev` for local development and `yarn build` to prepare dist folder for publishing.

5. `yarn test-all` to run component and its playground app tests.

6. Before publishing with npm make sure you are publishing to correct registry, public/private depending on project's need.\
   Change **private:true** to **private:false** in package.json to publish package to public registry.

## Available Scripts

In the project directory, you can run:

### `yarn build`

To build the project

### `yarn fix:all`

Runs prettier formatter followed by eslint and stylelint, to format code and fix lint issues.
Prettier is not good enough to run alone, must always be followed lint fixes included in this command.

## Playground app

Based on minimal boilerplate [https://github.com/n10l/react-lib-boilerplate](https://github.com/n10l/react-lib-boilerplate) created in `playground/` folder. A sample usage of this component is demonstrated in playground app and can be very helpful while development of the component.
