import { Case } from './types';

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

const processCaseParts = (acc: string[], part: string): string[] => {
    return acc.concat(...part.split(/[-_]/));
};

const camelCase = (parts: string[]): string => {
    const [first, ...rest] = parts.reduce(processCaseParts, []);
    return [first, ...rest.map(capitalize)].join('');
};

const titleCase = (parts: string[]): string => {
    return parts.reduce(processCaseParts, []).map(capitalize).join('');
};

const snakeCase = (parts: string[]): string => {
    return parts.reduce(processCaseParts, []).join('_');
};

export const joinWithCase = (parts: string[], casing: Case): string => {
    const validParts = parts.filter(Boolean);
    if (casing === 'camel') {
        return camelCase(validParts);
    }

    if (casing === 'title') {
        return titleCase(validParts);
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
