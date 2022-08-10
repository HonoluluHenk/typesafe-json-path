import {PathSegment} from './path-segment';
import {joinPath} from './join-path';

type DeepPartial<T> = { readonly [key in keyof T]?: DeepPartial<T[key]> };

export class Resolver<T, TRoot extends object> {

  constructor(
    private readonly _path: ReadonlyArray<PathSegment>,
  ) {
  }

  /**
   * the current path with entries separated by '.'.
   */
  get path(): string {
    return this.toString();
  }

  toString(pathSeparator: string = '.'): string {
    return joinPath(this._path, pathSeparator);
  }

  toArray(): ReadonlyArray<PathSegment> {
    return this._path;
  }

  isPresent(root: DeepPartial<TRoot>, nullAllowed: boolean = false): boolean {
    const value = this.resolve(root);

    if (value === undefined) {
      return false;
    }

    if (value === null) {
      return nullAllowed;
    }

    return true;
  }

  resolve(root: DeepPartial<TRoot>): T {
    let current: any = root;
    for (const path of this._path) {
      current = current[path];
      if (current === null || current === undefined) {
        return current;
      }
    }

    return current;
  }

}
