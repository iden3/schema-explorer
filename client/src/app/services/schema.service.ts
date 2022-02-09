import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";




@Injectable({
  providedIn: 'root'
})
export class SchemaService {

  constructor(private http: HttpClient) {
  }

  search(name: string, searchParams: string): Observable<any> {
    return this.http.get(`/api/schema/search/${name}?${searchParams}`);
  }

  uploadSchema(file: File, relativePath: string): Observable<{ txHex: string }> {
    const formData = new FormData();
    formData.append('json', file, relativePath);
    return this.http.post<{ txHex: string }>('/api/schema/save', formData);
  }

}
