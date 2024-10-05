import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden-page',
  templateUrl: './forbidden-page.component.html',
  styleUrls: ['./forbidden-page.component.scss']
})
export class ForbiddenPageComponent implements OnInit {

  private lastFocusedElement: HTMLElement | null = null;

  constructor(private router: Router, private elementRef: ElementRef) {}

  ngOnInit() {
    // Save the currently focused element
    this.lastFocusedElement = document.activeElement as HTMLElement;

    // Focus the modal when it is displayed
    const modal = this.elementRef.nativeElement.querySelector('.modal-content');
    if (modal) {
      modal.focus();
    }
   
  }

  ngOnDestroy() {
    // Return focus to the previous element when the modal is closed
    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
  }
  redirectToMainPage() {
    this.router.navigate(['/mainpage']);
  }
}
