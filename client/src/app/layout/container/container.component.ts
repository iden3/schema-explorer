import {Component, OnInit} from '@angular/core';
import {LoadingService} from "../../services/loading.service";
import {EmitEvent, EventBusService, EventType} from "../../services/event-bus.service";
import {CONSTANTS} from "../../utils/constants";

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent {

  defaultSource: string = CONSTANTS.DEFAULT_SOURCE

  isExpanded = true;

  constructor(public loadingService: LoadingService, private eventBusService: EventBusService) {
  }

  change({value}: { value: string }) {
    this.eventBusService.emit(new EmitEvent(EventType.SourceChanges, value))
  }
}
