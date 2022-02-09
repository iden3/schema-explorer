import {Inject, Injectable} from '@angular/core';
import {from, Observable} from "rxjs";
import {CONSTANTS} from "../utils/constants";
import {environment} from "../../environments/environment";

declare const Web3: any;


@Injectable({
  providedIn: 'root'
})
export class Web3SchemaService {
  contract: any
  ethereum: any;
  web3js: any;
  selectedAccount: string = '';

  constructor(@Inject('Window') private window: any) {
  }

  search(value: string, searchParams: string): Observable<any> {

    return from(
      new Promise(async (resolve, reject) => {
        if (!value) {
          reject('please provide value')
        }

        this.contract = await this.initContract()
        if (searchParams === CONSTANTS.SEARCH_BY_NAME) {
          this.contract.methods.getBytesByName(value)
            .call({from: this.selectedAccount}, (error: any, result: any) => {
              if (!!error) {
                reject(error)
              }
              resolve(this.tryParseJSON(result))
            });
          return
        }

        if (searchParams === CONSTANTS.GET_HASH) {
          this.contract.methods.getHashByName(value)
            .call({from: this.selectedAccount}, (error: any, result: any) => {
              if (!!error) {
                reject(error)
              }
              resolve(result)
            });
          return;
        }

        if (searchParams === CONSTANTS.SEARCH_BY_HASH) {
          this.contract.methods.getBytesByHash(value)
            .call({from: this.selectedAccount}, (error: any, result: any) => {
              if (!!error) {
                reject(error)
              }
              resolve(this.tryParseJSON(result))
            });
          return;
        }

        reject('No search parameters provided')
      }).catch(err => console.log('err', err))
    )


  }

  uploadSchema(file: File, _: string): Observable<{ txHex: string }> {

    return from(
      new Promise(async (resolve, reject) => {
        this.contract = await this.initContract()
        const arrayBuffer = await file.arrayBuffer();
        const reader = new FileReader();
        reader.onload = () => {
          const array = new Uint8Array(arrayBuffer);
          const hex = this.web3js.utils.bytesToHex(array)
          resolve(hex)
        };
        reader.onerror = (e) => {
          reject(e)
        }
        reader.readAsArrayBuffer(file);
      })
        .then(hex => {
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
          return this.contract.methods.save(nameWithoutExt, hex).send({from: this.selectedAccount})
        })
        .then(result => ({txHex: result.transactionHash}))
    )

  }

  private handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== this.selectedAccount) {
      this.selectedAccount = accounts[0];
    }
  }

  private async initContract(): Promise<any> {
    this.ethereum = this.window['ethereum'];
    if (!this.ethereum) {
      return null
    }

    this.ethereum.on('accountsChanged', (accounts: Array<string>) => this.handleAccountsChanged(accounts));

    await this.ethereum.request({method: 'eth_requestAccounts'})
      .then((accounts: string[]) => this.handleAccountsChanged(accounts))
      .catch((err: any) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });

    this.web3js = new Web3(this.ethereum);

    return new this.web3js.eth.Contract(CONSTANTS.ABI_JSON, environment.CONTRACT_ADDRESS)

  }

  tryParseJSON(result: any) {

    try {
      return JSON.parse(this.web3js.utils.hexToAscii(result))
    } catch {
      return result
    }

  }
}
