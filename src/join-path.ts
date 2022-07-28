import {PathSegment} from './path-segment';

export function joinPath(path: ReadonlyArray<PathSegment>, pathSeparator: string = '.'): string {
  return path
    .map(p => String(p))
    .join(pathSeparator);
}
