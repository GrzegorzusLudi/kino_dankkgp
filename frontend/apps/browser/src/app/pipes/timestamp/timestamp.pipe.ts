import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp',
})
export class TimestampPipe implements PipeTransform {
  transform(date: Readonly<Date>): string {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
}
