// toast.component.ts
import { Component, OnInit } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  toasts: { message: string, type: 'success' | 'error' }[] = [];

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toast$.subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => {
        const toastElements = document.querySelectorAll('.toast');
        toastElements.forEach((toastElement: any) => {
          toastElement.classList.add('fade-out');
          setTimeout(() => {
            this.toasts.shift(); // Remove toast from array
          }, 500); // Match this time with the CSS transition duration
        });
      }, 5000); // Display toast for 5 seconds
    });
  }
}
