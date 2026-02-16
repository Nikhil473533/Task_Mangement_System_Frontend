import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  constructor(private api: ApiService) {}

  login(username: string) : Observable<void> {
    return this.api.post<void>(
      `/auth/login?username=${username}`,
      {}
    );
  }
  logout() : Observable<void> {
    return this.api.post<void>(
      `/auth/logout`,
      {}
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.api.get<void>(`/auth/check`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}
