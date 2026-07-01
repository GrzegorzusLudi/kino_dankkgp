import {
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
})
export class InputComponent implements ControlValueAccessor {
  label = input.required<string>();

  private readonly input = viewChild<ElementRef>('input');

  protected readonly isDisabled = signal(false);

  changed?: (value: string) => void;
  touched?: () => void;

  get value(): string | null {
    return this.valueSignal();
  }

  set value(value: string | null) {
    this.valueSignal.set(isObject(value) ? JSON.stringify(value) : `${value}`);
    this.updateNativeInputValue();
  }

  private readonly valueSignal = signal<string | null>('');

  onChange(event: Readonly<Event>): void {
    match(this.changed)
      .with(nullish, noop)
      .otherwise((changed) => changed(get(event, 'target.value', '')));
  }

  onBlur(): void {
    match(this.touched)
      .with(nullish, noop)
      .otherwise((touched) => touched());
  }

  writeValue(value: string | null): void {
    this.value = value;
    this.updateNativeInputValue();
  }

  registerOnChange(fn: () => void): void {
    this.changed = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
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
