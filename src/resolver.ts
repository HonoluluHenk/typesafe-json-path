import {PathSegment} from './path-segment';

type DeepPartial<T> = { [key in keyof T]?: DeepPartial<T[key]> };

export class Resolver<T, TRoot extends object> {

  constructor(
    private readonly _path: ReadonlyArray<PathSegment>,
  ) {
  }

  get path(): ReadonlyArray<PathSegment> {
    return this._path;
  }

  get key(): string {
    return this.pathAsText();
  }

  value(root: DeepPartial<TRoot>): T {
    let current: any = root;
    for (const path of this._path) {
      current = current[path];
      if (current === null || current === undefined) {
        return current;
      }
    }

    return current;
  }

  protected pathAsText(pathSeparator: string = '.'): string {
    return this._path
      .map(p => String(p))
      .join(pathSeparator);
  }
}
