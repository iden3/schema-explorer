import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { finalize, Observable, of, switchMap, take, tap } from 'rxjs';
import { LoadingService } from '../../services/loading.service';
import { Schema } from '../../models/schema';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-schema-card',
  templateUrl: './schema-card.component.html',
  styleUrls: ['./schema-card.component.scss'],
})
export class SchemaCardComponent implements OnInit {
  constructor(
    public readonly dataService: DataService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly dashboardService: DashboardService,
    private readonly loadingService: LoadingService,
    private readonly snackBar: ToastrService
  ) {}

  schema$!: Observable<Schema>;
  json$!: Observable<any>;

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.schema$ = this.dataService.schema$.pipe(
      switchMap(s => {
        return s ? of(s) : this.dashboardService.getSchemaById(this.activatedRoute.snapshot.params['id']);
      }),
      tap((s: Schema) => {
        this.loadingService.setLoading(true);
        this.json$ = this.dashboardService.getSchemaBody(s.url).pipe(
          finalize(() => {
            return this.loadingService.setLoading(false);
          })
        );
      })
      // finalize(() => this.loadingService.setLoading(false))
    );
  }

  copy(event: Event): void {
    event.stopPropagation();
    this.json$
      .pipe(
        take(1),
        tap(d => {
          const data = [
            new ClipboardItem({
              'text/plain': new Blob([JSON.stringify(d)], { type: 'text/plain' }),
            }),
          ];
          navigator.clipboard.write(data).then(
            () => this.openSnack('Copied to clipboard'),
            () => this.openSnack('Unable to write to clipboard.')
          );
        })
      )
      .subscribe();
  }

  openSnack(msg: string) {
    this.snackBar.info(msg);
  }
}
