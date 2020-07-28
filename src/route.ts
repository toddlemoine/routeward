import { Route } from './types';

const route = function route(path: string): Route {
    return {
        type: 'route',
        path,
    };
};

export { route };
