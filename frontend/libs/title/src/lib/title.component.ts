import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { THEME } from 'theme';

@Component({
  selector: 'lib-title',
  imports: [NgClass],
  templateUrl: './title.component.html',
  styleUrls: [
    './title.aero-dark.component.scss',
    './title.aero-light.component.scss',
    './title.dark.component.scss',
    './title.light.component.scss',
  ],
})
export class TitleComponent {
  protected readonly theme = inject(THEME);
}
