import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Badge } from '../models/badge.interface';

@Injectable({
  providedIn: 'root',
})
export class UserBadgeService {
  private apiUrl = `${environment.baseUrl}`;
  constructor(private http: HttpClient) {}


  processUserBadges(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/badges/process-badges`, {});
  }

  getUserBadges(userId?: string): Observable<any[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/badges/user-badges`);
  }
  getBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/badges`);
  }
}
