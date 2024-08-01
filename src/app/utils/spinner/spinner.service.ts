import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject = new BehaviorSubject<boolean>(false);
  private hideSpinnerTimer: any = null;
  spinnerState = this.spinnerSubject.asObservable();

  show() {
    this.spinnerSubject.next(true);
  }

  hide() {
    // Clear any existing timer
    if (this.hideSpinnerTimer) {
      clearTimeout(this.hideSpinnerTimer);
    }

    // Set a minimum display time (e.g., 500 ms)
    this.hideSpinnerTimer = setTimeout(() => {
      this.spinnerSubject.next(false);
    }, 500); // Adjust the delay as needed
  }
}