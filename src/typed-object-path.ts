import {PathSymbol, ResolverFactory} from './utility-types';
import {Resolver} from './resolver';
import {Intermediate} from './intermediate';
import {PathEndpoint} from './path-endpoint';

export class TypedObjectPath {

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

    return new Proxy(endpoint, handler) as any as Intermediate<TRoot, TRoot, ResolverExtension>;
  }

}

class Handler implements ProxyHandler<any> {
  constructor(
    public readonly resolverFactory: ResolverFactory<any>,
  ) {
  }

  get(targetEndpoint: any, prop: string | symbol, receiver: any): any {
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
