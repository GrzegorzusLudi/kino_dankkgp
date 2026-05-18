import { Component } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-vertical-separator',
  templateUrl: './vertical-separator.component.html',
  styleUrls: [
    './vertical-separator.flat.component.scss',
    './vertical-separator.aero.component.scss',
  ],
  hostDirectives: [ThemedDirective],
})
export class VerticalSeparatorComponent {}
