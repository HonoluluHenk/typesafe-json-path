import {PathSegment} from './path-segment';

export const PathSymbol = Symbol('Path');
export type ResolverFactory<TResolver> = (path: ReadonlyArray<PathSegment>) => TResolver;
