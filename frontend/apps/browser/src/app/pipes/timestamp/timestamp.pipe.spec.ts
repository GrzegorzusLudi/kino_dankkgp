import { TimestampPipe } from './timestamp.pipe';

describe('TimestampPipe', () => {
  let pipe: TimestampPipe;

  beforeEach(() => {
    pipe = new TimestampPipe();
  });

  describe('transform', () => {
    it('should format hours, minutes, and seconds separated by colons', () => {
      const date = new Date(2026, 0, 1, 9, 5, 3);

      expect(pipe.transform(date)).toBe('9:5:3');
    });

    it('should not pad single-digit hours, minutes, or seconds', () => {
      const date = new Date(2026, 0, 1, 0, 0, 0);

      expect(pipe.transform(date)).toBe('0:0:0');
    });

    it('should format double-digit hours, minutes, and seconds', () => {
      const date = new Date(2026, 0, 1, 23, 59, 59);

      expect(pipe.transform(date)).toBe('23:59:59');
    });
  });
});
