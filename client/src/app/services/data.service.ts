import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, share } from 'rxjs';
import { Schema } from '../models/schema';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _schema$ = new BehaviorSubject<Schema | null>(null);
  public schema$ = this._schema$.asObservable();
  nextSchema(schema: Schema) {
    this._schema$.next(schema);
  }

  private _schemaList$ = new BehaviorSubject<ReadonlyArray<Schema>>([]);
  public schemaList$ = this._schemaList$.asObservable();
  nextSchemaList(schema: ReadonlyArray<Schema>) {
    this._schemaList$.next(schema);
  }

  private _filterValue$ = new BehaviorSubject<string>('');
  public filterValue$: Observable<string> = this._filterValue$.asObservable().pipe(share());
  nextFilterValue(value: string) {
    this._filterValue$.next(value);
  }
}
