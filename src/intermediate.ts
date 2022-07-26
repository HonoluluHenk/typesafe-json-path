import {PathSegment} from './path-segment';
import {Resolver} from './resolver';
import {PathEndpoint} from './path-endpoint';

export type Intermediate<T, TRoot extends object> = {
  [key in keyof T]: PathEndpoint<T[key], TRoot, Resolver<TRoot, T[key]>>
  & (T[key] extends (PathSegment) ? object : Intermediate<T[key], TRoot>)
};
