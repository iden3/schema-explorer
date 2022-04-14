import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IPFSService {
  constructor(private readonly client: HttpClient) {}

  uploadSchema(file: File, relativePath: string): Observable<{ txHex: string } | { CID: string }> {
    const formData = new FormData();
    formData.append('json', file, relativePath);
    return this.client.post<{ txHex: string } | { CID: string }>(`/api/ipfs/upload`, formData);
  }
}
