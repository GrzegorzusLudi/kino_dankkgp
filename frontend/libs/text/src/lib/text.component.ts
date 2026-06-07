import { Component, input } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-text',
  templateUrl: './text.component.html',
  styleUrls: [
    './text.flat.component.scss',
    './text.aero.component.scss',
  ],
  hostDirectives: [ThemedDirective]
})
export class TextComponent {
  variant = input<'info' | 'success' | 'danger'>();
}
