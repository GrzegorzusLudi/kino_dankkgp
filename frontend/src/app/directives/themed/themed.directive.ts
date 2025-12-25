import { Directive, Signal } from '@angular/core';
import { Observable } from 'rxjs';

import { Theme } from '../../models/theme.enum';
import { ThemeService } from '../../services/theme/theme.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Directive()
export class ThemedDirective {
  protected readonly theme: Signal<Theme | undefined>;

  constructor(protected readonly themeService: Readonly<ThemeService>) {
    this.theme = toSignal(this.themeService.getTheme());
  }
}
