import {
    invariant,
    toPath,
    trimSlashes,
    startsWith,
    joinWithCase,
    includes,
} from './utils';
import {
    Scope,
    Route,
    Routeset,
    Options,
    HelperFunction,
    Resources,
} from './project.types';

const pathToHelperName = (path: string, options: Options = {}): string => {
    const parts = trimSlashes(path)
        .split('/')
        .filter(route => !startsWith(route, ':'));

    return joinWithCase(
        [options.prefix, ...parts, options.suffix].filter(Boolean),
        options.case,
    );
};

const paramToString = (param: string): string => {
    return param.replace(':', '');
};

const extractParameters = (path: string): string[] => {
    return path
        .split('/')
        .filter(part => startsWith(part, ':'))
        .map(paramToString);
};

const createParameterHelperFunction = (
    path: string,
    params: string[],
): HelperFunction => {
    return (obj?: any): string => {
        return params.reduce(
            (acc, param) => acc.replace(`:${param}`, obj[param]),
            path,
        );
    };
};

const createHelperFunction = (base: string, path: string): HelperFunction => {
    const params = extractParameters(path);
    if (params.length) {
        return createParameterHelperFunction(toPath(base, path), params);
    }
    return () => toPath(base, path);
};

const createResourceHelperFunction = (base: string, res: Resources) => {
    return (route?: string, obj?: any) => {
        const _route = route ?? 'index';

        invariant(
            includes(res.allowedRoutes, _route),
            `${route} not allowed for resource ${
                res.name
            }. Allowed routes are ${res.allowedRoutes.join(', ')}`,
        );

        switch (_route) {
            case 'index':
                return toPath(base, res.name);
            case 'show':
                return toPath(base, res.name, obj.id);
            default:
                return toPath(base, res.name, obj.id, _route);
        }
    };
};

const build = (scope: Scope, options: Options): Routeset => {
    const opts = {
        prefix: scope.as,
        suffix: options.suffix,
        case: options.case,
    };
    // Routes are easy, so build first.
    const routes = scope.routes.reduce((acc, route: Route) => {
        const routeHelperName = pathToHelperName(route.path, opts);
        acc[routeHelperName] = createHelperFunction(scope.base, route.path);
        return acc;
    }, {} as Routeset);

    // Now resources, where we have a single helper function that
    // returns different kinds of routes.
    const resources = scope.resources.reduce((acc, res: Resources) => {
        const routeHelperName = pathToHelperName(res.name, opts);
        acc[routeHelperName] = createResourceHelperFunction(scope.base, res);
        return acc;
    }, {} as Routeset);

    const routesets = scope.routesets.reduce((acc, rs: Routeset) => {
        return { ...acc, ...rs };
    }, {} as Routeset);

    return { ...routes, ...resources, ...routesets };
};

export { build };
