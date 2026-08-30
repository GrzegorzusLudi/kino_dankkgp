import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { match } from 'ts-pattern';

import { SwitchComponent } from 'switch';
import { THEME, Theme, ThemedDirective, ThemeService } from 'theme';

@Component({
  selector: 'app-mode-toggle',
  imports: [FontAwesomeModule, SwitchComponent, ReactiveFormsModule],
  hostDirectives: [ThemedDirective],
  templateUrl: './mode-toggle.component.html',
  styleUrls: [
    './mode-toggle.aero.component.scss',
    './mode-toggle.flat.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeToggleComponent {
  protected readonly faSun = faSun;
  protected readonly faMoon = faMoon;

  protected readonly formControl = new FormControl<boolean>(false, {
    nonNullable: true,
  });

  private readonly theme = inject(THEME);
  private readonly themeService = inject(ThemeService);

  private readonly isLight = computed(
    () => this.theme() === Theme.FlatLight || this.theme() === Theme.AeroLight,
  );

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
