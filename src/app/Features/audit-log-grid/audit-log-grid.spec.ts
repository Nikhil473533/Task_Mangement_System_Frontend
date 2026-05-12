import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogGrid } from './audit-log-grid';

describe('AuditLogGrid', () => {
  let component: AuditLogGrid;
  let fixture: ComponentFixture<AuditLogGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditLogGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
