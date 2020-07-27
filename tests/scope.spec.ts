import { routeward } from '../src/routeward';

const { scope, route, resources } = routeward();

describe('scope', () => {
    test('is a function', () => {
        expect(typeof scope).toBe('function');
    });

    test('requires a base name', () => {
        expect(() => scope()).toThrowError(/Name required/i);
    });

    describe('routes', () => {
        test('it generates a single route with unnamed base', () => {
            const routes = scope('/', route('apples'));
            expect(typeof routes.apples_path).toBe('function');
            expect(routes.apples_path()).toBe('/apples');
        });

        test('it generates a single route with named base', () => {
            const routes = scope('/api', route('apples'));
            expect(typeof routes.api_apples_path).toBe('function');
            expect(routes.api_apples_path()).toBe('/api/apples');
        });

        test('it generates a route with parameters', () => {
            const routes = scope('/api', route('apples/:id'));
            expect(typeof routes.api_apples_path).toBe('function');
            expect(routes.api_apples_path({ id: 123 })).toBe('/api/apples/123');
        });

        test('it generates a route with multiple parameters', () => {
            const routes = scope('/api', route('apples/:id/ratings/:ratingid'));
            expect(typeof routes.api_apples_ratings_path).toBe('function');
            expect(
                routes.api_apples_ratings_path({ id: 123, ratingid: '10' }),
            ).toBe('/api/apples/123/ratings/10');
        });

        test('it generates multiple routes', () => {
            const routes = scope(
                '/',
                route('apples'),
                route('/bananas'),
                route('/kiwis'),
            );
            ['apples', 'bananas', 'kiwis'].forEach(fruit => {
                expect(typeof routes[`${fruit}_path`]).toBe('function');
                expect(routes[`${fruit}_path`]()).toBe(`/${fruit}`);
            });
        });
    });

    describe('resources', () => {
        test('it can make default routes from resources', () => {
            const routes = scope('/', resources('apples'));
            expect(typeof routes.apples_path).toBe('function');
            expect(routes.apples_path()).toBe('/apples');
            expect(routes.apples_path('show', { id: 123 })).toBe('/apples/123');
            expect(routes.apples_path('edit', { id: 123 })).toBe(
                '/apples/123/edit',
            );
            expect(routes.apples_path('delete', { id: 123 })).toBe(
                '/apples/123/delete',
            );
        });

        test('it can create routes from only specified resources', () => {
            const routes = scope(
                '/',
                resources('apples', { only: ['index', 'show'] }),
            );
            expect(typeof routes.apples_path).toBe('function');
            expect(routes.apples_path()).toBe('/apples');
            expect(routes.apples_path('show', { id: 123 })).toBe('/apples/123');
            expect(() =>
                routes.apples_path('edit', { id: 123 }),
            ).toThrowError();
            expect(() =>
                routes.apples_path('delete', { id: 123 }),
            ).toThrowError();
        });

        test('it can create routes from excluded resources', () => {
            const routes = scope(
                '/',
                resources('apples', { except: ['delete'] }),
            );
            expect(typeof routes.apples_path).toBe('function');
            expect(routes.apples_path()).toBe('/apples');
            expect(routes.apples_path('show', { id: 123 })).toBe('/apples/123');
            expect(routes.apples_path('edit', { id: 123 })).toBe(
                '/apples/123/edit',
            );
            expect(() =>
                routes.apples_path('delete', { id: 123 }),
            ).toThrowError();
        });

        test('uses scope `as` to set name of resource helper function', () => {
            const routes = scope('/api', { as: 'boop' }, resources('apples'));
            expect(typeof routes.boop_apples_path).toBe('function');
            expect(routes.boop_apples_path()).toBe('/api/apples');
        });
    });

    describe('nested scopes', () => {
        test('can have a nested unnamed scope', () => {
            const routes = scope('/api', scope('/fruit', route('apples')));
            expect(typeof routes.api_fruit_apples_path).toBe('function');
            expect(routes.api_fruit_apples_path()).toBe('/api/fruit/apples');
        });

        test('can have a nested named scope', () => {
            const routes = scope(
                '/api',
                scope('/fruit', { as: 'veggie' }, route('apples')),
            );
            expect(typeof routes.api_veggie_apples_path).toBe('function');
            expect(routes.api_veggie_apples_path()).toBe('/api/fruit/apples');
        });

        test('can have a nested unnamed scope with resources', () => {
            const routes = scope('/api', scope('/fruit', resources('apples')));
            expect(typeof routes.api_fruit_apples_path).toBe('function');
            expect(routes.api_fruit_apples_path()).toBe('/api/fruit/apples');
            expect(routes.api_fruit_apples_path('show', { id: 123 })).toBe(
                '/api/fruit/apples/123',
            );
        });

        test('can have a nested named scope with resources', () => {
            const routes = scope(
                '/api',
                scope('/fruit', { as: 'veggie' }, resources('apples')),
            );
            expect(typeof routes.api_veggie_apples_path).toBe('function');
            expect(routes.api_veggie_apples_path()).toBe('/api/fruit/apples');
            expect(routes.api_veggie_apples_path('show', { id: 123 })).toBe(
                '/api/fruit/apples/123',
            );
        });
    });
});
