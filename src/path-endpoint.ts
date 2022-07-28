import type {Resolver} from './resolver';
import type {PathSegment} from './path-segment';
import {PathSymbol} from './utility-types';
import {joinPath} from './join-path';

export class PathEndpoint<T, TRoot extends object, TResolver extends Resolver<T, TRoot>> implements Iterable<PathSegment> {
  public constructor(
    private readonly path: ReadonlyArray<PathSegment>,
    private readonly resolverFactory: (path: ReadonlyArray<PathSegment>) => TResolver,
  ) {
  }

  get $key(): TResolver {
    return this.resolverFactory(this.path);
  }

  [Symbol.iterator] = Array.prototype[Symbol.iterator].bind(this.path);
  [Symbol.toStringTag] = `PathSegment<${joinPath(this.path)}>`;
  [Symbol.toPrimitive] = (_hint: string) => joinPath(this.path);
  [PathSymbol] = this.path;
}
