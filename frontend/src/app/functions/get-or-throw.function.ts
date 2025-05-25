import { get, isUndefined } from 'lodash';

export const getOrThrow = <TObject extends object, TKey extends keyof TObject>(
  object: TObject,
  path: keyof TKey,
): TObject[TKey] => {
  const result = get(object, path) as unknown;

  if (isUndefined(result)) {
    throw new Error(`Property ${String(path)} is undefined`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return result as TObject[TKey];
};
