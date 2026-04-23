import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  
     private baseUrl = environment.apiUrl;

     private options = {
       withCredentials: true
     }

     constructor(private http: HttpClient) {}

        get<T>(url: string) {
          return this.http.get<T>(`${this.baseUrl}${url}`, this.options);
        }

        post<T>(url: string, body: any) {
          return this.http.post<T>(`${this.baseUrl}${url}`, body, this.options);
        }

        put<T>(url: string, body: any) {
          return this.http.put<T>(`${this.baseUrl}${url}`, body, this.options);
        }

        delete<T>(url: string) {
          return this.http.delete<T>(`${this.baseUrl}${url}`, this.options);
        }
    }
