import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BugResponse {
  bugId: number;
  title: string;
  description: string;
  affectedBuild: string;
  fixedBuild: string | null;
  expectedBehavior: string | null;
  remarks: string | null;
  variant: string;
  impact: string;
  status: string;
  reporter: string;
  responsible: string;
}

export interface CreateBugRequest {
  title: string;
  description: string;
  affectedBuild: string;
  expectedBehavior: string | null;
  remarks: string | null;
  variantId: number;
  impactId: number;
  responsibleId: number;
}

export interface UpdateBugRequest {
  title: string;
  description: string;
  affectedBuild: string;
  expectedBehavior: string | null;
  remarks: string | null;
  variantId: number;
  impactId: number;
  statusId: number;
  fixedBuild: string | null;
  responsibleId: number;
}

@Injectable({ providedIn: 'root' })
export class Bug {
  private http = inject(HttpClient);

  getAll(): Observable<BugResponse[]> {
    return this.http.get<BugResponse[]>(`${environment.apiBaseUrl}/bugs`);
  }

  create(request: CreateBugRequest): Observable<BugResponse> {
    return this.http.post<BugResponse>(`${environment.apiBaseUrl}/bugs`, request);
  }

  update(bugId: number, request: UpdateBugRequest): Observable<BugResponse> {
    return this.http.put<BugResponse>(`${environment.apiBaseUrl}/bugs/${bugId}`, request);
  }
}
