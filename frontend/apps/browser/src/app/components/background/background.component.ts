import { Component } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'app-background',
  imports: [],
  templateUrl: './background.component.html',
  styleUrls: [
    './background.aero-dark.component.scss',
    './background.aero-light.component.scss',
    './background.dark.component.scss',
    './background.light.component.scss',
  ],
  hostDirectives: [ThemedDirective],
})
export class BackgroundComponent {}
