import { inject, Injectable, signal } from '@angular/core';
import { HttpServiceService } from './http-service.service';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { switchMap } from 'rxjs/operators';

export interface InitData {
  emailId: string;
  userName: string;
  tenantName: string;
  roles: string[];
  access: { [module: string]: string[] };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private readonly http = inject(HttpServiceService);
  private readonly router = inject(Router);

  private readonly TOKEN_KEY = 'hoodle_token';

  currentUser = signal<InitData | null>(null);

  public AUTH_ROOT_PATH = 'hoodle/api/v1/auth'


  public register(userData: any): Observable<any> {
    return this.http.post<any>(this.AUTH_ROOT_PATH +'/signup', userData);
  }

  /**
   * Calls your backend login endpoint and saves the token
   */
  public login(credentials: any): Observable<any> {
    // Assuming your backend returns an object like { token: 'ey...' }
    return this.http.post<any>(this.AUTH_ROOT_PATH + '/sign-in', credentials).pipe(
      // tap(response => {
      //   if (response && response.token) {
      //     localStorage.setItem(this.TOKEN_KEY, response.token);
      //   }
      // }),
      switchMap(() => this.fetchInitData())
    );
  }


  /**
   * Fetches the RBAC data and stores it in the signal
   */
  public fetchInitData(): Observable<InitData> {
    return this.http.get<InitData>(this.AUTH_ROOT_PATH + '/init').pipe(
      tap(data => {
        this.currentUser.set(data); // Save the payload globally!
      })
    );
  }

  /**
   * Clears the token and kicks the user to the login page
   */
  public logout(): void {
    this.http.post<any>(this.AUTH_ROOT_PATH + '/logout', {}).subscribe({
      next: () => {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout request failed, forcing local logout', err);
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      }
    });
  }

  /**
   * Helper to check if user is logged in
   */
  public isLoggedIn(): boolean {
    return !!this.currentUser();
  }


  public hasAccess(moduleName: string, privilegeName: string): boolean {
    const user = this.currentUser();
    if (!user || !user.access) return false;

    const modulePrivileges = user.access[moduleName];
    if (!modulePrivileges) return false;

    return modulePrivileges.includes(privilegeName);
  }

  /**
   * Gets the current token (useful if you ever need it manually)
   */
  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }


  
  public initializeApp(): Observable<any> {
    return this.fetchInitData().pipe(
      catchError((error) => {
        this.currentUser.set(null);

        // Prevent redirect loops if they are already on a public page
        const currentUrl = this.router.url;
        if (!currentUrl.includes('/login') && !currentUrl.includes('/signup')) {
          this.router.navigate(['/login']);
        }

        return of(null);
      })
    );
  }
}
