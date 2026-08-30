import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { get, isObject, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { ThemedDirective } from 'theme';

const { nullish } = P;

@Component({
  selector: 'lib-input',
  imports: [],
  templateUrl: './input.component.html',
  styleUrls: ['./input.aero.component.scss', './input.flat.component.scss'],
  hostDirectives: [ThemedDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor {
  readonly label = input.required<string>();

  protected readonly isDisabled = signal(false);

  private readonly valueSignal = signal<string | null>('');
  private readonly input = viewChild<ElementRef>('input');

  private changed?: (value: string) => void;
  private touched?: () => void;

  get value(): string | null {
    return this.valueSignal();
  }

  set value(value: string | null) {
    this.valueSignal.set(isObject(value) ? JSON.stringify(value) : `${value}`);
    this.updateNativeInputValue();
  }

  writeValue(value: string | null): void {
    this.value = value;
    this.updateNativeInputValue();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.changed = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onChange(event: Readonly<Event>): void {
    match(this.changed)
      .with(nullish, noop)
      .otherwise((changed) => changed(get(event, 'target.value', '')));
  }

  protected onBlur(): void {
    match(this.touched)
      .with(nullish, noop)
      .otherwise((touched) => touched());
  }

  private updateNativeInputValue(): void {
    match(this.input())
      .with(nullish, noop)
      .otherwise((input) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        input.nativeElement.value = this.value;
      });
  }
}
