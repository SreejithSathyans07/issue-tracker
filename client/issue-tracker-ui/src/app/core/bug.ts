import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BugFilter {
  variantIds?: number[];
  impactIds?: number[];
  statusIds?: number[];
  reporterIds?: number[];
  responsibleIds?: number[];
  affectedBuildIds?: number[];
  search?: string;
}

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
  affectedBuildId: number;
  expectedBehavior: string | null;
  remarks: string | null;
  variantId: number;
  impactId: number;
  responsibleId: number;
}

export interface UpdateBugRequest {
  title: string;
  description: string;
  affectedBuildId: number;
  expectedBehavior: string | null;
  remarks: string | null;
  variantId: number;
  impactId: number;
  statusId: number;
  fixedBuildId: number | null;
  responsibleId: number;
}

@Injectable({ providedIn: 'root' })
export class Bug {
  private http = inject(HttpClient);

  getAll(filter?: BugFilter): Observable<BugResponse[]> {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(filter ?? {})) {
      if (Array.isArray(value)) {
        for (const id of value) {
          params = params.append(key, id);
        }
      } else if (value) {
        params = params.set(key, value);
      }
    }

    return this.http.get<BugResponse[]>(`${environment.apiBaseUrl}/bugs`, { params });
  }

  create(request: CreateBugRequest): Observable<BugResponse> {
    return this.http.post<BugResponse>(`${environment.apiBaseUrl}/bugs`, request);
  }

  update(bugId: number, request: UpdateBugRequest): Observable<BugResponse> {
    return this.http.put<BugResponse>(`${environment.apiBaseUrl}/bugs/${bugId}`, request);
  }
}
