import { Directive, Input, Inject, HostListener, Renderer, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Directive({
    selector: '[scrollPoint]'
})
export class ScrollPointDirective {
    
    @Input() scrollPoint: number;
    originalWidth: string;
    scrollMin:number = -1;
    active:boolean = false;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer,
        private el: ElementRef
    ) {  }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const windowScroll = this.document.body.scrollTop;
        let topLimit = this.el.nativeElement.getBoundingClientRect().top;
        // if (windowScroll > this.scrollPoint) {
        if(topLimit <= 60 && !this.active){
            //add class to the native element
            this.settingSticky(true);
            if(this.scrollMin == -1){
                this.scrollMin = windowScroll;
                this.active = true;
            }
        } else if(this.scrollMin != -1 && windowScroll > this.scrollMin){
            this.settingSticky(true);
        } else {
            //remove class from native element
            this.settingSticky(false);
        }
    }

    settingSticky(value){
        this.renderer.setElementClass(this.el.nativeElement, 'sticky-nav', value);
        if(value){
            this.el.nativeElement.style.width = this.originalWidth+'px';
            this.el.nativeElement.style.top = '60px';
        }else{
            if(this.active)
                this.el.nativeElement.style.width = '100%';
            this.originalWidth = this.el.nativeElement.offsetWidth;
            this.active = false;
            this.scrollMin = -1;
        }
    }
}