import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, filter, take, tap } from 'rxjs';
import { SchemaService } from '../../services/schema.service';


@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchControl = new FormControl('', [Validators.required]);

  private jsonArrived = new BehaviorSubject<unknown>(null);

  jsonArrived$ = this.jsonArrived.asObservable();

  constructor(private snackBar: MatSnackBar, private schemaService: SchemaService) {
  }

  ngOnInit(): void {
  }

  searchSchema(): void {
    if (!this.searchControl.value) {
      return;
    }

    this.schemaService
      .getSchemaByName(this.searchControl.value)
      .pipe(
        take(1),
        tap(d => !!d ? this.jsonArrived.next(d) : this.snackBar.open('schema not found'))
      ).subscribe();
  }

  copy() {
    this.jsonArrived$.pipe(
      take(1),
      tap(d => {
        const data = [new ClipboardItem({ 'text/plain': new Blob([JSON.stringify(d)], { type: 'text/plain' }) })];
        navigator.clipboard.write(data).then(() => this.openSnack('Copied to clipboard'), () => this.openSnack('Unable to write to clipboard.'));
      })
    ).subscribe()
  }

  openSnack(msg: string) {
    this.snackBar.open(msg, '', { duration: 2000 })
  }

}
