import {
  Component,
  ElementRef,
  forwardRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { get, isObject } from 'lodash-es';

import { ThemedDirective } from 'theme';

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
    if (this.changed) {
      const value = get(event, 'target.value', '');
      this.changed(value);
    }
  }

  onBlur(): void {
    if (this.touched) {
      this.touched();
    }
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
    const input = this.input();

    if (input) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      input.nativeElement.value = this.value;
    }
  }
}
