import {PathSegment} from './pathSegment';
import {Resolver} from './resolver';
import {PathEndpoint} from './pathEndpoint';

export type Intermediate<T, TRoot extends object> = {
  [key in keyof T]: T[key] extends (PathSegment)
    ? PathEndpoint<T[key], TRoot, Resolver<TRoot, T[key]>>
    : PathEndpoint<T[key], TRoot, Resolver<TRoot, T[key]>> & Intermediate<T[key], TRoot>
};
