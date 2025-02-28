import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-background',
  imports: [AsyncPipe, NgClass, NgIf],
  templateUrl: './background.component.html',
  styleUrls: [
    './background.aero-dark.component.scss',
    './background.aero-light.component.scss',
    './background.dark.component.scss',
    './background.light.component.scss',
  ],
})
export class BackgroundComponent extends ThemedDirective {}
