import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getToken()) {
      const cloned = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + this.authService.getToken()
        )
      });     
      return next.handle(cloned)
    }
    return next.handle(request);
  }
}