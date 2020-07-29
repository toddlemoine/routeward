import { routeward } from '../src/routeward';

describe('Routeward', () => {
    test('returns scope, route, and resources set to defaults', () => {
        const { scope, route, resources } = routeward();
        const routes = scope(
            '/',
            route('apples'),
            resources('kiwis', { only: ['index', 'show'] }),
            scope('ratings', { as: 'colorratings' }, route('color/:id')),
        );

        expect(routes.apples_path()).toBe('/apples');
        expect(routes.kiwis_path()).toBe('/kiwis');
        expect(routes.kiwis_path('show', { id: 123 })).toBe('/kiwis/123');
        expect(routes.colorratings_color_path({ id: 10 })).toBe(
            '/ratings/color/10',
        );
    });

    describe('case', () => {
        test('defaults to snake_case', () => {
            const { scope, route } = routeward();
            const routes = scope('/fruit', route('apples'));
            expect(routes['fruit_apples_path']()).toBe('/fruit/apples');
        });

        test('can use title case', () => {
            const { scope, route } = routeward({ case: 'title' });
            const routes = scope('/', route('apples'));
            expect(routes['ApplesPath']()).toBe('/apples');
        });

        test('can use camel case', () => {
            const { scope, route } = routeward({ case: 'camel' });
            const routes = scope('/', route('apples'));
            expect(routes['applesPath']()).toBe('/apples');
        });
    });

    describe('suffix', () => {
        test('defaults to `path`', () => {
            const { scope, route } = routeward();
            const routes = scope('/', route('apples'));
            expect(routes['apples_path']()).toBe('/apples');
        });

        test('can be overridden', () => {
            const { scope, route } = routeward({ suffix: 'route' });
            const routes = scope('/', route('apples'));
            expect(routes['apples_route']()).toBe('/apples');
        });

        test('can be set to nothing', () => {
            const { scope, route } = routeward({ suffix: '' });
            const routes = scope('/', route('apples'));
            expect(routes.apples()).toBe('/apples');
        });
    });

    describe('prefix for numeric routes', () => {
        test('defaults to `go`', () => {
            const { scope, route } = routeward();
            const routes = scope('/', route('404'));
            expect(routes.go_404_path()).toBe('/404');
        });

        test('can be customized', () => {
            const { scope, route } = routeward({ numericPathPrefix: 'error' });
            const routes = scope('/', route('404'));
            expect(routes.error_404_path()).toBe('/404');
        });
    });
});
