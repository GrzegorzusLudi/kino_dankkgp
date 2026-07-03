import { get, isNaN } from 'lodash-es';
import { match, P } from 'ts-pattern';

/* eslint-disable @typescript-eslint/no-magic-numbers */

const { when } = P;

export const getOrZero = (object: object | null, path: string): number =>
  match(Number(get(object, path)))
    .with(when(isNaN), () => 0)
    .otherwise(Number);
