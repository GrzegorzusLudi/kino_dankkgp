import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrls: [
    './button.aero-dark.component.scss',
    './button.aero-light.component.scss',
    './button.dark.component.scss',
    './button.light.component.scss',
  ],
})
export class ButtonComponent extends ThemedDirective {
  protected clicked = false;

  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}
