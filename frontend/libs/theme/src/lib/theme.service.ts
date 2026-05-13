import { computed, Injectable, signal, Signal } from '@angular/core';

import { Theme } from './theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeSignal = signal<Theme>(Theme.FlatDark);

  readonly theme: Signal<string> = computed(() => this.themeSignal());

  changeTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }
}
