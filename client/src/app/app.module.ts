import {NgModule} from '@angular/core';
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
import {ReactiveFormsModule} from '@angular/forms';
import {NgxFileDropModule} from "ngx-file-drop";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {PrettyJsonModule} from "angular2-prettyjson";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HttpRequestInterceptor} from "./services/http.interceptor";


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
    HttpClientModule,
    PrettyJsonModule,
    AppRoutingModule,
    MatGridListModule,
    MatProgressBarModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatSnackBarModule,
    NgxFileDropModule,
    LayoutModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
