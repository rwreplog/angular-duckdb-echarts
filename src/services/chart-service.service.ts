import { Injectable } from '@angular/core';
import * as arrow from 'apache-arrow';
import { BehaviorSubject } from 'rxjs';
import { DatabaseManager } from 'src/db-manager';

export interface JioMartData {
  category: string,
  sub_category: string,
  items: string,
  price: number,
  category_count: number,
}

export interface JioMart {
  category: string,
  sub_category: string,
  items: string,
  price: number,
}

@Injectable({
  providedIn: 'root'
})
export class ChartServiceService {
  queryExecutionTime = new BehaviorSubject<string>('');
  constructor(private dbManager: DatabaseManager) { }

  async fetchData(): Promise<JioMartData[]> {
    const startTime = performance.now()

    const sql = `
    select
        items.category
      , ANY_VALUE(items.sub_category)
      , ANY_VALUE(items.items)
      , ANY_VALUE(items.price)
      , nullif(count(items.category), 0) as category_count
     from items
     group by items.category;`;

    let result!: arrow.Table;
    for await (const conn of this.dbManager.open()) {
      result = await conn.query<{
        category: arrow.Utf8;
        sub_category: arrow.Utf8;
        items: arrow.Utf8;
        price: arrow.Decimal;
        category_count: arrow.Int;
      }>(sql);
    }


    var endTime = performance.now();
    this.queryExecutionTime.next(`${endTime - startTime} milliseconds`);
    return result.toArray().map((row) => row as JioMartData);
  }

  async fetchDashboardData(filter: string): Promise<JioMart[]> {
    const startTime = performance.now();
    const whereSql = this.getWhereSql(filter);
    const sql = `
    select * from items ${whereSql} limit 2000;`;

    let result!: arrow.Table;
    for await (const conn of this.dbManager.open()) {
      result = await conn.query<{
        category: arrow.Utf8;
        sub_category: arrow.Utf8;
        items: arrow.Utf8;
        price: arrow.Decimal;
      }>(sql);
    }

    var endTime = performance.now();
    this.queryExecutionTime.next(`${endTime - startTime} milliseconds`);
    return result.toArray().map((row) => row as JioMart);
  }

  private getWhereSql(filter: string) {
    let whereSql = 'where 1=1 ';

    if (filter !== '') {
      whereSql += ` and items.category = '${filter}'`;
      return whereSql;
    }
    return whereSql;
  }
}
