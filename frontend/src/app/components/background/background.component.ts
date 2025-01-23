import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-background',
  imports: [NgIf, NgClass, AsyncPipe],
  templateUrl: './background.component.html',
  styleUrls: [
    './background.light.component.scss',
    './background.dark.component.scss',
    './background.aero-light.component.scss',
    './background.aero-dark.component.scss',
  ],
})
export class BackgroundComponent extends ThemedDirective {}
