import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-title',
  imports: [AsyncPipe, NgClass, NgIf],
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
