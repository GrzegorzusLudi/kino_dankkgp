import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;
  let nativeInput: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Test label');
    fixture.detectChanges();
    nativeInput = fixture.nativeElement.querySelector('input');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('structure', () => {
    it('should render the input container element', () => {
      expect(fixture.nativeElement.querySelector('.input')).not.toBeNull();
    });

    it('should render a native input inside the container', () => {
      expect(nativeInput).not.toBeNull();
    });
  });

  describe('label', () => {
    it('should reflect the label input as the placeholder', () => {
      expect(nativeInput.placeholder).toBe('Test label');
    });

    it('should update the placeholder when the label changes', () => {
      fixture.componentRef.setInput('label', 'New label');
      fixture.detectChanges();
      expect(nativeInput.placeholder).toBe('New label');
    });
  });

  describe('reactive forms', () => {
    it('should not be disabled by default', () => {
      expect(nativeInput.disabled).toBe(false);
    });

    it('should disable the native input when setDisabledState is called with true', () => {
      component.setDisabledState!(true);
      fixture.detectChanges();
      expect(nativeInput.disabled).toBe(true);
    });

    it('should enable the native input when setDisabledState is called with false', () => {
      component.setDisabledState!(true);
      fixture.detectChanges();
      component.setDisabledState!(false);
      fixture.detectChanges();
      expect(nativeInput.disabled).toBe(false);
    });

    it('should update the native input value via writeValue', () => {
      component.writeValue('hello');
      expect(nativeInput.value).toBe('hello');
    });

    it('should stringify an object value', () => {
      component.value = { key: 'val' } as unknown as string;
      expect(component.value).toBe('{"key":"val"}');
    });

    it('should convert null to a string', () => {
      component.value = null;
      expect(component.value).toBe('null');
    });

    it('should call the registered onChange callback with the input value on change', () => {
      const changedSpy = vi.fn();
      component.registerOnChange(changedSpy);
      nativeInput.value = 'typed';
      nativeInput.dispatchEvent(new Event('change'));
      expect(changedSpy).toHaveBeenCalledWith('typed');
    });

    it('should call the registered onTouched callback on blur', () => {
      const touchedSpy = vi.fn();
      component.registerOnTouched(touchedSpy);
      nativeInput.dispatchEvent(new Event('blur'));
      expect(touchedSpy).toHaveBeenCalled();
    });
  });
});
