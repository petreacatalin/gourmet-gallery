import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { User } from './models/user.interface';
import { environment } from 'src/environments/environment';
import { AuthResponse } from './models/authResponse.interface';
import { Login } from './models/login';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();
  private baseUrl = environment.baseUrl;
  private tokenKey = 'token';
  constructor(private http: HttpClient) { }

  register(user:User): Observable<any> {
    return this.http.post(`${this.baseUrl}/Account/register`, user);
  }
  

  login(login: Login) : Observable<AuthResponse> {
   return this.http.post<any>(`${this.baseUrl}/Account/login`, login).pipe(
      map((response) => {        
          localStorage.setItem(this.tokenKey, response.token); // Store JWT token in local storage
        
        return response;
      })
    );
  }

  loadUserDetails(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userDetail: User = {
        id: decodedToken.nameid,
        email: decodedToken.email
      };
      this.userSubject.next(userDetail);
    } else {
      this.userSubject.next(null);
    }
  }

  getUserDetail(): Observable<User | null> {
    return this.user$;
  }

  getToken = (): string | null => localStorage.getItem(this.tokenKey) || '';
  
  isLoggedIn =(): boolean =>{
    const token = this.getToken();
    if(!token){
      return false
    }
    return !this.isTokenExpired();
  }
  
  isTokenExpired(){
    const token= this.getToken();
    if(!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() > decoded['exp']! * 1000;
    if(isTokenExpired) this.logout();
    return isTokenExpired;
  }
  
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }
 

  // getUserDetail = () => {
  //   const token = this.getToken();
  //   if(!token) return true;
  //   const decodedToken: any = jwtDecode(token);
  //   const userDetail = {
  //     id: decodedToken.nameid,
  //     email: decodedToken.email,

  //   }
  //   return userDetail;
  // }

  updateProfile(profileData: Partial<User>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Account/profile`, profileData);
  }

  getFriends(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/Account/friends`);
  }

  addFriend(friendId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Account/add-friend/${friendId}`, null);
  }

  acceptFriend(friendId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Account/accept-friend/${friendId}`, null);
  }

}
