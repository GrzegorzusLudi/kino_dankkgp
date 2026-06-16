import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { HeaderComponent } from './header.component';

@Component({
  template: '<lib-header>Projected Text</lib-header>',
  imports: [HeaderComponent],
})
class HostComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let header: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, HostComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    header = fixture.nativeElement.querySelector('.header');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('structure', () => {
    it('should render the header container element', () => {
      expect(header).not.toBeNull();
    });

    it('should render a span inside the header', () => {
      expect(header.querySelector('span')).not.toBeNull();
    });
  });

  describe('content projection', () => {
    let hostFixture: ComponentFixture<HostComponent>;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(HostComponent);
      hostFixture.detectChanges();
    });

    it('should project content into the header span', () => {
      const span: HTMLElement = hostFixture.nativeElement.querySelector('.header span');
      expect(span.textContent).toContain('Projected Text');
    });
  });
});
