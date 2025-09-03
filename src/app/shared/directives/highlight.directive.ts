import { Directive, ElementRef, Input, OnInit, Renderer2, inject } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnInit {
  @Input() appHighlight = 'yellow';
  @Input() appHighlightDelay = 0;

  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnInit() {
    setTimeout(() => {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', this.appHighlight);
    }, this.appHighlightDelay);
  }
}
