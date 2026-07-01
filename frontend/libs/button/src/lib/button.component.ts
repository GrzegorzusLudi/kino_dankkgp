import { Component, input, signal } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.aero.component.scss', './button.flat.component.scss'],
  hostDirectives: [ThemedDirective],
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'ghost'>('primary');
  readonly height = input<'small' | 'medium'>('medium');

  protected readonly clicked = signal(false);
}
