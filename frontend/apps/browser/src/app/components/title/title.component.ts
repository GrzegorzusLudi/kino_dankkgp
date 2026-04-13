import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective, ThemeService } from 'theme';

@Component({
  selector: 'app-title',
  imports: [NgClass],
  templateUrl: './title.component.html',
  styleUrls: [
    './title.aero-dark.component.scss',
    './title.aero-light.component.scss',
    './title.dark.component.scss',
    './title.light.component.scss',
  ],
})
export class TitleComponent extends ThemedDirective {
  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}
