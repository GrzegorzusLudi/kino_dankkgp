import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-round-button',
  imports: [NgClass],
  templateUrl: './round-button.component.html',
  styleUrls: [
    './round-button.aero-dark.component.scss',
    './round-button.aero-light.component.scss',
    './round-button.dark.component.scss',
    './round-button.light.component.scss',
  ],
})
export class RoundButtonComponent extends ThemedDirective {
  protected clicked = false;

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}
