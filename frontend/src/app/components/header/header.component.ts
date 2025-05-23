import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, NgClass, NgIf],
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
