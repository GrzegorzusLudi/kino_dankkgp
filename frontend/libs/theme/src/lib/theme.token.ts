import { inject, InjectionToken, Signal } from '@angular/core';

import { ThemeService } from './theme.service';

export const THEME = new InjectionToken<Signal<string>>('theme', {
  providedIn: 'root',
  factory: () => inject(ThemeService).theme,
});
