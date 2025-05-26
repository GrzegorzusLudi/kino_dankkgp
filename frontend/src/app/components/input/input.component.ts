import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { get, isObject } from 'lodash';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';

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

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }

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
