import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {ActivatedRoute} from "@angular/router";
import {DashboardService} from "../../services/dashboard.service";
import {finalize, Observable, of, share, switchMap, take, tap} from "rxjs"
import {LoadingService} from "../../services/loading.service";
import {Schema} from "../../models/schema";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-schema-card',
  templateUrl: './schema-card.component.html',
  styleUrls: ['./schema-card.component.scss']
})
export class SchemaCardComponent implements OnInit {

  constructor(public readonly dataService: DataService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly dashboardService: DashboardService,
              private readonly loadingService: LoadingService,
              private readonly snackBar: MatSnackBar,
  ) {
  }

  schema$!: Observable<Schema>;
  json$!: Observable<any>;


  ngOnInit(): void {
    this.loadingService.setLoading(true)
    this.schema$ = this.dataService.schema$.pipe(
      tap(console.log),
      switchMap((s) => {
        return s
          ? of(s).pipe(finalize(() => this.loadingService.setLoading(false)))
          : this.dashboardService.getSchemaById(this.activatedRoute.snapshot.params['id']).pipe(
            finalize(() => this.loadingService.setLoading(false))
          )
      }),
      tap((s: Schema) => {
        this.json$ = this.dashboardService.getSchemaBody(s.url).pipe(share());
      }),
      finalize(() => this.loadingService.setLoading(false))
    )

  }

  copy(): void {
    this.json$.pipe(
      take(1),
      tap(d => {
        const data = [new ClipboardItem({'text/plain': new Blob([JSON.stringify(d)], {type: 'text/plain'})})];
        navigator.clipboard.write(data).then(() => this.openSnack('Copied to clipboard'), () => this.openSnack('Unable to write to clipboard.'));
      })
    ).subscribe()
  }

  openSnack(msg: string) {
    this.snackBar.open(msg, '', {duration: 2000})
  }
}
