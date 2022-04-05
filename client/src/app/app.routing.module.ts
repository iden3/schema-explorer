import {SearchComponent} from './components/search/search.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {UploadComponent} from './components/upload/upload.component';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {SchemaCardComponent} from "./components/schema-card/schema-card.component";

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent},
  {path: 'search', component: SearchComponent},
  {path: 'dashboard/:id', component: SchemaCardComponent},
  {path: 'upload', component: UploadComponent},
  {path: '', component: SearchComponent},
  {path: '**', component: SearchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
