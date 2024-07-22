import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlobStorageService {

  private baseUrl = 'https://localhost:7201/api'; // Adjust this URL as per your backend API

  constructor(private http: HttpClient) {}

  uploadImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/upload`, formData);
  }
}
