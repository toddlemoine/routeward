import { toPath, trimSlashes, joinWithCase, invariant } from './utils';
import {
    Routeset,
    Route,
    Scope,
    ScopeConfig,
    Resources,
    Options,
} from './types';
import { route } from './route';
import { resources } from './resources';
import { build } from './build';

const isScopeConfig = function isScopeConfig(configObj: object): boolean {
    const propNames = Object.getOwnPropertyNames(configObj);
    return propNames.length === 1 && propNames[0] === 'as';
};

const addRouteToScope = (scope: Scope, route: Route) => {
    scope.routes = scope.routes.concat(route);
    return scope;
};

const addResourcesToScope = (scope: Scope, resources: Resources) => {
    scope.resources = scope.resources.concat(resources);
    return scope;
};

const addRoutesetToScope = (
    parentScope: Scope,
    routesetToAdd: Routeset,
    options: Options,
) => {
    // Scopes return a set of helper functions, so we need to merge those,
    // but rename them as dictated by the parent scope config.
    const renamedRouteset = Object.entries(routesetToAdd).reduce(
        (acc, [helperName, helperFunc]) => {
            const newName = joinWithCase(
                [parentScope.as, helperName],
                options.case,
            );
            acc[newName] = (...args) =>
                toPath(parentScope.base, helperFunc(...args));
            return acc;
        },
        {} as Routeset,
    );

    parentScope.routesets.push(renamedRouteset);

    return parentScope;
};

const scope = function (
    base: string,
    ...args: Array<ScopeConfig | Route | Resources | Routeset>
): Routeset {
    invariant(base, 'Scope base name required.');

    let argsToProcess = args;
    const [firstArg, ...rest] = argsToProcess;
    let as = trimSlashes(base);

    if (isScopeConfig(firstArg)) {
        as = (firstArg as ScopeConfig).as;
        argsToProcess = rest;
    }

    const _scope = argsToProcess.reduce(
        (acc, curr) => {
            switch (curr.type) {
                case 'route':
                    return addRouteToScope(acc, curr);
                case 'resources':
                    return addResourcesToScope(acc, curr);
                default:
                    return addRoutesetToScope(acc, curr as Routeset, this);
            }
        },
        {
            type: 'scope',
            routes: [],
            resources: [],
            routesets: [],
            as,
            base,
        } as Scope,
    );
    return build(_scope as Scope, this);
};

export { scope, route, resources };
