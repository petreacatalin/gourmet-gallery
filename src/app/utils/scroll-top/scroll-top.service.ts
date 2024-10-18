import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollTopService {

  constructor() {}

  getScrollPosition(): Observable<number> {
    return fromEvent(window, 'scroll').pipe(
      throttleTime(200),
      map(() => window.scrollY || document.documentElement.scrollTop)
    );
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
