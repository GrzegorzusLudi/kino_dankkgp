import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective, ThemeService } from 'theme';

@Component({
  selector: 'app-toolbar',
  imports: [NgClass],
  templateUrl: './toolbar.component.html',
  styleUrls: [
    './toolbar.aero-dark.component.scss',
    './toolbar.aero-light.component.scss',
    './toolbar.dark.component.scss',
    './toolbar.light.component.scss',
  ],
})
export class ToolbarComponent extends ThemedDirective {
  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}
