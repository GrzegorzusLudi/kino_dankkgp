import { NgClass } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { get } from 'lodash';

import { THEME } from 'theme';

@Component({
  selector: 'lib-switch',
  imports: [NgClass],
  templateUrl: './switch.component.html',
  styleUrls: [
    './switch.aero-dark.component.scss',
    './switch.aero-light.component.scss',
    './switch.dark.component.scss',
    './switch.light.component.scss',
  ],
})
export class SwitchComponent {
  protected readonly theme = inject(THEME);

  readonly switch = output<boolean>();

  emit(event: Event): void {
    this.switch.emit(Boolean(get(event, 'target.checked')));
  }
}
