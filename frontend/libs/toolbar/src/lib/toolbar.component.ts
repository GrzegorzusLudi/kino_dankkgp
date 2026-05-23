import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { THEME } from 'theme';

@Component({
  selector: 'lib-toolbar',
  imports: [NgClass],
  templateUrl: './toolbar.component.html',
  styleUrls: [
    './toolbar.aero-dark.component.scss',
    './toolbar.aero-light.component.scss',
    './toolbar.dark.component.scss',
    './toolbar.light.component.scss',
  ],
})
export class ToolbarComponent {
  protected readonly theme = inject(THEME);
}
