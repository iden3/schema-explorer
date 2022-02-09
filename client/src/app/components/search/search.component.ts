import {MatSnackBar} from '@angular/material/snack-bar';
import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {BehaviorSubject, of, take, tap} from 'rxjs';
import {CONSTANTS} from "../../utils/constants";
import {SCHEMA_SERVICE} from "../../app.module";
import {AbstractSchemaService} from "../../services/abstract-schema.service";
import {LoadingService} from "../../services/loading.service";
import {catchError} from "rxjs/operators";

@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constants = CONSTANTS;
  searchControl = new FormControl('', [Validators.required]);
  searchParams: string = 'searchBy=name';

  private jsonArrived = new BehaviorSubject<unknown>(null);

  jsonArrived$ = this.jsonArrived.asObservable();

  constructor(private snackBar: MatSnackBar,
              @Inject(SCHEMA_SERVICE) private schemaService: AbstractSchemaService,
              private loadService: LoadingService) {
  }

  ngOnInit(): void {
  }

  searchSchema(): void {
    if (!this.searchControl.value) {
      return;
    }

    if (this.searchParams === 'searchBy=hash' && !(this.searchControl.value as string).startsWith('0x')) {
      this.openSnack('Value is not valid hex string');
      return
    }
    this.loadService.setLoading(true)
    this.schemaService
      .search(this.searchControl.value, this.searchParams)
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

}
