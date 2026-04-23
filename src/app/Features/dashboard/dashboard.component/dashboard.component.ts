import { Component, inject, OnInit } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart'; 
import { CommonModule } from '@angular/common';
import { statusCount } from '../Model/status-count.model';
import { taskResponse } from '../Model/task-response.model';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  selector: 'app-dashboard.component',
  imports: [CardModule, ChartModule, CommonModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
 
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);
  public totalCount: number =0;
  public statusCounts: statusCount[] = [];
  private myTasks: taskResponse[] = [];
  public openCount: number = 0;
  public inProgressCount: number = 0;
  public blockedCount: number =0;
  public doneCount: number = 0;  
  public taskChartData: any;
  public taskChartOptions: any;

 ngOnInit() {
  this.taskChartOptions = {
  plugins: {
    legend: {
      display: true
    }
  },
  responsive: true,
  maintainAspectRatio: false
};
   this.getDashboardData();
 }

  public getDashboardData() {
      this.dashboardService.getDashboardData().subscribe((data) => {
        this.totalCount = data.totalCount;
        this.statusCounts = data.statusCounts;
        this.myTasks = data.myTasks;

        this.extractStatusCounts(this.statusCounts);
        this.prepareChartData(this.myTasks);
        this.cdr.detectChanges();
      })
  }

  public extractStatusCounts(StatusCounts: statusCount[]){

    for(let status of StatusCounts){
       const displayName = status.displayName.toLowerCase();
       const count = status.taskCount;

       if(displayName == 'open'){
         this.openCount = count;
       } 
       if(displayName == 'in progress'){
          this.inProgressCount = count;
       }
      if(displayName == 'blocked'){
          this.blockedCount = count;
      }
      if(displayName == 'done'){
        this.doneCount = count;
      }
      }
  }

 public prepareChartData( tasks: taskResponse[] ) {

  const statusMap: any = {};

 for (let task of tasks) {
  const status = task.taskStatus.toLowerCase();

  if (!statusMap[status]) {
    statusMap[status] = 0;
  }

  statusMap[status]++;
}

   const colorMap: any = {
    'open': '#3b82f6',
    'in progress': '#f59e0b',
    'done': '#22c55e',
    'blocked': '#ef4444'
  }

  const labels = Object.keys(statusMap);
  const values = Object.values(statusMap);

  const colors = labels.map(label => colorMap[label.toLowerCase()] || '#999');
  
  const upperCaseLabels = labels.map(label => label.toUpperCase());

     this.taskChartData = {
       labels: upperCaseLabels,
       datasets: [
        {
          label: '',
          data: values,
          backgroundColor: colors
        }
       ] 

     }
 }

}
