import { Route, RouteOptions } from './types';

const route = function route(
    path: string,
    { as }: RouteOptions = { as: '' },
): Route {
    return {
        type: 'route',
        path,
        as,
    };
};

export { route };
