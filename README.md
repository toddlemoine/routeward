# routeward

Routeward is inspired by the Phoenix framework's own helper methods for
generating routes already specified in the app. Use this to create a set of
functions named the same as your routes that you can call anywhere in your
app to get the string path or route. This way, you can limit the number of
places in your app that have hard-coded routes.

## Usage

```js
import { createRouteHelpers } from 'routeward';

const routes = [
  '/fruit',
  '/fruit/apples',
  '/fruit/apples/:id'
  '/fruit/apples/:id/ratings/:rating'
];

const helpers = createRouteHelpers(routes);

helpers.fruit_path(); // '/fruit'
helpers.fruit_apples_path(); // '/fruit/apples'
helpers.fruit_apples_path({id: 123}); // '/fruit/apples/123'
helpers.fruit_apples_ratings_path({ id: 123, rating: 'good'}); // '/fruit/apples/123/ratings/good
```

## Installation

```
npm install routeward
```

```
yarn add routeward
```

## Usage

```js
// route_helpers.js
import { createRouteHelpers } from 'routeward';

const routes = [
  '/fruit',
  '/fruit/apples',
  '/fruit/apples/:id'
  '/fruit/apples/:id/ratings/:ratingid'
];

export default createRouteHelpers(routes);
```
