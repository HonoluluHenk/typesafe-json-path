import {PathSegment} from './path-segment';

/**
 * Stringify path segments and join.
 */
export function joinPath(path: ReadonlyArray<PathSegment>, pathSeparator: string = '.'): string {
  return path
    .map(p => String(p))
    .join(pathSeparator);
}
