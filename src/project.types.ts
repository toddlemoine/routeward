export type HelperFunction = (obj?: any) => string;

export type Routeset = {
    [key: string]: HelperFunction;
};

export type Route = {
    type: 'route';
    path: string;
};

export type Scope = {
    base: string;
    type: 'scope';
    as: string;
    routes: (Route | Scope)[];
    resources: Resources[];
    routesets: Routeset[];
};

export type ScopeConfig = {
    type?: 'scopeconfig';
    as: string;
};

export type Resources = {
    type: 'resources';
    name: string;
    allowedRoutes: string[];
};

export type ResourceRestriction = {
    only?: string[];
    except?: string[];
};

export type Case = 'snake' | 'camel' | 'kebab' | 'title';

export type Options = {
    prefix?: string;
    suffix?: string;
    case?: Case;
};
