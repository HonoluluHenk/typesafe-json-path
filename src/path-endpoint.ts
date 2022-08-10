import type {Resolver} from './resolver';
import type {PathSegment} from './path-segment';
import {PathSymbol} from './utility-types';
import {joinPath} from './join-path';

/**
 * You have reached a path in your object-graph where you cannot go any further.
 *
 * Acts as a factory for {@link Resolver}.
 *
 * <strong>Keep this classes' api surface small to prevent overlaps with properties in user-data.</strong>
 * (This is also the reason for the esoteric name of {@link $key} and the {@link PathSymbol} property)
 */
export class PathEndpoint<T, TRoot extends object, TResolver extends Resolver<T, TRoot>> implements Iterable<PathSegment> {
  public constructor(
    private readonly path: ReadonlyArray<PathSegment>,
    private readonly resolverFactory: (path: ReadonlyArray<PathSegment>) => TResolver,
  ) {
  }

  /**
   * Instantiate a resolver at the current path.
   */
  get $key(): TResolver {
    return this.resolverFactory(this.path);
  }

  [Symbol.iterator] = Array.prototype[Symbol.iterator].bind(this.path);
  [Symbol.toStringTag] = `PathSegment<${joinPath(this.path)}>`;
  [Symbol.toPrimitive] = (_hint: string) => joinPath(this.path);
  [PathSymbol] = this.path;
}
