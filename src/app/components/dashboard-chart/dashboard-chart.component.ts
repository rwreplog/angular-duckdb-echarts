import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.scss']
})
export class DashboardChartComponent implements OnInit {
  @Input() options: echarts.EChartsOption = {};
  chartOptions: echarts.EChartsOption = {};

  ngOnInit(): void {
    this.chartOptions = this.options;
  }
}
