import {PathSegment} from './pathSegment';

export const PathSymbol = Symbol('Path');
export type ResolverFactory<TResolver> = (path: ReadonlyArray<PathSegment>) => TResolver;
