import { Directive, Input, Inject, HostListener, Renderer, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Directive({
    selector: '[scrollPoint]'
})
export class ScrollPointDirective {
    
    @Input() scrollPoint: number;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer,
        private el: ElementRef
    ) {  }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const windowScroll = this.document.body.scrollTop;
        if (windowScroll > this.scrollPoint) {
            //add class to the native element
            this.renderer.setElementClass(this.el.nativeElement, 'sticky-nav-basis', true);
            this.el.nativeElement.style.width = '1px';
        } else {
            //remove class from native element
            this.renderer.setElementClass(this.el.nativeElement, 'sticky-nav-basis', false);
        }

    }

}