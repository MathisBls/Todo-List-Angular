import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';
import { Component } from '@angular/core';

@Component({
  template: '<div [appHighlight]="color" [appHighlightDelay]="delay">Test</div>',
  imports: [HighlightDirective],
  standalone: true,
})
class TestComponent {
  color = 'yellow';
  delay = 0;
}

describe('HighlightDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
  });

  it('should apply highlight color', done => {
    component.color = 'red';
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');

    setTimeout(() => {
      expect(element.style.backgroundColor).toBe('red');
      done();
    }, 10);
  });

  it('should apply highlight with delay', done => {
    component.color = 'blue';
    component.delay = 100;
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');

    // Vérifier qu'il n'y a pas de couleur immédiatement
    expect(element.style.backgroundColor).toBe('');

    // Vérifier qu'il y a une couleur après le délai
    setTimeout(() => {
      expect(element.style.backgroundColor).toBe('blue');
      done();
    }, 150);
  });

  it('should use default yellow color', done => {
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div');

    setTimeout(() => {
      expect(element.style.backgroundColor).toBe('yellow');
      done();
    }, 10);
  });
});
