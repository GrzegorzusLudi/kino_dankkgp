import { get, isNaN } from 'lodash';

export const getOrZero = (object: object | null, path: string): number => {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const result = Number(get(object, path) || 0);

  if (isNaN(result)) {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return 0;
  }

  return result;
};
