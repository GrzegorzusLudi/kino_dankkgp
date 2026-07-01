import { Component, computed, effect, inject, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { match } from 'ts-pattern';

import { THEME, Theme, ThemedDirective, ThemeService } from 'theme';
import { SwitchComponent } from 'switch';

@Component({
  selector: 'app-mode-toggle',
  imports: [FontAwesomeModule, SwitchComponent, ReactiveFormsModule],
  hostDirectives: [ThemedDirective],
  templateUrl: './mode-toggle.component.html',
  styleUrls: [
    './mode-toggle.aero.component.scss',
    './mode-toggle.flat.component.scss',
  ],
})
export class ModeToggleComponent {
  private readonly theme: Signal<string> = inject(THEME);
  private readonly themeService: ThemeService = inject(ThemeService);

  readonly faSun = faSun;
  readonly faMoon = faMoon;

  readonly isLight = computed(
    () => this.theme() === Theme.FlatLight || this.theme() === Theme.AeroLight,
  );
  readonly formControl = new FormControl<boolean>(this.isLight(), {
    nonNullable: true,
  });

  constructor() {
    effect(() => {
      this.formControl.setValue(this.isLight(), { emitEvent: false });
    });

    this.formControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((checked: boolean) => {
        this.themeService.changeTheme(this.resolveTheme(checked));
      });
  }

  private resolveTheme(checked: boolean): Theme {
    const currentTheme = this.theme();
    const isFlat =
      currentTheme === Theme.FlatLight || currentTheme === Theme.FlatDark;

    return match({ checked, isFlat })
      .with({ checked: true, isFlat: true }, () => Theme.FlatLight)
      .with({ checked: true, isFlat: false }, () => Theme.AeroLight)
      .with({ checked: false, isFlat: true }, () => Theme.FlatDark)
      .with({ checked: false, isFlat: false }, () => Theme.AeroDark)
      .exhaustive();
  }
}
