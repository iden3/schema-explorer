import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, tap} from "rxjs";
import {Schema} from "../models/schema";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private readonly http: HttpClient) {
  }

  registerSchema(schema: Schema): Observable<unknown> {
    return this.http.post('api/schema/register', schema).pipe(tap(console.log))
  }

  getIds(): Observable<string[][]> {
    return this.http.get<string[][]>('api/schema/ids').pipe(tap(console.log))
  }

  getSchemaById(id: string): Observable<Schema> {
    return this.http.get<any[]>(`api/schema/${id}`).pipe(
      map(([id, credentialType, url, desc, creator, timestamp]): Schema => ({
        id,
        credentialType,
        url,
        desc,
        creator,
        timestamp
      })),
      tap(console.log)
    )
  }

  getSchemaBody(url: string): Observable<Schema> {
    return this.http.get<any[]>(`api/schema/body`, {params: {url}}).pipe(
      tap(console.log)
    )
  }
}
