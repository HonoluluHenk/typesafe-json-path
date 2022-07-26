import {PathSegment} from './path-segment';
import {Resolver} from './resolver';
import {PathEndpoint} from './path-endpoint';

export type Intermediate<T, TRoot extends object> = {
  [key in keyof T]: T[key] extends (PathSegment)
    ? PathEndpoint<T[key], TRoot, Resolver<TRoot, T[key]>>
    : PathEndpoint<T[key], TRoot, Resolver<TRoot, T[key]>> & Intermediate<T[key], TRoot>
};
