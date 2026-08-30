import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.flat.component.scss', './text.aero.component.scss'],
  hostDirectives: [ThemedDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextComponent {
  readonly variant = input<'info' | 'success' | 'danger'>();
}
