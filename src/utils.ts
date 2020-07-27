import { Case } from './project.types';

export const startsWith = (str: string, searchStr: string): boolean => {
    return str.charAt(0) === searchStr;
};
export const endsWith = (str: string, searchStr: string): boolean => {
    return str.charAt(str.length - 1) === searchStr;
};

export const isArray = (arg: any): boolean => {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

export const trimSlashes = (str: string): string => {
    const char = '/';

    if (startsWith(str, char)) {
        str = str.slice(1);
    }
    if (endsWith(str, char)) {
        str = str.slice(0, -1);
    }
    return str;
};

const capitalize = (str: string): string => {
    return str
        .split('')
        .map((char, idx) => (idx === 0 ? char.toUpperCase() : char))
        .join('');
};

const camelCase = (parts: string[]): string => {
    const [first, ...rest] = parts;
    return [first, ...rest.map(capitalize)].join('');
};

const titleCase = (parts: string[]): string => {
    return parts.map(capitalize).join('');
};

const kebabCase = (parts: string[]): string => {
    return parts.join('-');
};

const snakeCase = (parts: string[]): string => {
    return parts.join('_');
};

export const joinWithCase = (parts: string[], casing: Case): string => {
    const validParts = parts.filter(Boolean);
    if (casing === 'camel') {
        return camelCase(validParts);
    }

    if (casing === 'title') {
        return titleCase(validParts);
    }

    if (casing === 'kebab') {
        return kebabCase(validParts);
    }

    return snakeCase(validParts);
};

export const includes = (coll: any[], item: any): boolean => {
    return coll.indexOf(item) !== -1;
};

export const invariant = (condition: any, msg: string) => {
    if (!condition) {
        throw Error(msg);
    }
};

export const toPath = function toPath(...args: string[]): string {
    return (
        '/' +
        args
            .map(arg => trimSlashes(arg.toString()))
            .filter(Boolean)
            .join('/')
    );
};
