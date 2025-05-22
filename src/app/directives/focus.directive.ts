import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[focus]',
})
export class FocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.el.nativeElement.focus();
  }
}
