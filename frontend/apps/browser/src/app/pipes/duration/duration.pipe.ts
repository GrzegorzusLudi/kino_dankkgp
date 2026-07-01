import { Pipe, PipeTransform } from '@angular/core';
import { match, P } from 'ts-pattern';

const { nullish, number } = P;

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(seconds: number | null | undefined): string {
    return match(seconds)
      .with(nullish, () => '0:00')
      .with(number.lt(1), () => '0:00')
      .otherwise(
        (value) =>
          `${Math.floor(value / 60)}:${Math.floor(value % 60)
            .toString()
            .padStart(2, '0')}`,
      );
  }
}
