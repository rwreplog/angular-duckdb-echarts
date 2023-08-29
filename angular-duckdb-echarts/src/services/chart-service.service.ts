import { Injectable } from '@angular/core';
import * as arrow from 'apache-arrow';
import { DatabaseManager } from 'src/db-manager';

export interface JioMartData {
  category: string,
  sub_category: string,
  items: string,
  price: number,
}

@Injectable({
  providedIn: 'root'
})
export class ChartServiceService {

  constructor(private dbManager: DatabaseManager) { }

  async fetchData(): Promise<JioMartData[]> {
    const sql = `
    select
        items.category
      , items.sub_category
      , items.items
      , items.price
     from items;`;

    let result!: arrow.Table;
    for await (const conn of this.dbManager.open()) {
      result = await conn.query<{
        category: arrow.Utf8;
        sub_category: arrow.Utf8;
        items: arrow.Utf8;
        price: arrow.Decimal;
      }>(sql);
    }

    return result.toArray().map((row) => row as JioMartData);
  }
}
