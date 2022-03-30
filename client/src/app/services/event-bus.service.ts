import {Injectable} from '@angular/core';
import {filter, map, Subject, Subscription} from "rxjs";


export enum EventType {
  SourceChanges = 'SourceChanges',

}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {

  subject = new Subject<any>();

  on(event: EventType, action: any): Subscription {
    return this.subject.pipe(
      filter((e: EmitEvent) => {
        return e.name === event;
      }),
      map((event: EmitEvent) => {
        return event.value;
      })
    ).subscribe(action);
  }

  emit(event: EmitEvent) {
    this.subject.next(event);
  }

}

export class EmitEvent {
  constructor(public name: EventType, public value: any) {
  }
}
