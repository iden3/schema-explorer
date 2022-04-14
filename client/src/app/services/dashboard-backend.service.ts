import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { Schema } from '../models/schema';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Dashboard } from '../models/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardBackendService implements Dashboard {
  constructor(private readonly http: HttpClient, private readonly _snackBar: ToastrService) {}

  registerSchema(schema: Schema): Observable<unknown> {
    return this.http.post('api/schema/register', schema).pipe(
      catchError(err => {
        this._snackBar.info(err.message ? err.message : err);
        return throwError(err);
      })
    );
  }

  getIds(): Observable<string[][]> {
    return this.http.get<string[][]>('api/schema/ids').pipe(
      catchError(err => {
        this._snackBar.info(err.message ? err.message : err);
        return throwError(err);
      })
    );
  }

  getSchemaById(id: string): Observable<Schema> {
    return this.http.get<any[]>(`api/schema/${id}`).pipe(
      map(
        ([id, credentialType, url, desc, creator, timestamp]): Schema => ({
          id,
          credentialType,
          url,
          desc,
          creator,
          timestamp: timestamp ? timestamp * 1000 : undefined,
        })
      ),
      catchError(err => {
        this._snackBar.info(err.message ? err.message : err);
        return throwError(err);
      })
    );
  }

  getSchemaBody(url: string): Observable<any> {
    return this.http.get<any>(`api/schema/body`, { params: { url } }).pipe(
      catchError(err => {
        this._snackBar.info(err.message ? err.message : err);
        return throwError(err);
      })
    );
  }
}
