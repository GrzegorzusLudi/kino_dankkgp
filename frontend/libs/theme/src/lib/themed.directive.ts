import {
  Directive,
  effect,
  ElementRef,
  inject,
  Renderer2,
  Signal,
} from '@angular/core';
import { match, P } from 'ts-pattern';
import { noop } from 'lodash-es';

import { THEME } from './theme.token';

const { nullish } = P;

@Directive()
export class ThemedDirective {
  protected readonly theme: Signal<string> = inject(THEME);

  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  private previousTheme: string | null = null;

  constructor() {
    effect(() => {
      const theme = this.theme();

      match(this.elementRef.nativeElement.firstElementChild as Element | null)
        .with(nullish, noop)
        .otherwise((firstChild) => {
          match(this.previousTheme)
            .with(nullish, noop)
            .otherwise((previousTheme) =>
              this.renderer.removeClass(firstChild, previousTheme),
            );

          this.renderer.addClass(firstChild, theme);
          this.previousTheme = theme;
        });
    });
  }
}
