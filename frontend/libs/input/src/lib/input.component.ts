import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { get, isObject } from 'lodash';

import { THEME } from 'theme';

@Component({
  selector: 'lib-input',
  imports: [NgClass],
  templateUrl: './input.component.html',
  styleUrls: [
    './input.aero-dark.component.scss',
    './input.aero-light.component.scss',
    './input.dark.component.scss',
    './input.light.component.scss',
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  protected readonly theme = inject(THEME);

  label = input.required<string>();

  @ViewChild('input') input?: ElementRef;

  isDisabled = false;

  changed?: (value: string) => void;
  touched?: () => void;

  get value(): string | null {
    return this._value;
  }

  set value(value: string | null) {
    this._value = isObject(value) ? JSON.stringify(value) : `${value}`;
    this.updateNativeInputValue();
  }

  private _value: string | null = '';

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
    this.isDisabled = isDisabled;
  }

  private updateNativeInputValue(): void {
    if (this.input) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.input.nativeElement.value = this.value;
    }
  }
}
