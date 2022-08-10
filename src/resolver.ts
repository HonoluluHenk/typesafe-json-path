import {PathSegment} from './path-segment';
import {joinPath} from './join-path';

type DeepPartial<T> = { readonly [key in keyof T]?: DeepPartial<T[key]> };

/**
 * All the things you can do once you've reached the desired path in the object graph.
 */
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

  /**
   * Join path segments with a separator (defaults to '.').
   */
  toString(pathSeparator: string = '.'): string {
    return joinPath(this._path, pathSeparator);
  }

  /**
   * The path as an array of segments.
   */
  toArray(): ReadonlyArray<PathSegment> {
    return this._path;
  }

  /**
   * True if root contains a value at the path.
   *
   * A value is present if it is !undefined and !null.
   *
   * @param root
   * @param nullAllowed disables the null check so only undefined is considered.
   */
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

  /**
   * Traverse the root-object using the current path and return the value.
   */
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
