import { includes, isArray } from './utils';
import { Resources, ResourceRestriction } from './types';

const requiredResourcePaths: string[] = ['index', 'show'];
const defaultResourcePaths: string[] = requiredResourcePaths.concat([
    'edit',
    'delete',
]);

const resources = function resources(
    name: string,
    restrictionsOrCustomPaths?: ResourceRestriction | string[],
    restrictions?: ResourceRestriction,
): Resources {
    let customPaths: string[];
    let resourceRestrictions: ResourceRestriction;

    if (isArray(restrictionsOrCustomPaths)) {
        customPaths = requiredResourcePaths.concat(
            restrictionsOrCustomPaths as string[],
        );
    }

    if (restrictionsOrCustomPaths && !customPaths) {
        resourceRestrictions = restrictionsOrCustomPaths as ResourceRestriction;
    } else if (customPaths && restrictions) {
        resourceRestrictions = restrictions;
    } else {
        resourceRestrictions = {};
    }

    let applyRestrictions = (r: string): boolean => true;

    const allowedRoutes = customPaths || defaultResourcePaths;

    if (resourceRestrictions.only) {
        applyRestrictions = r => includes(resourceRestrictions.only, r);
    } else if (resourceRestrictions.except) {
        applyRestrictions = r => !includes(resourceRestrictions.except, r);
    }

    return {
        type: 'resources',
        name,
        allowedRoutes: allowedRoutes.filter(applyRestrictions),
    };
};

export { resources };
