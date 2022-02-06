import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  constructor(private http: HttpClient) {
  }

  getSchemaByName(name :string, searchParams: string): Observable<any>{
    return this.http.get(`/api/schema/search/${name}?${searchParams}`).pipe(tap(console.log))
  }

  saveSchema(blob: Blob): Observable<any>{
    return this.http.get(`/api/schema/search/${name}`)
  }
}
