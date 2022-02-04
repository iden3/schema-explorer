import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {BehaviorSubject, map, take, tap} from 'rxjs';
import {SchemaService} from "../../services/schema.service";


@Component({
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchControl = new FormControl('angular', [Validators.required]);

  private jsonArrived = new BehaviorSubject<unknown>(null);

  jsonArrived$ = this.jsonArrived.asObservable();

  constructor(private breakpointObserver: BreakpointObserver, private schemaService: SchemaService) {
  }

  ngOnInit(): void {
  }

  searchSchema(): void {
    if (!this.searchControl.value) {
      return;
    }

    this.schemaService
      .getSchemaByName(this.searchControl.value)
      .pipe(
        take(1),
        tap(d =>  this.jsonArrived.next(d))
      ).subscribe();
  }

}
