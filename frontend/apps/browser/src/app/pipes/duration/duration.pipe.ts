import { Pipe, PipeTransform } from '@angular/core';
import { match, P } from 'ts-pattern';

import {
  SECONDS_IN_MINUTE,
  SECONDS_PAD_CHARACTER,
  SECONDS_PAD_LENGTH,
  ZERO_DURATION,
} from './duration.consts';

const { nullish, number } = P;

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(seconds: number | null | undefined): string {
    return match(seconds)
      .with(nullish, () => ZERO_DURATION)
      .with(number.lt(1), () => ZERO_DURATION)
      .otherwise((value) => {
        const minutesPart = Math.floor(value / SECONDS_IN_MINUTE);
        const secondsPart = Math.floor(value % SECONDS_IN_MINUTE)
          .toString()
          .padStart(SECONDS_PAD_LENGTH, SECONDS_PAD_CHARACTER);

        return `${minutesPart}:${secondsPart}`;
      });
  }
}
