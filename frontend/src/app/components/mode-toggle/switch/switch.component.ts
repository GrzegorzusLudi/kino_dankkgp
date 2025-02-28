import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import { ThemedDirective } from '../../../directives/themed/themed.directive';

@Component({
  selector: 'app-switch',
  imports: [AsyncPipe, NgClass, NgIf],
  templateUrl: './switch.component.html',
  styleUrls: [
    './switch.aero-dark.component.scss',
    './switch.aero-light.component.scss',
    './switch.dark.component.scss',
    './switch.light.component.scss',
  ],
})
export class SwitchComponent extends ThemedDirective {
  // TODO Rename to toggle?
  @Output() switch = new EventEmitter<boolean>();

  emit(event: Event): void {
    this.switch.next((event.target as HTMLInputElement)['checked']);
  }
}
