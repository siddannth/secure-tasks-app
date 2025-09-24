import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from './audit.service';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit.component.html'
})
export class AuditComponent implements OnInit {
  logs: any[] = [];

  constructor(private auditService: AuditService) {}

  ngOnInit() {
    this.auditService.getLogs().subscribe(data => this.logs = data);
  }
}
