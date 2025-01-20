import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Badge } from 'src/app/models/badge.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  private apiUrl = `${environment.baseUrl}/newsletter`;
   constructor(private http: HttpClient) {}
 
 
   subscribeToNewsletter(email: string): Observable<void> {
     return this.http.post<void>(`${this.apiUrl}/subscribe`, {email});
   }

   unsubscribeFromNewsletter(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/unsubscribe`, {email});
  }
}
