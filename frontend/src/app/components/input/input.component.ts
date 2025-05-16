import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-input',
  imports: [AsyncPipe, NgClass, NgIf],
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
export class InputComponent
  extends ThemedDirective
  implements ControlValueAccessor
{
  @Input({ required: true }) label = '';

  value = '';
  isDisabled = false;

  changed?: (value: string) => void;
  touched?: () => void;

  onChange(event: Event): void {
    const value = (event['target'] as HTMLInputElement)['value'];

    if (this.changed) {
      this.changed(value || '');
    }
  }

  onBlur(): void {
    if (this.touched) {
      this.touched();
    }
  }

  writeValue(value: string): void {
    this.value = value;
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
}
