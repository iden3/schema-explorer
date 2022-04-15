import { Schema } from '../../models/schema';
import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  forkJoin,
  map,
  mergeMap,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { filter } from 'rxjs/operators';
import { DataService } from '../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroyed$ = new Subject<boolean>();
  searchForm = this.fb.group({
    value: [''],
  });

  constructor(
    private readonly injector: Injector,
    private readonly loadingService: LoadingService,
    private readonly dataService: DataService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dashboardService: DashboardService,
    private readonly snackBar: ToastrService,
    private readonly fb: FormBuilder
  ) {}

  schemas$!: Observable<readonly Schema[]>;

  onRegister(schema: Schema): void {
    setTimeout(() => this.loadingService.setLoading(true), 200);
    this.dashboardService
      .registerSchema(schema)
      .pipe(
        take(1),
        distinctUntilChanged(),
        tap(d => {
          console.log(d);
          this.snackBar.info('Transaction completed');
        }),
        finalize(() => {
          setTimeout(() => this.loadingService.setLoading(false), 200);
          this.loadSchemas();
        })
      )
      .subscribe();
  }

  loadSchemas(): void {
    setTimeout(() => this.loadingService.setLoading(true), 100);
    this.dashboardService
      .getIds()
      .pipe(
        takeUntil(this.destroyed$),
        map((resp: string[][]) => resp[0]),
        filter((data: string[]) => !!data?.length),
        mergeMap((ids: string[]) => {
          return forkJoin(
            (ids ?? []).map((id: string) => {
              return this.dashboardService.getSchemaById(id);
            })
          );
        }),
        tap(schemas => this.dataService.nextSchemaList(schemas)),
        finalize(() => {
          setTimeout(() => this.loadingService.setLoading(false), 100);
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.destroyed$),
        debounceTime(300),
        map(({ value }) => value),
        distinctUntilChanged(),
        tap(value => {
          this.dataService.nextFilterValue(value);
        })
      )
      .subscribe();

    this.loadSchemas();

    this.schemas$ = combineLatest([this.dataService.schemaList$, this.dataService.filterValue$]).pipe(
      map(([schemas, value]) => {
        this.searchForm.setValue({ value }, { emitEvent: false });
        if (!value) {
          return schemas;
        }
        return schemas.filter(s => s.id?.toLowerCase().includes(value?.toLowerCase()) 
            || s.desc?.toLowerCase().includes(value?.toLowerCase())  
            || s.credentialType?.toLowerCase().includes(value?.toLowerCase()));
        })
    );
  }

  ngOnDestroy() {
    this.dashboardService.destroyed$.next(true);
    this.dashboardService.destroyed$.complete();
  }
}
