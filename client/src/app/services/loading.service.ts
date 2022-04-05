import {Injectable} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private spinner: NgxSpinnerService) {
  }

  setLoading(loading: boolean): Promise<unknown> {
    return loading ? this.spinner.show() : this.spinner.hide()
  }
}

