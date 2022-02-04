import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  constructor(private http: HttpClient) {
  }

  getSchemaByName(name :string): Observable<any>{
    return this.http.get(`/api/schema/search/${name}`)
  }

  saveSchema(blob: Blob): Observable<any>{
    return this.http.get(`/api/schema/search/${name}`)
  }
}
