import {PathSegment} from './path-segment';

type DeepPartial<T> = { [key in keyof T]?: DeepPartial<T[key]> };

export class Resolver<TRoot extends object, T> {
  constructor(
    public readonly path: ReadonlyArray<PathSegment>,
  ) {
  }

  get key(): string {
    return this.pathAsText();
  }

  value(root: DeepPartial<TRoot>): T {
    let current: any = root;
    for (const path of this.path) {
      current = current[path];
      if (current === null || current === undefined) {
        return current;
      }
    }

    return current;
  }

  protected pathAsText(pathSeparator: string = '.'): string {
    return this.path
      .map(p => String(p))
      .join(pathSeparator);
  }
}
