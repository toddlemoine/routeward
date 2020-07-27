import { Route } from './project.types';

const route = function route(path: string): Route {
    return {
        type: 'route',
        path,
    };
};

export { route };
