import { get, isUndefined } from 'lodash';

export const getOrThrow = <T, TKey extends keyof T>(
  object: T,
  path: TKey,
): T[TKey] => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const result = get(object, path) as unknown as T[TKey] | undefined;

  if (isUndefined(result)) {
    throw new Error(`Property ${String(path)} is undefined`);
  }

  return result;
};
