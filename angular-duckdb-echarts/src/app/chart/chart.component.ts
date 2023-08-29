import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { filter } from 'rxjs';
import { ChartServiceService, JioMartData } from 'src/services/chart-service.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit{
  chartInstance: echarts.EChartsType | null = null;
  chartOption: echarts.EChartsOption = {};
  chartData: JioMartData[] = [];
  constructor(private chartService: ChartServiceService){

  }

  async ngOnInit(): Promise<void> {
    this.chartData = await this.chartService.fetchData();
    this.initializeChartOption(this.chartData);
    console.log(this.chartData);
    console.log([...new Set(this.chartData.map(x => x.category))]);
  }

  onChartInit(): void {
  }

  private initializeChartOption(chartData: JioMartData[]) {
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: [...new Set(chartData.map(x => x.category))]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [...new Set(chartData.map(x => x.category_count))],
          type: 'bar'
        }
      ]
    };

  }
}
