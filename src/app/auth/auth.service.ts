import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApplicationUser } from '../models/applicationUser.interface';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../models/authResponse.interface';
import { Login } from '../models/login';
import { jwtDecode } from 'jwt-decode';
import { ResetPassword } from '../models/resetPassword.interface';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<ApplicationUser | null> = new BehaviorSubject<ApplicationUser | null>(null);
  public user$: Observable<ApplicationUser | null> = this.userSubject.asObservable();
  private baseUrl = environment.baseUrl;
  private tokenKey = 'token';
  public userCurrently?: ApplicationUser | undefined;
  private isloggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  register(user:ApplicationUser): Observable<any> {
    return this.http.post(`${this.baseUrl}/Account/register`, user);
  }
  

  login(login: Login) : Observable<AuthResponse> {
   return this.http.post<any>(`${this.baseUrl}/Account/login`, login).pipe(
      map((response) => {        
          localStorage.setItem(this.tokenKey, response.token); // Store JWT token in local storage
        
          this.isloggedIn.next(true);
          this.loadUserDetails();
        return response;
      })
    );
  }

  loggedIn(): Observable<boolean> {
    return this.isloggedIn.asObservable();
  }

  loadUserDetails(): void {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userDetail: ApplicationUser = {
        id: decodedToken.nameid,
        email: decodedToken.email,
        lastName: decodedToken.given_name,
        firstName: decodedToken.family_name,
      };
      this.userCurrently = userDetail;
    } else {
      //this.userSubject.next(null);
      this.isloggedIn.next(false);
    }
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
    this.isloggedIn.next(false);
    //this.userSubject.next(null);
  }
 

  forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Account/forgot-password`, data);
  }

  resetPassword(email: string, token: string, resetPassword: ResetPassword): Observable<any> {
    return this.http.post(`${this.baseUrl}/Account/reset-password`, resetPassword     
    );
  }

  getProfile(): Observable<ApplicationUser> {
    return this.http.get<ApplicationUser>(`${this.baseUrl}/Account/profile`);
  }

  updateProfile(profileData: Partial<ApplicationUser>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Account/profile`, profileData);
  }

  getFriends(): Observable<ApplicationUser[]> {
    return this.http.get<ApplicationUser[]>(`${this.baseUrl}/Account/friends`);
  }

  addFriend(friendId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Account/add-friend/${friendId}`, null);
  }

  acceptFriend(friendId: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Account/accept-friend/${friendId}`, null);
  }

}
