import { get, isNaN } from 'lodash';

/* eslint-disable @typescript-eslint/no-magic-numbers */

export const getOrZero = (object: object | null, path: string): number => {
  const result = Number(get(object, path));

  if (isNaN(result)) {
    return 0;
  }

  return result;
};
