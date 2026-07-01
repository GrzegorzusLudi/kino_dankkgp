import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { match, P } from 'ts-pattern';
import { noop } from 'lodash-es';

import { ThemeService } from 'theme';

const { nullish } = P;

@Directive({
  selector: '[libTooltip]',
})
export class TooltipDirective implements OnDestroy {
  readonly libTooltip = input<string | string[]>('');
  readonly position = input<'top' | 'bottom' | 'left' | 'right'>('top');

  private tooltipElement: HTMLElement | null = null;

  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly themeService = inject(ThemeService);

  @HostListener('mouseenter')
  show(): void {
    const lines = this.normalizeLines();

    match(lines.length > 0)
      .with(true, () => this.createTooltip(lines))
      .otherwise(noop);
  }

  @HostListener('mouseleave')
  hide(): void {
    this.destroyTooltip();
  }

  ngOnDestroy(): void {
    this.destroyTooltip();
  }

  private normalizeLines(): string[] {
    const tooltip = this.libTooltip();
    return (Array.isArray(tooltip) ? tooltip : [tooltip]).filter(Boolean);
  }

  private createTooltip(lines: string[]): void {
    this.destroyTooltip();

    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.addClass(this.tooltipElement, this.position());
    this.renderer.addClass(this.tooltipElement, this.themeService.theme());

    lines.forEach((line) => {
      const lineEl: HTMLElement = this.renderer.createElement('div');
      this.renderer.appendChild(lineEl, this.renderer.createText(line));
      this.renderer.appendChild(this.tooltipElement, lineEl);
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
        this.renderer.setStyle(tooltipElement, 'z-index', '9999');

        const nativeEl = this.elementRef.nativeElement as HTMLElement;
        const isCustomElement = nativeEl.tagName.includes('-');
        const hostEl = isCustomElement
          ? ((nativeEl.firstElementChild ?? nativeEl) as HTMLElement)
          : nativeEl;
        const hostRect: DOMRect = hostEl.getBoundingClientRect();
        const tooltipRect: DOMRect = tooltipElement.getBoundingClientRect();
        const gap = 8;
        const margin = 4;

        const { top, left } = this.clampTooltipCoordinates(
          this.calculateTooltipCoordinates(
            this.position(),
            hostRect,
            tooltipRect,
            gap,
          ),
          tooltipRect,
          { width: window.innerWidth, height: window.innerHeight },
          margin,
        );

        this.renderer.setStyle(tooltipElement, 'top', `${top}px`);
        this.renderer.setStyle(tooltipElement, 'left', `${left}px`);
      });
  }

  private calculateTooltipCoordinates(
    position: 'top' | 'bottom' | 'left' | 'right',
    hostRect: DOMRect,
    tooltipRect: DOMRect,
    gap: number,
  ): { top: number; left: number } {
    return match(position)
      .with('top', () => ({
        top: hostRect.top - tooltipRect.height - gap,
        left: hostRect.left + (hostRect.width - tooltipRect.width) / 2,
      }))
      .with('bottom', () => ({
        top: hostRect.bottom + gap,
        left: hostRect.left + (hostRect.width - tooltipRect.width) / 2,
      }))
      .with('left', () => ({
        top: hostRect.top + (hostRect.height - tooltipRect.height) / 2,
        left: hostRect.left - tooltipRect.width - gap,
      }))
      .with('right', () => ({
        top: hostRect.top + (hostRect.height - tooltipRect.height) / 2,
        left: hostRect.right + gap,
      }))
      .exhaustive();
  }

  private clampTooltipCoordinates(
    coordinates: { top: number; left: number },
    tooltipSize: { width: number; height: number },
    viewport: { width: number; height: number },
    margin: number,
  ): { top: number; left: number } {
    const maxLeft = viewport.width - tooltipSize.width - margin;
    const maxTop = viewport.height - tooltipSize.height - margin;

    return {
      left: Math.max(margin, Math.min(coordinates.left, maxLeft)),
      top: Math.max(margin, Math.min(coordinates.top, maxTop)),
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
