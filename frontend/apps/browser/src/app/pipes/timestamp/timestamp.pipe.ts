import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestamp',
  standalone: true,
})
export class TimestampPipe implements PipeTransform {
  transform(date: Date): string {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }
}
