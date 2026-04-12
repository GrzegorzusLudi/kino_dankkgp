import { ThemeService } from 'theme';
import { ThemedDirective } from './themed.directive';

describe('ThemedDirective', () => {
  it('should create an instance', () => {
    const directive = new ThemedDirective(new ThemeService());
    expect(directive).toBeTruthy();
  });
});
