import { Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard';
import { Observable, Subject } from 'rxjs';
import { Schema } from '../models/schema';
import { DataService } from './data.service';
import { DashboardBackendService } from './dashboard-backend.service';
import { DashboardMetamaskService } from './dashboard-metamask.service';
import { CONSTANTS } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class DashboardService implements Dashboard {
  service!: Dashboard;
  destroyed$ = new Subject<boolean>();

  constructor(
    private readonly dataService: DataService,
    private readonly backendService: DashboardBackendService,
    private readonly metamaskService: DashboardMetamaskService
  ) {
    this.service = localStorage.getItem(CONSTANTS.USE_METAMASK) ? metamaskService : backendService;
  }

  getIds(): Observable<string[][]> {
    return this.service.getIds();
  }

  getSchemaBody(url: string): Observable<Schema> {
    return this.service.getSchemaBody(url);
  }

  getSchemaById(id: string): Observable<Schema> {
    return this.service.getSchemaById(id);
  }

  registerSchema(schema: Schema): Observable<unknown> {
    return this.service.registerSchema(schema);
  }
}
