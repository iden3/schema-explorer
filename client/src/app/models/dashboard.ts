import { Schema } from './schema';
import { Observable } from 'rxjs';

export interface Dashboard {
  registerSchema(schema: Schema): Observable<unknown>;

  getIds(): Observable<string[][]>;

  getSchemaBody(url: string): Observable<any>;

  getSchemaById(id: string): Observable<Schema>;
}
