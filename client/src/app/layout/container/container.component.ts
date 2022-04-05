import {Component} from '@angular/core';
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

  constructor(private eventBusService: EventBusService) {
  }

  change({value}: { value: string }) {
    this.eventBusService.emit(new EmitEvent(EventType.SourceChanges, value))
  }
}
