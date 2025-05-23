import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-toolbar',
  imports: [AsyncPipe, NgClass, NgIf],
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
