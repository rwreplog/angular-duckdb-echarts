import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
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
  options: EChartsOption = {};
  constructor(public chartService: ChartServiceService) {}

  async ngOnInit(): Promise<void> {
    this.init();
    this.dashboardData.next(await this.chartService.fetchDashboardData(''));
  }

  async updateDashboard(filter: string): Promise<void> {
    this.dashboardData.next([]);
    this.dashboardData.next(await this.chartService.fetchDashboardData(filter));
  }

  init(): void {
    this.options = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    };
  }
}
