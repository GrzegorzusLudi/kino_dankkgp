import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { get } from 'lodash';

import { ThemedDirective } from '../../../directives/themed/themed.directive';
import { ThemeService } from '../../../services/theme/theme.service';

@Component({
  selector: 'app-switch',
  imports: [NgClass],
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
  @Output() readonly switch = new EventEmitter<boolean>();

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }

  emit(event: Event): void {
    this.switch.next(Boolean(get(event, 'target.checked')));
  }
}
