import {Component} from '@angular/core';
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent {


  constructor(public loadingService: LoadingService) {
  }


  public opened = true;

}
