import { Component, output } from '@angular/core';
import { get } from 'lodash-es';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.aero.component.scss', './switch.flat.component.scss'],
  hostDirectives: [ThemedDirective],
})
export class SwitchComponent {
  readonly switch = output<boolean>();

  emit(event: Event): void {
    this.switch.emit(Boolean(get(event, 'target.checked')));
  }
}
