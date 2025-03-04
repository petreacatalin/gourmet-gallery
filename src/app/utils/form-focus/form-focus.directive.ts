
import {
    Directive,
    ElementRef,
    HostListener,
    AfterViewInit,
  } from '@angular/core';
  
  @Directive({
    selector: 'form', // Apply this directive to all <form> elements
  })
  export class FormFocusDirective implements AfterViewInit {
    focusables = ['input', 'select', 'textarea'];
  
    constructor(private element: ElementRef) {}
  
    ngAfterViewInit() {
      // Automatically focus the first input field when the form loads
      const input = this.element.nativeElement.querySelector(
        this.focusables.join(',')
      );
      if (input) {
        input.focus();
      }
    }
  
    @HostListener('submit')
    submit() {
      // Focus the first invalid input field when the form is submitted
      const input = this.element.nativeElement.querySelector(
        this.focusables.map((x) => `${x}.ng-invalid`).join(',')
      );
      if (input) {
        input.focus();
      }
    }
  }
  