import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<any>();
  toast$ = this.toastSubject.asObservable();

  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastSubject.next({ message, type });
    
  }
}
