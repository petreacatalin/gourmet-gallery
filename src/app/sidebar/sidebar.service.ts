import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public isCollapsedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public isCollapsed$ = this.isCollapsedSubject.asObservable();

  toggleSidebar(): void {
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
  }
}