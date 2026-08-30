import { inject, Injectable, Signal, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import chroma from 'chroma-js';
import { match, P } from 'ts-pattern';

import { Theme } from './theme.enum';
import { THEME_FIXED_PROPERTIES } from './theme.config';
import {
  BLACK,
  COLOR_STEP_MIX_RATIO,
  COLOR_STEPS,
  DARK_PRIMARY_MIX_RATIO,
  DARK_PRIMARY_VARIABLE_PREFIX,
  DEFAULT_DANGER,
  DEFAULT_GRAY,
  DEFAULT_PRIMARY,
  DEFAULT_SUCCESS,
  GRAY_VARIABLE_PREFIX,
  LIGHT_DANGER_VARIABLE_PREFIX,
  LIGHT_PRIMARY_VARIABLE_PREFIX,
  LIGHT_SUCCESS_VARIABLE_PREFIX,
  MIDDLE_COLOR_STEP,
  PREFERS_DARK_COLOR_SCHEME_QUERY,
  THEME_STORAGE_KEY,
  WHITE,
} from './theme.consts';

const { number } = P;
const { gte } = number;

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themeSignal = signal<Theme>(this.resolveInitialTheme());

  readonly theme: Signal<string> = this.themeSignal.asReadonly();

  private readonly document = inject(DOCUMENT);

  constructor() {
    this.generate(DEFAULT_PRIMARY, DEFAULT_SUCCESS, DEFAULT_DANGER);
  }

  changeTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }

  private resolveInitialTheme(): Theme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    const isValidStored =
      Boolean(stored) && Object.values(Theme).includes(stored as Theme);
    const prefersDark = window.matchMedia(
      PREFERS_DARK_COLOR_SCHEME_QUERY,
    ).matches;

    return match({ isValidStored, stored, prefersDark })
      .with({ isValidStored: true }, ({ stored }) => stored as Theme)
      .with({ prefersDark: true }, () => Theme.FlatDark)
      .otherwise(() => Theme.FlatLight);
  }

  private generate(primary: string, success: string, danger: string): void {
    const darkPrimary = chroma
      .mix(DEFAULT_PRIMARY, BLACK, DARK_PRIMARY_MIX_RATIO)
      .hex();

    this.setColorProperties(LIGHT_PRIMARY_VARIABLE_PREFIX, primary);
    this.setColorProperties(DARK_PRIMARY_VARIABLE_PREFIX, darkPrimary);
    this.setColorProperties(LIGHT_SUCCESS_VARIABLE_PREFIX, success);
    this.setColorProperties(LIGHT_DANGER_VARIABLE_PREFIX, danger);
    this.setColorProperties(GRAY_VARIABLE_PREFIX, DEFAULT_GRAY);

    Object.entries(THEME_FIXED_PROPERTIES).forEach(([name, value]) =>
      this.setStyleProperty(name, value),
    );
  }

  private setColorProperties(prefix: string, base: string): void {
    COLOR_STEPS.forEach((step) =>
      this.setStyleProperty(`${prefix}-a${step}`, this.shadeColor(base, step)),
    );
  }

  private setStyleProperty(name: string, value: string): void {
    this.document.documentElement.style.setProperty(name, value);
  }

  private shadeColor(base: string, step: number): string {
    return match(step)
      .with(gte(MIDDLE_COLOR_STEP), (value) =>
        chroma
          .mix(base, BLACK, (value - MIDDLE_COLOR_STEP) * COLOR_STEP_MIX_RATIO)
          .hex(),
      )
      .otherwise((value) =>
        chroma
          .mix(base, WHITE, (MIDDLE_COLOR_STEP - value) * COLOR_STEP_MIX_RATIO)
          .hex(),
      );
  }
}
