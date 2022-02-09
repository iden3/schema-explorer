import {Observable} from "rxjs";

export interface AbstractSchemaService {

  search(value: string, searchParams: string): Observable<any>;
  uploadSchema(file: File, relativePath: string): Observable<{ txHex: string }>;
}
