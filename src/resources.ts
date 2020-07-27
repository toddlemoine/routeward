import { includes } from './utils';
import { Resources, ResourceRestriction } from './project.types';

const defaultResourceRestrictions = ['index', 'edit', 'show', 'delete'];

const resources = function resources(
    name: string,
    restrictions: ResourceRestriction = {},
): Resources {
    let applyRestrictions = (r: string): boolean => true;

    if (restrictions.only) {
        applyRestrictions = r => includes(restrictions.only, r);
    } else if (restrictions.except) {
        applyRestrictions = r => !includes(restrictions.except, r);
    }

    const allowedRoutes = defaultResourceRestrictions.filter(applyRestrictions);
    return { type: 'resources', name, allowedRoutes };
};

export { resources };
