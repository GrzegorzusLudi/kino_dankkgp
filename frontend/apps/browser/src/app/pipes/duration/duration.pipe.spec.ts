import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  describe('transform', () => {
    it('should return "0:00" for null', () => {
      expect(pipe.transform(null)).toBe('0:00');
    });

    it('should return "0:00" for undefined', () => {
      const { seconds } = {} as { seconds?: number };

      expect(pipe.transform(seconds)).toBe('0:00');
    });

    it('should return "0:00" for values less than 1', () => {
      expect(pipe.transform(0)).toBe('0:00');
    });

    it('should format seconds under a minute with a padded seconds segment', () => {
      expect(pipe.transform(45)).toBe('0:45');
    });

    it('should format exactly one minute', () => {
      expect(pipe.transform(60)).toBe('1:00');
    });

    it('should format minutes and seconds with a padded seconds segment', () => {
      expect(pipe.transform(125)).toBe('2:05');
    });
  });
});
