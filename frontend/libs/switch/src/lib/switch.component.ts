import { Component, output } from '@angular/core';
import { get } from 'lodash';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-switch',
  templateUrl: './switch.component.html',
  styleUrls: [
    './switch.aero-dark.component.scss',
    './switch.aero-light.component.scss',
    './switch.dark.component.scss',
    './switch.light.component.scss',
  ],
  hostDirectives: [ThemedDirective],
})
export class SwitchComponent {
  readonly switch = output<boolean>();

  emit(event: Event): void {
    this.switch.emit(Boolean(get(event, 'target.checked')));
  }
}
