import { Component, input } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.aero.component.scss', './button.flat.component.scss'],
  hostDirectives: [ThemedDirective],
})
export class ButtonComponent {
  variant = input<'primary' | 'ghost'>('primary');
  height = input<'small' | 'medium'>('medium');

  protected clicked = false;
}
