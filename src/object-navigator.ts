type DeepPartial<T> = {[key in keyof T]?: DeepPartial<T[key]>};

export interface Config {
  readonly pathSeparator?: string;
}

export type ParsedConfig = Readonly<Required<Config>>;

export type Path = string | symbol;

export type Intermediate<T, TRoot extends object> = {
  [key in keyof T]: T[key] extends (Path)
    ? Endpoint<T[key], TRoot>
    : Endpoint<T[key], TRoot> & Intermediate<T[key], TRoot>
};

export class Endpoint<T, TRoot extends object> implements Iterable<Path>{
  public constructor(
    private readonly path: Path[],
    private readonly config: ParsedConfig,
  ) {
  }

  get $path(): Path[] {
    return this.path;
  }

  get $key(): string {
    return this.pathAsText();
  }

  private pathAsText(): string {
    return this.$path
      .map(p => String(p))
      .join(this.config.pathSeparator);
  }

  $applyKey<R>(mapper: (key: string) => R): R {
    return mapper(this.$key);
  }

  $applyPath<R>(mapper: (path: ReadonlyArray<Path>) => R): R {
    return mapper(this.$path);
  }

  $resolve(root: DeepPartial<TRoot>): T {
    let current: any = root;
    for (const path of this.$path) {
      current = current[path];
      if (current === null || current === undefined) {
        return current;
      }
    }

    return current;
  }

  [Symbol.iterator] = Array.prototype[Symbol.iterator].bind(this.$path);
  [Symbol.toStringTag] = `PathEntry<${this.$key}>`;
  [Symbol.toPrimitive] = (_hint: string) => this.$key;
}

export class Navigator<T extends object> {

  public static init<T extends object>(
    config?: Config | null | undefined,
  ): Intermediate<T, T> {
    const parsedConfig = this.defaultConfig(config);
    const endpoint = new Endpoint([], parsedConfig);
    const handler = new Handler(parsedConfig);

    return new Proxy(endpoint, handler) as any as Intermediate<T, T>;
  }

  private static defaultConfig(config: Config | null | undefined): ParsedConfig {
    return {
      pathSeparator: config?.pathSeparator ?? '.',
    };
  }
}

class Handler implements ProxyHandler<any> {
  constructor(
    public readonly config: ParsedConfig,
  ) {
  }

  get(targetEndpoint: any, prop: string | symbol, receiver: any): any {
    // console.log('get', prop);

    if (targetEndpoint[prop]) {
      return Reflect.get(targetEndpoint, prop, targetEndpoint);
    }

    const oldEndpoint = (targetEndpoint as Endpoint<any, any>);
    // explicitly do *not* create a method for this on Endpoint to keep its surface minimal
    // so hopefully no method-names interfere with possible user-defined property-names.
    const newEndpoint = new Endpoint([...oldEndpoint.$path, prop], this.config);

    return new Proxy(newEndpoint, this);
  }
}
