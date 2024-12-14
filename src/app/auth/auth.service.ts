import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApplicationUser } from '../models/applicationUser.interface';
import { environment } from 'src/environments/environment';
import { AuthResponse } from '../models/authResponse.interface';
import { Login } from '../models/login';
import { jwtDecode } from 'jwt-decode';
import { ResetPassword } from '../models/resetPassword.interface';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';  // Import this

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<ApplicationUser | null> = new BehaviorSubject<ApplicationUser | null>(null);
  public user$: Observable<ApplicationUser | null> = this.userSubject.asObservable();
  private baseUrl = environment.baseUrl;
  private tokenKey = 'token';
  public userCurrently?: ApplicationUser | undefined | null;
  private isloggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient,socialAuthService: SocialAuthService) {
    this.initializeUserState();
  }

  private initializeUserState(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired()) {
      this.isloggedIn.next(true);
      this.loadUserDetails();
      setTimeout(() => {
        this.loadProfileData();
        
      }, 110);

    } else {
      this.logout();
      this.isloggedIn.next(false);
    }
  }

  register(user:ApplicationUser): Observable<any> {
    return this.http.post(`${this.baseUrl}/Account/register`, user);
  }
  

  login(login: Login) : Observable<AuthResponse> {
   return this.http.post<any>(`${this.baseUrl}/Account/login`, login).pipe(
      map((response) => {        
          localStorage.setItem(this.tokenKey, response.token); // Store JWT token in local storage
        
          this.isloggedIn.next(true);
          this.loadUserDetails();
          this.loadProfileData();
          this.userSubject.next(this.userCurrently!)
        return response;
      })
    );
  }

  loginWithGoogle(): Observable<AuthResponse> {
    return new Observable<AuthResponse>((observer) => {
      // this.socialAuthService.signIn(SocialAuthService.GOOGLE).then(user => {
      //   const loginData = {
      //     email: user.email,
      //     token: user.idToken
      //   };
      //   this.http.post<AuthResponse>(`${this.baseUrl}/Account/social-login`, loginData).subscribe(
      //     (response) => {
      //       localStorage.setItem(this.tokenKey, response.token); // Store the JWT token
      //       this.isloggedIn.next(true);
      //       this.loadUserDetails();
      //       observer.next(response);
      //       observer.complete();
      //     },
      //     (error) => {
      //       observer.error(error);
      //     }
      //   );
      // });
    });
  }
  // // Same for Facebook login, adjust accordingly.
  // loginWithFacebook(): Observable<AuthResponse> {
  //   return new Observable<AuthResponse>((observer) => {
  //     this.socialAuthService.signIn(SocialAuthService.FACEBOOK).then(user => {
  //       const loginData = {
  //         email: user.email,
  //         token: user.authToken
  //       };
  //       this.http.post<AuthResponse>(`${this.baseUrl}/Account/social-login`, loginData).subscribe(
  //         (response) => {
  //           localStorage.setItem(this.tokenKey, response.token); // Store the JWT token
  //           this.isloggedIn.next(true);
  //           this.loadUserDetails();
  //           observer.next(response);
  //           observer.complete();
  //         },
  //         (error) => {
  //           observer.error(error);
  //         }
  //       );
  //     });
  //   });
  // }

  hasRole(role: string): boolean {
    const token = this.getToken();

    if (!token) return false;
    const decodedToken: any = jwtDecode(this.getToken()!);

    //console.log(decodedToken.role)
    return decodedToken.role === role;
  }

  loggedIn(): Observable<boolean> {
    return this.isloggedIn.asObservable();
  }

  loadProfileData(): void {
    this.getProfile().subscribe(user => {
      this.userCurrently = user;
    });
  }

  loadUserDetails(): Observable<ApplicationUser> {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userDetail: ApplicationUser = {
        id: decodedToken.nameid,
        email: decodedToken.email,
        lastName: decodedToken.given_name,
        firstName: decodedToken.family_name,
        role: decodedToken.role,
        //profilePictureUrl: decodedToken.unique_name
      };
      //this.userCurrently = userDetail;
      this.userSubject.next(userDetail);
      return this.user$.pipe(map(user => user || userDetail)); // Return the user details
    } else {
      return this.user$.pipe(map(user => {
        // Handle case where token is not present
        throw new Error('User not authenticated');
      }));
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
    this.userCurrently = null;
    this.userSubject.next(null);
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
