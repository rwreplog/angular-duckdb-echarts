import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { NgxEchartsModule } from 'ngx-echarts';
import { AppComponent } from './app.component';
import { ShellComponent } from './shell/shell.component';
import { ChartComponent } from './chart/chart.component';

const routes: Routes = [
  { path: 'chart', component: ChartComponent },
  { path: 'shell', component: ShellComponent },
  { path: '', redirectTo: '/shell', pathMatch: 'full'}
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    NgxEchartsModule.forRoot({
    echarts: () => import('echarts'),
  }),
],
  declarations: [ AppComponent, ShellComponent, ChartComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
