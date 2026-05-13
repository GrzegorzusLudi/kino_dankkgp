import { Directive, inject, Signal } from '@angular/core';

import { THEME } from './theme.token';

@Directive()
export class ThemedDirective {
  protected readonly theme: Signal<string> = inject(THEME);
}
