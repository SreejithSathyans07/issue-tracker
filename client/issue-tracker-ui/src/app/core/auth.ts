import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserResponse {
  id: number;
  name: string;
  username: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface SignupRequest {
  name: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

const TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);

  signup(request: SignupRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${environment.apiBaseUrl}/auth/signup`, request);
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, request)
      .pipe(tap((response) => localStorage.setItem(TOKEN_KEY, response.token)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
