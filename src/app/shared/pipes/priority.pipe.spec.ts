import { PriorityPipe } from './priority.pipe';

describe('PriorityPipe', () => {
  let pipe: PriorityPipe;

  beforeEach(() => {
    pipe = new PriorityPipe();
  });

  it('should translate priority values correctly', () => {
    expect(pipe.transform('low')).toBe('Faible');
    expect(pipe.transform('medium')).toBe('Moyenne');
    expect(pipe.transform('high')).toBe('Haute');
  });

  it('should return original value for unknown priority', () => {
    expect(pipe.transform('unknown' as 'low' | 'medium' | 'high')).toBe('unknown');
  });
});
