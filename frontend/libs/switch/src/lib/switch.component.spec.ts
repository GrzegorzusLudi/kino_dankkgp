import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchComponent } from './switch.component';

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;
  let checkbox: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('structure', () => {
    it('should render the switch label element', () => {
      expect(fixture.nativeElement.querySelector('.switch')).not.toBeNull();
    });

    it('should render a checkbox inside the switch', () => {
      expect(checkbox).not.toBeNull();
    });

    it('should render the slider span', () => {
      expect(fixture.nativeElement.querySelector('.slider.round')).not.toBeNull();
    });
  });

  describe('reactive forms', () => {
    it('should not be disabled by default', () => {
      expect(checkbox.disabled).toBe(false);
    });

    it('should disable the checkbox when setDisabledState is called with true', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(checkbox.disabled).toBe(true);
    });

    it('should enable the checkbox when setDisabledState is called with false', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      component.setDisabledState(false);
      fixture.detectChanges();
      expect(checkbox.disabled).toBe(false);
    });

    it('should be unchecked by default', () => {
      expect(checkbox.checked).toBe(false);
    });

    it('should check the checkbox when writeValue is called with true', () => {
      component.writeValue(true);
      fixture.detectChanges();
      expect(checkbox.checked).toBe(true);
    });

    it('should uncheck the checkbox when writeValue is called with false', () => {
      component.writeValue(true);
      fixture.detectChanges();
      component.writeValue(false);
      fixture.detectChanges();
      expect(checkbox.checked).toBe(false);
    });

    it('should call the registered onChange callback with true when the checkbox is checked', () => {
      const changedSpy = vi.fn();
      component.registerOnChange(changedSpy);
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));
      expect(changedSpy).toHaveBeenCalledWith(true);
    });

    it('should call the registered onChange callback with false when the checkbox is unchecked', () => {
      const changedSpy = vi.fn();
      component.registerOnChange(changedSpy);
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change'));
      expect(changedSpy).toHaveBeenCalledWith(false);
    });

    it('should call the registered onTouched callback on blur', () => {
      const touchedSpy = vi.fn();
      component.registerOnTouched(touchedSpy);
      checkbox.dispatchEvent(new Event('blur'));
      expect(touchedSpy).toHaveBeenCalled();
    });
  });
});
