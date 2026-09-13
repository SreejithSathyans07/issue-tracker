import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserResponse } from './auth';

export interface LookupItem {
  id: number;
  name: string;
}

export interface ColoredLookupItem {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface ColoredLookupRequest {
  name: string;
  color: string;
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class Lookup {
  private http = inject(HttpClient);

  // Variants
  getVariants(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${environment.apiBaseUrl}/variants`);
  }
  createVariant(name: string): Observable<LookupItem> {
    return this.http.post<LookupItem>(`${environment.apiBaseUrl}/variants`, { name });
  }
  updateVariant(id: number, name: string): Observable<LookupItem> {
    return this.http.put<LookupItem>(`${environment.apiBaseUrl}/variants/${id}`, { name });
  }
  deleteVariant(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/variants/${id}`);
  }

  // Builds
  getBuilds(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${environment.apiBaseUrl}/builds`);
  }
  createBuild(name: string): Observable<LookupItem> {
    return this.http.post<LookupItem>(`${environment.apiBaseUrl}/builds`, { name });
  }
  updateBuild(id: number, name: string): Observable<LookupItem> {
    return this.http.put<LookupItem>(`${environment.apiBaseUrl}/builds/${id}`, { name });
  }
  deleteBuild(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/builds/${id}`);
  }

  // Impacts
  getImpacts(): Observable<ColoredLookupItem[]> {
    return this.http.get<ColoredLookupItem[]>(`${environment.apiBaseUrl}/impacts`);
  }
  createImpact(request: ColoredLookupRequest): Observable<ColoredLookupItem> {
    return this.http.post<ColoredLookupItem>(`${environment.apiBaseUrl}/impacts`, request);
  }
  updateImpact(id: number, request: ColoredLookupRequest): Observable<ColoredLookupItem> {
    return this.http.put<ColoredLookupItem>(`${environment.apiBaseUrl}/impacts/${id}`, request);
  }
  deleteImpact(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/impacts/${id}`);
  }

  // Statuses
  getStatuses(): Observable<ColoredLookupItem[]> {
    return this.http.get<ColoredLookupItem[]>(`${environment.apiBaseUrl}/statuses`);
  }
  createStatus(request: ColoredLookupRequest): Observable<ColoredLookupItem> {
    return this.http.post<ColoredLookupItem>(`${environment.apiBaseUrl}/statuses`, request);
  }
  updateStatus(id: number, request: ColoredLookupRequest): Observable<ColoredLookupItem> {
    return this.http.put<ColoredLookupItem>(`${environment.apiBaseUrl}/statuses/${id}`, request);
  }
  deleteStatus(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/statuses/${id}`);
  }

  // Users
  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${environment.apiBaseUrl}/users`);
  }
  updateUserRole(id: number, role: 'Admin' | 'User'): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${environment.apiBaseUrl}/users/${id}/role`, { role });
  }
}
