import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty errors', () => {
    expect(service.errors$().length).toBe(0);
  });

  it('should show error notification', () => {
    service.showError('Test error message');

    const errors = service.errors$();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('Test error message');
    expect(errors[0].type).toBe('error');
  });

  it('should show warning notification', () => {
    service.showWarning('Test warning message');

    const errors = service.errors$();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('Test warning message');
    expect(errors[0].type).toBe('warning');
  });

  it('should show info notification', () => {
    service.showInfo('Test info message');

    const errors = service.errors$();
    expect(errors.length).toBe(1);
    expect(errors[0].message).toBe('Test info message');
    expect(errors[0].type).toBe('info');
  });

  it('should generate unique IDs for notifications', () => {
    service.showError('Error 1');
    service.showError('Error 2');

    const errors = service.errors$();
    expect(errors.length).toBe(2);
    expect(errors[0].id).not.toBe(errors[1].id);
  });

  it('should remove specific notification', () => {
    service.showError('Test error');
    const errors = service.errors$();
    const errorId = errors[0].id;

    service.removeError(errorId);

    expect(service.errors$().length).toBe(0);
  });

  it('should clear all notifications', () => {
    service.showError('Error 1');
    service.showWarning('Warning 1');
    service.showInfo('Info 1');

    expect(service.errors$().length).toBe(3);

    service.clearAll();

    expect(service.errors$().length).toBe(0);
  });

  it('should auto-remove notifications after 5 seconds', done => {
    service.showError('Test error');

    expect(service.errors$().length).toBe(1);

    setTimeout(() => {
      expect(service.errors$().length).toBe(0);
      done();
    }, 6000); // Un peu plus que 5 secondes pour être sûr
  }, 10000); // Timeout de 10 secondes pour ce test
});
