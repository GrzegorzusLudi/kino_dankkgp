import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';

import { THEME } from 'theme';

@Component({
  selector: 'lib-header',
  imports: [NgClass],
  templateUrl: './header.component.html',
  styleUrls: [
    './header.aero-dark.component.scss',
    './header.aero-light.component.scss',
    './header.dark.component.scss',
    './header.light.component.scss',
  ],
})
export class HeaderComponent {
  protected readonly theme = inject(THEME);
}
