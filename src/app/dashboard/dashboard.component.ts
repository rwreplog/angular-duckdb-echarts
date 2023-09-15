import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChartServiceService, JioMart } from 'src/services/chart-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  dashboardData = new BehaviorSubject<JioMart[]>([]);
  groceries: JioMart[] = [];
  constructor(public chartService: ChartServiceService) {}

  async ngOnInit(): Promise<void> {
    this.dashboardData.next(await this.chartService.fetchDashboardData(''));
    //this.groceries = await this.chartService.fetchDashboardData('Groceries');
  }

  async updateDashboard(filter: string): Promise<void> {
    this.dashboardData.next([]);
    this.dashboardData.next(await this.chartService.fetchDashboardData(filter));
  }
}
