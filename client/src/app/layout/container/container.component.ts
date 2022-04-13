import { Component, Inject } from '@angular/core';
import { CONSTANTS } from '../../utils/constants';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent {
  isExpanded = true;
  isProd: boolean =  environment.production;
  isMetamask: boolean = !!localStorage.getItem(CONSTANTS.USE_METAMASK);

  constructor(@Inject('Window') private readonly window: any) {
    if(this.isProd){
      localStorage.setItem(CONSTANTS.USE_METAMASK, 'true');
      this.isMetamask = true;
    }
  }

  modeChanged({ value }: { value: boolean }) {
    localStorage.setItem(CONSTANTS.USE_METAMASK, value ? 'true' : '');
    this.window.location.reload();
  }
}
