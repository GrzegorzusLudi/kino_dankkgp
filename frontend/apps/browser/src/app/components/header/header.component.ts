import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective, ThemeService } from 'theme';

@Component({
  selector: 'app-header',
  imports: [NgClass],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.aero-dark.component.scss',
    './header.aero-light.component.scss',
    './header.dark.component.scss',
    './header.light.component.scss',
  ],
})
export class HeaderComponent extends ThemedDirective {
  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}
