import {MatSnackBar} from '@angular/material/snack-bar';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {BehaviorSubject, of, take, tap} from 'rxjs';
import {CONSTANTS} from "../../utils/constants";
import {SCHEMA_SERVICE} from "../../app.module";
import {AbstractSchemaService} from "../../services/abstract-schema.service";
import {LoadingService} from "../../services/loading.service";
import {catchError} from "rxjs/operators";
import {EventBusService, EventType} from "../../services/event-bus.service";

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  private jsonArrived = new BehaviorSubject<unknown>(null);
  private sourceChangesSub = this.eventBusService.on(EventType.SourceChanges, (source: string) => this.source = source)

  constants = CONSTANTS;
  searchControl = new FormControl('', [Validators.required]);
  searchParams: string = CONSTANTS.SEARCH_BY_NAME;
  jsonArrived$ = this.jsonArrived.asObservable();
  source: string = CONSTANTS.DEFAULT_SOURCE;

  constructor(private snackBar: MatSnackBar,
              @Inject(SCHEMA_SERVICE) private schemaService: AbstractSchemaService,
              private loadService: LoadingService,
              private eventBusService: EventBusService) {
  }

  ngOnInit(): void {

  }

  searchSchema(): void {
    if (!this.searchControl.value) {
      return;
    }

    if (
      this.source === CONSTANTS.ETH
      && this.searchParams === 'searchBy=hash'
      && !(this.searchControl.value as string).startsWith('0x')
    ) {
      this.openSnack('Value is not valid hex string');
      return
    }
    let searchParams = `type=${this.source}`;

    if (this.source === CONSTANTS.ETH) {
      searchParams += `&${this.searchParams}`;
    }

    this.loadService.setLoading(true)
    this.schemaService
      .search(this.searchControl.value, searchParams)
      .pipe(
        take(1),
        tap(_ => this.disableLoading()),
        tap(d => !!d ? this.jsonArrived.next(d) : this.openSnack('schema not found')),
        catchError((err) => {
          this.openSnack('Error occurred, try again later')
          console.log(err)
          this.disableLoading()
          return of(err);
        })
      ).subscribe();
  }

  copy() {
    this.jsonArrived$.pipe(
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

  disableLoading() {
    setTimeout(() => this.loadService.setLoading(false), 500)
  }

  ngOnDestroy(): void {
    this.sourceChangesSub.unsubscribe();
  }

}
