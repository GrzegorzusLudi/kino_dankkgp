import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-vertical-separator',
  imports: [NgClass],
  templateUrl: './vertical-separator.component.html',
  styleUrls: [
    './vertical-separator.aero-dark.component.scss',
    './vertical-separator.aero-light.component.scss',
    './vertical-separator.dark.component.scss',
    './vertical-separator.light.component.scss',
  ],
})
export class VerticalSeparatorComponent extends ThemedDirective {
  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}
