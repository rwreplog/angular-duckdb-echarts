import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardChartComponent } from '../components/dashboard-chart/dashboard-chart.component';
import { NgxEchartsModule } from 'ngx-echarts';


const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardChartComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        }),
    ]
})
export class DashboardModule { }
