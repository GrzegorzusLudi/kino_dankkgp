import {
  Directive,
  effect,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';
import { noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { THEME } from './theme.token';

const { nullish } = P;

@Directive()
export class ThemedDirective {
  private previousTheme: string | null = null;

  private readonly theme = inject(THEME);
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  constructor() {
    effect(() => {
      const theme = this.theme();

      match(this.elementRef.nativeElement.firstElementChild)
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
