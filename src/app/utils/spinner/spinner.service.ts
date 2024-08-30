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
    if (this.hideSpinnerTimer) {
      clearTimeout(this.hideSpinnerTimer);
    }

    this.hideSpinnerTimer = setTimeout(() => {
      this.spinnerSubject.next(false);
    }, 500); 
  }
}