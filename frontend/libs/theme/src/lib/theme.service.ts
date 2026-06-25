import { computed, Injectable, signal, Signal } from '@angular/core';

import { Theme } from './theme.enum';
import { THEME_STORAGE_KEY } from './theme.consts';
import { THEME_CSS_VARIABLES } from './theme.tokens';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeSignal = signal<Theme>(this.resolveInitialTheme());

  readonly theme: Signal<string> = computed(() => this.themeSignal());

  constructor() {
    this.applyCssVariables();
  }

  changeTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  private applyCssVariables(): void {
    const root = document.documentElement;

    for (const [name, value] of Object.entries(THEME_CSS_VARIABLES)) {
      root.style.setProperty(name, value);
    }
  }

  private resolveInitialTheme(): Theme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;

    if (stored && Object.values(Theme).includes(stored)) {
      return stored;
    }

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    return prefersDark ? Theme.FlatDark : Theme.FlatLight;
  }
}
