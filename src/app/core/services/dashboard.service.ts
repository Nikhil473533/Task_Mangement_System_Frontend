import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { forkJoin } from 'rxjs'; 

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  
  constructor(private api:ApiService ) {}

  getDashboardData() {

       return forkJoin({
          totalCount: this.api.get<number>('/api/dashboard/summary/count'),
          statusCounts: this.api.get<any[]>('/api/dashboard/summary/status'),
          myTasks: this.api.get<any[]>('/api/dashboard/tasks/my')
       });
    }
}
