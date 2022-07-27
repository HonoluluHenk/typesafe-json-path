import type {Resolver} from './resolver';
import type {PathSegment} from './path-segment';
import {PathSymbol} from './utility-types';

export class PathEndpoint<T, TRoot extends object, TResolver extends Resolver<T, TRoot>> implements Iterable<PathSegment> {
  public constructor(
    private readonly path: ReadonlyArray<PathSegment>,
    private readonly resolverFactory: (path: ReadonlyArray<PathSegment>) => TResolver,
  ) {
  }

  get $resolve(): TResolver {
    return this.resolverFactory(this.path);
  }

  private stringify(): string {
    return this.path
      .map(p => String(p))
      .join('.');
  }

  [Symbol.iterator] = Array.prototype[Symbol.iterator].bind(this.path);
  [Symbol.toStringTag] = `PathSegment<${this.stringify()}>`;
  [Symbol.toPrimitive] = (_hint: string) => this.stringify();
  [PathSymbol] = this.path;
}
