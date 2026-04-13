import { Directive, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Theme } from './theme.enum';
import { ThemeService } from './theme.service';

@Directive()
export class ThemedDirective {
  protected readonly theme: Signal<Theme | undefined>;

  constructor(protected readonly themeService: Readonly<ThemeService>) {
    this.theme = toSignal(this.themeService.getTheme());
  }
}
