import { Component, Inject } from '@angular/core';
import { CONSTANTS } from '../../utils/constants';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerComponent {
  isExpanded = true;
  isMetamask: boolean = !!localStorage.getItem(CONSTANTS.USE_METAMASK);

  constructor(@Inject('Window') private readonly window: any) {}

  modeChanged({ value }: { value: boolean }) {
    localStorage.setItem(CONSTANTS.USE_METAMASK, value ? 'true' : '');
    this.window.location.reload();
  }
}
