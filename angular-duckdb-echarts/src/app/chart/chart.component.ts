import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { ChartServiceService } from 'src/services/chart-service.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit{
  chartInstance: echarts.EChartsType | null = null;
  chartOption: echarts.EChartsOption = {};

  constructor(private chartService: ChartServiceService){

  }

  async ngOnInit(): Promise<void> {
    this.initializeChartOption();
    const data = await this.chartService.fetchData();
    //console.log(data);
  }

  onChartInit(): void {
  }

  private initializeChartOption() {
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }
      ]
    };

  }
}
