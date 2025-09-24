import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'access_token';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(
      `${environment.apiUrl}/auth/login`,
      { email, password }
    ).pipe(
      tap(res => {
        if (res?.access_token) {
          localStorage.setItem(this.tokenKey, res.access_token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
