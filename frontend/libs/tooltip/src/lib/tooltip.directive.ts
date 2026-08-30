import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  Renderer2,
} from '@angular/core';
import { castArray, noop } from 'lodash-es';
import { match, P } from 'ts-pattern';

import { ThemeService } from 'theme';
import {
  TOOLTIP_CLASS,
  TOOLTIP_GAP,
  TOOLTIP_VIEWPORT_MARGIN,
  TOOLTIP_Z_INDEX,
} from './tooltip.consts';
import { TooltipCoordinates } from './tooltip-coordinates.interface';
import { TooltipPosition } from './tooltip-position.type';

const { nullish } = P;

@Directive({
  selector: '[libTooltip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
  },
})
export class TooltipDirective {
  readonly libTooltip = input<string | string[]>('');
  readonly position = input<TooltipPosition>('top');

  private tooltipElement: HTMLElement | null = null;

  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly themeService = inject(ThemeService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => this.destroyTooltip());
  }

  protected show(): void {
    const lines = this.normalizeLines();

    match(lines.length > 0)
      .with(true, () => this.createTooltip(lines))
      .otherwise(noop);
  }

  protected hide(): void {
    this.destroyTooltip();
  }

  private normalizeLines(): string[] {
    return castArray(this.libTooltip()).filter(Boolean);
  }

  private createTooltip(lines: readonly string[]): void {
    this.destroyTooltip();

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, TOOLTIP_CLASS);
    this.renderer.addClass(this.tooltipElement, this.position());
    this.renderer.addClass(this.tooltipElement, this.themeService.theme());

    lines.forEach((line) => {
      const lineElement: HTMLElement = this.renderer.createElement('div');
      this.renderer.appendChild(lineElement, this.renderer.createText(line));
      this.renderer.appendChild(this.tooltipElement, lineElement);
    });

    this.renderer.appendChild(document.body, this.tooltipElement);

    this.positionTooltip();
  }

  private positionTooltip(): void {
    match(this.tooltipElement)
      .with(nullish, noop)
      .otherwise((tooltipElement) => {
        this.renderer.setStyle(tooltipElement, 'position', 'fixed');
        this.renderer.setStyle(tooltipElement, 'top', '0');
        this.renderer.setStyle(tooltipElement, 'left', '0');
        this.renderer.setStyle(tooltipElement, 'white-space', 'nowrap');
        this.renderer.setStyle(tooltipElement, 'pointer-events', 'none');
        this.renderer.setStyle(tooltipElement, 'z-index', TOOLTIP_Z_INDEX);

        const hostRect = this.resolveHostElement().getBoundingClientRect();
        const tooltipRect = tooltipElement.getBoundingClientRect();

        const { top, left } = this.clampTooltipCoordinates(
          this.calculateTooltipCoordinates(
            this.position(),
            hostRect,
            tooltipRect,
          ),
          tooltipRect,
          { width: window.innerWidth, height: window.innerHeight },
        );

        this.renderer.setStyle(tooltipElement, 'top', `${top}px`);
        this.renderer.setStyle(tooltipElement, 'left', `${left}px`);
      });
  }

  private resolveHostElement(): HTMLElement {
    const nativeElement = this.elementRef.nativeElement as HTMLElement;

    return match(nativeElement.tagName.includes('-'))
      .with(
        true,
        () => (nativeElement.firstElementChild ?? nativeElement) as HTMLElement,
      )
      .otherwise(() => nativeElement);
  }

  private calculateTooltipCoordinates(
    position: TooltipPosition,
    hostRect: Readonly<DOMRect>,
    tooltipRect: Readonly<DOMRect>,
  ): TooltipCoordinates {
    const centeredLeft =
      hostRect.left + (hostRect.width - tooltipRect.width) / 2;
    const centeredTop =
      hostRect.top + (hostRect.height - tooltipRect.height) / 2;

    return match(position)
      .with('top', () => ({
        top: hostRect.top - tooltipRect.height - TOOLTIP_GAP,
        left: centeredLeft,
      }))
      .with('bottom', () => ({
        top: hostRect.bottom + TOOLTIP_GAP,
        left: centeredLeft,
      }))
      .with('left', () => ({
        top: centeredTop,
        left: hostRect.left - tooltipRect.width - TOOLTIP_GAP,
      }))
      .with('right', () => ({
        top: centeredTop,
        left: hostRect.right + TOOLTIP_GAP,
      }))
      .exhaustive();
  }

  private clampTooltipCoordinates(
    coordinates: Readonly<TooltipCoordinates>,
    tooltipSize: { readonly width: number; readonly height: number },
    viewport: { readonly width: number; readonly height: number },
  ): TooltipCoordinates {
    const maxLeft =
      viewport.width - tooltipSize.width - TOOLTIP_VIEWPORT_MARGIN;
    const maxTop =
      viewport.height - tooltipSize.height - TOOLTIP_VIEWPORT_MARGIN;

    return {
      left: Math.max(
        TOOLTIP_VIEWPORT_MARGIN,
        Math.min(coordinates.left, maxLeft),
      ),
      top: Math.max(TOOLTIP_VIEWPORT_MARGIN, Math.min(coordinates.top, maxTop)),
    };
  }

  private destroyTooltip(): void {
    match(this.tooltipElement)
      .with(nullish, noop)
      .otherwise((tooltipElement) => {
        this.renderer.removeChild(document.body, tooltipElement);
        this.tooltipElement = null;
      });
  }
}
