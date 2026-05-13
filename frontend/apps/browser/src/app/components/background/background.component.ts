import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { THEME } from 'theme';

@Component({
  selector: 'app-background',
  imports: [NgClass],
  templateUrl: './background.component.html',
  styleUrls: [
    './background.aero-dark.component.scss',
    './background.aero-light.component.scss',
    './background.dark.component.scss',
    './background.light.component.scss',
  ],
})
export class BackgroundComponent {
  protected readonly theme = inject(THEME);
}
