import {PathSymbol, ResolverFactory} from './utility-types';
import {Resolver} from './resolver';
import {Intermediate} from './intermediate';
import {PathEndpoint} from './path-endpoint';

/**
 * Main entrypoint
 */
export class TypesafeJsonPath {

  /**
   * Initialize path traversal.
   *
   * <p/>
   * Example:
   * <pre>{@code
   * const translationsRoot = {
   *   FOO: {
   *     BAR: {
   *       BAZ: 'Baz was here!',
   *       HELLO: 'Hello World',
   *     }
   *   }
   * };
   *
   * const path = TypesafeJsonPath.init<typeof translationsRoot>();
   *
   * const value = path.FOO.BAR.HELLO.$path.get(translationsRoot);
   * console.log(value);
   * // Hello World
   *
   * }</pre>
   *
   * <br/>
   * Or use your custom Resolver:
   * <pre>{@code
   * const translationsRoot = {
   *   FOO: {
   *     BAR: {
   *       BAZ: 'Baz was here!',
   *       HELLO: 'Hello %s',
   *     }
   *   }
   * };
   *
   * class Translator<T extends object> extends Resolver<unknown, T> {
   *   constructor(path: ReadonlyArray<PathSegment>, private readonly translator: TranslateService) {
   *     super(path);
   *   }
   *
   *   translate(args: ...unknown[]): string {
   *     // delegate to some translation service:
   *     return this.translator.translate(this.path, args);
   *   }
   * }
   *
   * const translations = TypesafeJsonPath.init<typeof translationsRoot, Translator<any>>(
   *   path => new Translator(path, myTranslateService);)
   * );
   *
   * const text = translations.FOO.BAR.HELLO.$path.translate('world');
   * console.log(text);
   * // Hello world
   *
   * }</pre>
   */
  public static init<TRoot extends object>(): Intermediate<TRoot, TRoot, Resolver<unknown, TRoot>>;
  public static init<TRoot extends object, ResolverExtension extends Resolver<unknown, TRoot>>(
    resolverFactory: ResolverFactory<ResolverExtension>,
  ): Intermediate<TRoot, TRoot, ResolverExtension>;
  public static init<TRoot extends object, ResolverExtension extends Resolver<unknown, TRoot>>(
    resolverFactory?: ResolverFactory<ResolverExtension>,
  ): Intermediate<TRoot, TRoot, ResolverExtension> {
    resolverFactory ||= path => new Resolver(path) as ResolverExtension;

    const endpoint = new PathEndpoint([], resolverFactory);
    const handler = new Handler(resolverFactory);

    return new Proxy(endpoint, handler) as unknown as Intermediate<TRoot, TRoot, ResolverExtension>;
  }

}

// Proxy-Handlers are just too tedious with no explicit anys since we never know the actual type anyway.
/* eslint-disable @typescript-eslint/no-explicit-any */
class Handler implements ProxyHandler<any> {
  constructor(
    public readonly resolverFactory: ResolverFactory<any>,
  ) {
  }

  get(targetEndpoint: any, prop: string | symbol, _receiver: any): any {
    // console.log('get', prop, typeof prop);

    if (targetEndpoint[prop]) {
      return Reflect.get(targetEndpoint, prop, targetEndpoint);
    }

    const oldEndpoint = (targetEndpoint as PathEndpoint<any, any, Resolver<any, any>>);
    const newEndpoint = this.childEndpoint(oldEndpoint, prop);

    return new Proxy(newEndpoint, this);
  }

  private childEndpoint(oldEndpoint: PathEndpoint<any, any, Resolver<any, any>>, prop: string | symbol) {
    // explicitly do *not* create a method for this on Endpoint to keep its surface minimal
    // so hopefully no method-names interfere with possible user-defined property-names.
    const childPath = oldEndpoint[PathSymbol].concat(prop);
    const newEndpoint = new PathEndpoint(childPath, this.resolverFactory);

    return newEndpoint;
  }
}
