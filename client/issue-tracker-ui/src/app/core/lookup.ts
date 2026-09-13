import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserResponse } from './auth';

export interface LookupItem {
  id: number;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class Lookup {
  private http = inject(HttpClient);

  getVariants(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${environment.apiBaseUrl}/variants`);
  }

  getImpacts(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${environment.apiBaseUrl}/impacts`);
  }

  getStatuses(): Observable<LookupItem[]> {
    return this.http.get<LookupItem[]>(`${environment.apiBaseUrl}/statuses`);
  }

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${environment.apiBaseUrl}/users`);
  }
}
