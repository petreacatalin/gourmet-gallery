import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Badge } from '../models/badge.interface';

@Injectable({
  providedIn: 'root'
})
export class BadgesService {
  private apiUrl = `${environment.baseUrl}`;
  constructor(private http: HttpClient) {}

  getBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/badges`);
  }
  processUserBadges(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/badges/process-badges`, {});
  }
  getUserBadges(userId?: string): Observable<any[]> {
    return this.http.get<Badge[]>(`${this.apiUrl}/badges/user-badges`);
  }

  createBadge(badge: Badge) {
    return this.http.post(`${this.apiUrl}/badges/create-badge`, badge);
  }

  deleteBadge(badgeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${badgeId}`);
  }
}
