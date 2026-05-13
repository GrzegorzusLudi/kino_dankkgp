import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { THEME } from 'theme';

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
export class VerticalSeparatorComponent {
  protected readonly theme = inject(THEME);
}
