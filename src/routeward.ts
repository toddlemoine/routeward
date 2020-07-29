import { scope } from './scope';
import { route } from './route';
import { resources } from './resources';

type Case = 'snake' | 'camel' | 'kebab' | 'title';

type Options = {
    suffix?: string;
    case?: Case;
    numericPathPrefix?: string;
};

const defaultOptions: Options = {
    suffix: 'path',
    case: 'snake',
    numericPathPrefix: 'go',
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
