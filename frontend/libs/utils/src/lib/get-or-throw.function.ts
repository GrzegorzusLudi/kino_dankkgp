import { get, isUndefined } from 'lodash-es';
import { match, P } from 'ts-pattern';

const { when } = P;

export const getOrThrow = <T, TKey extends keyof T>(
  object: T,
  path: TKey,
): T[TKey] =>
  match(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    get(object, path) as unknown as T[TKey] | undefined,
  )
    .with(when(isUndefined), () => {
      throw new Error(`Property ${String(path)} is undefined`);
    })
    .otherwise((value) => value);
