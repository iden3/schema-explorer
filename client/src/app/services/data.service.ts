import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Schema} from "../models/schema";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _schema$ = new BehaviorSubject<Schema | null>(null);
  public schema$ = this._schema$.asObservable();

  nextSchema(schema: Schema) {
    this._schema$.next(schema);
  }

}
