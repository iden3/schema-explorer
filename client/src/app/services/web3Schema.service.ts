import {Inject, Injectable} from '@angular/core';
import {from, Observable} from "rxjs";
import {CONSTANTS} from "../utils/constants";

declare const Web3: any;


@Injectable({
  providedIn: 'root'
})
export class Web3SchemaService {
  contract: any
  ethereum: any;
  web3js: any;

  constructor(@Inject('Window') private window: any) {
    this.contract = this.initContract();
  }

  search(value: string, searchParams: string): Observable<any> {
    if (!value) {
      throw new Error('please provide value')
    }
    return from(
      new Promise((resolve, reject) => {

        if (searchParams === CONSTANTS.SEARCH_BY_NAME) {
          this.contract.methods.getBytesByName(value)
            .call({from: this.ethereum.selectedAddress}, (error: any, result: any) => {
              if (!!error) {
                reject(error)
              }
              resolve(JSON.parse(this.web3js.utils.hexToAscii(result)))
            });
          return
        }

        if (searchParams === CONSTANTS.GET_HASH) {
          this.contract.methods.getHashByName(value)
            .call({from: this.ethereum.selectedAddress}, (error: any, result: any) => {
              if (!!error) {
                reject(error)
              }
              resolve(result)
            });
          return;
        }

        if (searchParams === CONSTANTS.SEARCH_BY_HASH) {
          this.contract.methods.getBytesByHash(value)
            .call({from: this.ethereum.selectedAddress}, (error: any, result: any) => {
              if (!!error) {
                reject(error)
              }
              resolve(JSON.parse(this.web3js.utils.hexToAscii(result)))
            });
          return;
        }

        reject('No search parameters provided')
      })
    )

  }

  uploadSchema(file: File, relativePath: string): Observable<{ txHex: string }> {

    return from(new Promise(async (resolve, reject) => {
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
          return this.contract.methods.save(nameWithoutExt, hex).send({from: this.ethereum.selectedAddress})
        })
        .then(result => ({txHex: result.transactionHash}))
    )

  }

  private initContract(): any {
    this.ethereum = this.window['ethereum'];
    this.web3js = new Web3(this.ethereum);
    return new this.web3js.eth.Contract(CONSTANTS.ABI_JSON, CONSTANTS.CONTRACT_ADDRESS)

  }
}
