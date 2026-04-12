import { ThemeService } from '../../services/theme/theme.service';
import { ThemedDirective } from './themed.directive';

describe('ThemedDirective', () => {
  it('should create an instance', () => {
    const directive = new ThemedDirective(new ThemeService());
    expect(directive).toBeTruthy();
  });
});
