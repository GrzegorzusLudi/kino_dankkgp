import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { ThemedDirective } from '../../directives/themed/themed.directive';

@Component({
  selector: 'app-title',
  imports: [NgClass, NgIf, AsyncPipe],
  templateUrl: './title.component.html',
  styleUrls: [
    './title.light.component.scss',
    './title.dark.component.scss',
    './title.aero-light.component.scss',
    './title.aero-dark.component.scss',
  ],
})
export class TitleComponent extends ThemedDirective {}
