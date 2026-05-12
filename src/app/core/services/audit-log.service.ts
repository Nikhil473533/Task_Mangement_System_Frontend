import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

interface AuditLogResponse {
  '#result-set-1': any[];
  TotalCount: number;
  AbsoluteCount: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  
  http = inject(HttpClient);
  api = inject(ApiService);

  getAuditLogs(paramsObj : any): Observable<AuditLogResponse> {
      
    let params = new HttpParams();

    Object.keys(paramsObj).forEach(key => {
      if(paramsObj[key] !== null && paramsObj[key] !== undefined){
        params = params.set(key, paramsObj[key]);
      }
    });

    return this.api.get(`/api/auditLog/getAll`, { params })
  }
}
