// noinspection JSVoidFunctionReturnValueUsed

import { Inject, Injectable, NgZone } from '@angular/core';
import { CONSTANTS } from '../utils/constants';
import { ToastrService } from 'ngx-toastr';
import { defer, finalize, from, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Dashboard } from '../models/dashboard';
import { Schema } from '../models/schema';
import { LoadingService } from './loading.service';
import { HttpClient } from '@angular/common/http';

declare const Web3: any;

@Injectable({
  providedIn: 'root',
})
export class DashboardMetamaskService implements Dashboard {
  contract: any;
  ethereum: any;

  constructor(
    @Inject('Window') private window: any,
    private readonly _snackBar: ToastrService,
    private readonly loadingService: LoadingService,
    private readonly client: HttpClient,
    private readonly ngZone: NgZone
  ) {
    this.ethereum = this.window['ethereum'];
    if (!this.ethereum) {
      _snackBar.info('Metamask is not found, please install extension and connect to Mumbai polygon testnet !');
      throw new Error('Metamask is not found!');
    }else {
      this.getChainId().then((chainId  =>{
        // TODO:  when we will support other networks - change this!!!!!!!!
        if (chainId != 80001) {
          _snackBar.info('connect to Mumbai polygon testnet !');
          throw new Error('connect to Mumbai polygon testnet ');
        }
      }))
    }


    this.ethereum.on('accountsChanged', (accounts: Array<string>) => this.handleAccountsChanged(accounts, true));
    this.contract = new new Web3(this.ethereum).eth.Contract(CONSTANTS.ABI_JSON, CONSTANTS.CONTRACT_ADDRESS);
  }
  
  public async getChainId() : Promise<any> {
    return await this.ethereum.request({ method: 'eth_chainId' });
  }

  registerSchema(schema: Schema): Observable<unknown> {
    return this.client.post<{ id: string }>('api/schema/hash', schema).pipe(
      tap(console.log),
      map(r => r.id),
      switchMap((id: string) => {
        return this.requestAccount().pipe(
          switchMap((acc: string) => {
            return defer(() => {
              setTimeout(() => this.loadingService.setLoading(true), 200);
              return this.contract.methods.save(id, schema.credentialType, schema.url, schema.desc).send({ from: acc });
            });
          }),
          catchError(err => {
            this._snackBar.info(err.message ? err.message : err);
            return throwError(err);
          })
        );
      }),
      catchError(err => {
        this._snackBar.info(err.message ? err.message : err);
        return throwError(err);
      })
    );
  }

  getIds(): Observable<string[][]> {
    return this.requestAccount().pipe(
      switchMap(acc => {
        return defer(() => {
          return new Promise((resolve, reject) => {
            this.contract.methods.getIds().call({ from: acc }, (error: any, result: any) => {
              if (error) {
                reject(error);
              }
              resolve([result]);
            });
          });
        }).pipe(
          map(data => data as string[][]),
          catchError(err => {
            return throwError(err);
          })
        );
      })
    );
  }

  getSchemaBody(url: string): Observable<any> {
    return this.client.get<any[]>(`api/schema/body`, { params: { url } }).pipe(
      catchError(err => {
        this._snackBar.info(err.message ? err.message : err);
        return throwError(err);
      })
    );
  }

  getSchemaById(id: string): Observable<Schema> {
    return this.requestAccount().pipe(
      switchMap(acc => {
        return defer(() => {
          return new Promise((resolve, reject) => {
            this.contract.methods.getSchemaById(id).call({ from: acc }, (error: any, res: any) => {
              if (error) {
                reject(error);
              }
              const { '0': id, '1': credentialType, '2': url, '3': desc, '4': creator, '5': timestamp } = res;
              const s = {
                id,
                credentialType,
                url,
                desc,
                creator,
                timestamp: timestamp ? timestamp * 1000 : undefined,
              } as Schema;
              resolve(s);
            });
          });
        }).pipe(
          map(s => {
            return s as Schema;
          }),
          catchError(err => {
            this._snackBar.info(err.message ? err.message : err);
            return throwError(err);
          })
        );
      })
    );
  }

  private handleAccountsChanged(accounts: string[], useSnack = false): string {
    const account = accounts.length === 0 ? '' : accounts[0];
    if (useSnack) {
      const message = account ? 'Account address changed to ' + account : 'Please connect to MetaMask.';
      this.ngZone.run(() => {
        this._snackBar.info(message);
      });
    }
    return account;
  }

  private requestAccount(): Observable<string> {
    this.loadingService.setLoading(true);
    return from(this.ethereum.request({ method: 'eth_requestAccounts' })).pipe(
      map(accounts => this.handleAccountsChanged(accounts as string[])),
      catchError(err => {
        const isMetamask = !!localStorage.getItem(CONSTANTS.USE_METAMASK);
        if (!isMetamask) {
          return throwError(err);
        }
        if (err.code === 4001) {
          this._snackBar.info('Please connect to MetaMask.');
        } else {
          this._snackBar.info(err.message ? err.message : err);
        }
        return throwError(err);
      }),
      finalize(() => {
        return this.loadingService.setLoading(false);
      })
    );
  }
}
