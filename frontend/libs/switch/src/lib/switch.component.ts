import { Component, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { get } from 'lodash-es';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.aero.component.scss', './switch.flat.component.scss'],
  hostDirectives: [ThemedDirective],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  protected readonly value = signal(false);
  protected readonly isDisabled = signal(false);

  private changed?: (value: boolean) => void;
  private touched?: () => void;

  onChange(event: Event): void {
    const checked = Boolean(get(event, 'target.checked'));
    this.value.set(checked);
    this.changed?.(checked);
  }

  onBlur(): void {
    this.touched?.();
  }

  writeValue(value: boolean): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.changed = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.touched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
