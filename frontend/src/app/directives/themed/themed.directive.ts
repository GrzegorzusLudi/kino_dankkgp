import { Directive } from '@angular/core';
import { Observable } from 'rxjs';

import { Theme } from '../../models/theme.enum';
import { ThemeService } from '../../services/theme/theme.service';

@Directive()
export class ThemedDirective {
  protected readonly theme: Observable<Theme>;

  constructor(protected readonly themeService: Readonly<ThemeService>) {
    this.theme = this.themeService.getTheme();
  }
}
