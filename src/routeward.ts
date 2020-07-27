import { scope } from './scope';
import { route } from './route';
import { resources } from './resources';

type Case = 'snake' | 'camel' | 'kebab' | 'title';

type Options = {
    suffix?: string;
    case?: Case;
};

const defaultOptions: Options = {
    suffix: 'path',
    case: 'snake',
};

const routeward = (options: Options = {}) => {
    const config = { ...defaultOptions, ...options };
    return {
        scope: scope.bind(config),
        route,
        resources,
    };
};

export { routeward };
