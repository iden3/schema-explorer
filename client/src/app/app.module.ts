import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContainerComponent } from './layout/container/container.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from './app.routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { UploadComponent } from './components/upload/upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterSchemaComponent } from './components/register-schema/register-schema.component';
import { SchemaListComponent } from './components/schema-list/schema-list.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SchemaCardComponent } from './components/schema-card/schema-card.component';
import { ToastrModule } from 'ngx-toastr';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    UploadComponent,
    DashboardComponent,
    RegisterSchemaComponent,
    SchemaListComponent,
    SchemaCardComponent,
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
    MatToolbarModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatSnackBarModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-center',
      // maxOpened: 1
      preventDuplicates: true,
    }),
    NgxFileDropModule,
    LayoutModule,
    NgxSpinnerModule,
  ],
  providers: [{ provide: 'Window', useValue: window }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
