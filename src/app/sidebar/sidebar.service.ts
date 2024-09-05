import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public isCollapsedSubject = new BehaviorSubject<boolean>(true);
  isCollapsed$ = this.isCollapsedSubject.asObservable();

  toggleSidebar(): void {
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
  }
}
