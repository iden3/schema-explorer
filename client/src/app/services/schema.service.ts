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

  uploadSchema(file: File, relativePath: string): Observable<{ txHex: string } | { CID: string }> {
    const formData = new FormData();
    const [path, type] = relativePath.split('?')
    formData.append('json', file, path);
    return this.http.post<{ txHex: string } | { CID: string }>(`/api/schema/save?${type}`, formData);
  }

}
