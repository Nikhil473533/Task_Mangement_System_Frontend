import { Component, inject, ChangeDetectionStrategy, ChangeDetectorRef, viewChild } from '@angular/core';
import { TableModule, Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { AuditLogService } from '../../core/services/audit-log.service';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton'
import { InputText } from "primeng/inputtext";
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ViewChild } from '@angular/core';  

@Component({
  selector: 'app-audit-log-grid',
  standalone: true,
  imports: [TableModule, CommonModule, SkeletonModule, InputText, FormsModule, DatePickerModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './audit-log-grid.html',
  styleUrl: './audit-log-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class AuditLogGrid {
  
  auditLogs: any[] = [];
  totalRecords: number = 0;
  absoluteCount: number = 0;
  dateRange: Date[] = [];
  globalSearch: string = '';
  loading: boolean = false;
  skeletonRows = Array.from({ length: 10 });
  lastLazyEvent: any;
  auditService = inject(AuditLogService);
  messageService = inject(MessageService);
  cdr = inject(ChangeDetectorRef);
  @ViewChild('dt') table!: Table;
  filters: any[] = [];

columns = [
  { field: 'id', header: 'Event ID', type: 'numeric' },
  { field: 'entity_name', header: 'Entity', type: 'text' },
  { field: 'action', header: 'Action', type: 'text' },
  { field: 'event_time', header: 'Event Time', type: 'date' }
];

  ngOnInit() { }

  lazyLoadData(event: any) {
   this.lastLazyEvent = event;
    const pageNumber = (event.first! / event.rows!) + 1;
    const pageSize = event.rows;

    const sortColumn = event.sortField;
    const sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
    this.filters = this.transformfilters(event.filters);
    
    const params: any = {
      pageNumber,
      pageSize,
      sortColumn,
      sortOrder,
      searchTerm: this.globalSearch || null,
      startDateSearchTerm: this.dateRange?.[0] ? this.formatDate(this.dateRange[0]): null,
      endDateSearchTerm: this.dateRange?.[1] ? this.formatDate(this.dateRange[1]): null,
    };

   if(this.filters.length > 0){
    params.filters = JSON.stringify(this.filters);
   }

    this.auditService.getAuditLogs(params).subscribe({
      next: (res: any) => {
        this.auditLogs = res['#result-set-1'];
        this.totalRecords = res.TotalCount;
        this.absoluteCount = res.AbsoluteCount;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.showError();
      }
    });
  }
  
  getActionClass(action: string): string {
    switch (action) {
      case 'CREATE': return 'insert';
      case 'INSERT': return 'insert';
      case 'UPDATE': return 'update';
      case 'SOFT_DELETE': return 'soft_delete';
      default: return '';
    }
  }

  showError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'An error occured while fetching audit log records.'
    })
  }

  onSearch() {
    if(this.lastLazyEvent){
      this.lazyLoadData({
      ...this.lastLazyEvent,
      first: 0,
      rows: 10
    });
    }
  }

  onClear() {
    this.dateRange = [];
    this.globalSearch = '';
    this.filters = [];

    this.table.reset();

    if(this.lastLazyEvent){
      this.lazyLoadData({
      ...this.lastLazyEvent,
      first: 0,
      rows: 10,
      filters: {}
    });
    }
  }

formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

transformfilters(filters: any): any[] {
   const result: any[] = [];

   if(!filters) return result;

   for(const field in filters) {
    const filterArray = filters[field];

    if(filterArray && filterArray.length > 0) {
      filterArray.forEach((f: any, index: number) => {
        if(f.value !== null && f.value !== undefined && f.value !== ''){
          result.push({
            field: field,
            value: f.value instanceof Date ? this.formatDate(f.value) : f.value.toString(),
            matchMode: f.matchMode,
            operator: index === 0 ? 'and' : 'or'
          });
        }
      });
    }
   }
   return result;
}

}
