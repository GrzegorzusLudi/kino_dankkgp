import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';
import { ThemeService } from '../../services/theme/theme.service';
import { ButtonComponent } from '../button/button.component';
import { InputComponent } from '../input/input.component';
import { VerticalSeparatorComponent } from '../vertical-separator/vertical-separator.component';

@Component({
  selector: 'app-video-actions',
  imports: [
    AsyncPipe,
    ButtonComponent,
    InputComponent,
    NgClass,
    NgIf,
    VerticalSeparatorComponent,
  ],
  templateUrl: './video-actions.component.html',
  styleUrls: [
    './video-actions.aero-dark.component.scss',
    './video-actions.aero-light.component.scss',
    './video-actions.dark.component.scss',
    './video-actions.light.component.scss',
  ],
})
export class VideoActionsComponent extends ThemedDirective {
  constructor(protected override readonly themeService: ThemeService) {
    super(themeService);
  }
}
