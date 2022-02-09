import {InjectionToken, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ContainerComponent} from './layout/container/container.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {LayoutModule} from '@angular/cdk/layout';
import {AppRoutingModule} from "./app.routing.module";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatInputModule} from '@angular/material/input';

import {SearchComponent} from './components/search/search.component';
import {UploadComponent} from './components/upload/upload.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxFileDropModule} from "ngx-file-drop";
import {PrettyJsonModule} from "angular2-prettyjson";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatRadioModule} from '@angular/material/radio';
import {AbstractSchemaService} from "./services/abstract-schema.service";
import {Web3SchemaService} from "./services/web3Schema.service";
import {SchemaService} from "./services/schema.service";
import {environment} from "../environments/environment";
import {HttpClient, HttpClientModule} from "@angular/common/http";

export const SCHEMA_SERVICE = new InjectionToken<AbstractSchemaService>('schema.service');

const schemaFactory = (http: HttpClient, window: any) => {
  if (environment.useMetamask) {
    return new Web3SchemaService(window)
  }
  return new SchemaService(http)
}

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    SearchComponent,
    UploadComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    PrettyJsonModule,
    AppRoutingModule,
    MatGridListModule,
    MatProgressBarModule,
    MatCardModule,
    MatRadioModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatSnackBarModule,
    NgxFileDropModule,
    LayoutModule,
  ],
  providers: [
    {provide: 'Window', useValue: window},
    {provide: SCHEMA_SERVICE, useFactory: schemaFactory, deps: [HttpClient, 'Window']}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
