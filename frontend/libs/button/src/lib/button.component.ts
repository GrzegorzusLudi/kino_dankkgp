import { Component, Input } from '@angular/core';

import { ThemedDirective } from 'theme';

@Component({
  selector: 'lib-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrls: [
    './button.aero-dark.component.scss',
    './button.aero-light.component.scss',
    './button.dark.component.scss',
    './button.light.component.scss',
  ],
})
export class ButtonComponent extends ThemedDirective {
  @Input() variant: 'primary' | 'ghost' = 'primary';
  @Input() height: 'small' | 'medium' = 'medium';

  protected clicked = false;
}
