// zoom.directive.ts
import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appZoom]'
})
export class ZoomDirective {
  private scale = 1; // Initial scale
  private readonly scaleStep = 0.1; // Step by which the scale changes

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  @HostListener('wheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    
    if (event.deltaY < 0) {
      this.scale += this.scaleStep; // Zoom in
    } else {
      this.scale -= this.scaleStep; // Zoom out
    }
    
    this.applyScale();
  }

  private applyScale() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `scale(${this.scale})`);
  }
}
