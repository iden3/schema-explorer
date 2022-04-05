import {Schema} from '../../models/schema';
import {Component, OnInit} from '@angular/core';
import {DashboardService} from "../../services/dashboard.service";
import {distinctUntilChanged, finalize, forkJoin, map, mergeMap, Observable, take, tap, throwError} from "rxjs";
import {LoadingService} from "../../services/loading.service";
import {catchError, filter} from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private readonly dashboardService: DashboardService,
    private loadingService: LoadingService
  ) {
  }

  schemas$: Observable<Schema[]> = this.dashboardService.getIds()
    .pipe(
      map((resp: string[][]) => resp[0]),
      filter((data: string[]) => !!data?.length),
      mergeMap((ids: string[]) => {
        return forkJoin(
          (ids ?? []).map(
              (id: string) => this.dashboardService.getSchemaById(id))
        )
      }),
      tap((d: Schema[]) => console.log(d)),
      finalize(() => this.loadingService.setLoading(false))
    );

  onRegister(schema: Schema): void {
    this.loadingService.setLoading(true);

    this.dashboardService.registerSchema(schema)
      .pipe(
        take(1),
        distinctUntilChanged(),
        catchError(err => {
          console.log(err);
          return throwError(() => err)
        }),
        finalize(() => this.loadingService.setLoading(false))
      ).subscribe()
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
  }

}
