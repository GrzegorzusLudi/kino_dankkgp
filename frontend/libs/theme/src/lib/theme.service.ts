import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import chroma from 'chroma-js';
import { DOCUMENT } from '@angular/common';

import { Theme } from './theme.enum';
import { THEME_STORAGE_KEY } from './theme.consts';

const DEFAULT_PRIMARY = '#0033ff';
const DEFAULT_SUCCESS = '#00ff5e';
const DEFAULT_DANGER = '#ff0000';
const DEFAULT_GRAY = '#848484';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly themeSignal = signal<Theme>(this.resolveInitialTheme());

  readonly theme: Signal<string> = computed(() => this.themeSignal());

  constructor() {
    this.generate(DEFAULT_PRIMARY, DEFAULT_SUCCESS, DEFAULT_DANGER);
  }

  changeTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
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

  private generate(primary: string, success: string, danger: string): void {
    const steps = [
      0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
      95, 100,
    ];
    const darkPrimary = chroma.mix(DEFAULT_PRIMARY, '#000000', 0.5).hex();

    this.setColorProperties('--light-primary', primary, steps);
    this.setColorProperties('--dark-primary', darkPrimary, steps);
    this.setColorProperties(
      '--light-success',
      success,
      steps,
    );
    this.setColorProperties( 
      '--light-danger',
      danger,
      steps,
    );
    this.setColorProperties('--gray', DEFAULT_GRAY, steps);

    const fixed: Record<string, string> = {
      '--font-size': '14px',
      '--line-height': '21px',
      '--title-font-size': '20px',
      '--title-line-height': '28px',
      '--letter-spacing': '0.24px',
      '--padding': '8px',
      '--toolbar-height': '36px',
      '--header-height': '32px',
      '--panel-width': '320px',
      '--border-radius': '10px',
      '--dark-text-color': 'var(--gray-a20)',
      '--dark-link-color': 'var(--gray-a0)',
      '--dark-border-color': 'var(--gray-a85)',
      '--dark-input-border-color': 'var(--gray-a75)',
      '--light-text-color': 'var(--gray-a80)',
      '--light-link-color': 'var(--gray-a100)',
      '--light-border-color': 'var(--gray-a15)',
      '--light-input-border-color': 'var(--gray-a25)',
    };

    for (const [name, value] of Object.entries(fixed)) {
      this.setStyleProperty(name, value);
    }
  }

  private setColorProperties(
    prefix: string,
    base: string,
    steps: number[],
  ): void {
    for (const step of steps) {
      this.setStyleProperty(`${prefix}-a${step}`, this.shade(base, step));
    }
  }

  private setStyleProperty(name: string, value: string): void {
    this.document.documentElement.style.setProperty(name, value);
  }

  private shade(base: string, step: number): string {
    if (step >= 50) {
      return chroma.mix(base, '#000000', (step - 50) * 0.02).hex();
    } else {
      return chroma.mix(base, '#ffffff', (50 - step) * 0.02).hex();
    }
  }
}
