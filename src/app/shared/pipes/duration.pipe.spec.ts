import { DurationPipe } from './duration.pipe';

describe('DurationPipe', () => {
  let pipe: DurationPipe;

  beforeEach(() => {
    pipe = new DurationPipe();
  });

  it('should format minutes correctly', () => {
    expect(pipe.transform(30)).toBe('30 min');
    expect(pipe.transform(45)).toBe('45 min');
  });

  it('should format hours correctly', () => {
    expect(pipe.transform(60)).toBe('1h');
    expect(pipe.transform(120)).toBe('2h');
  });

  it('should format hours and minutes correctly', () => {
    expect(pipe.transform(90)).toBe('1h 30min');
    expect(pipe.transform(150)).toBe('2h 30min');
  });

  it('should handle edge cases', () => {
    expect(pipe.transform(0)).toBe('0 min');
    expect(pipe.transform(59)).toBe('59 min');
  });
});
