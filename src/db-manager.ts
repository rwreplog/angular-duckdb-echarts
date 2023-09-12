import { Injectable } from '@angular/core';
import * as duckdb from '@duckdb/duckdb-wasm';
import { DuckDbService } from './services/duck-db.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseManager {
  constructor(private duckDbService: DuckDbService) {}

  async *open() {
    let conn!: duckdb.AsyncDuckDBConnection;
    try {
      const db: duckdb.AsyncDuckDB = await this.duckDbService.getDatabase();
      conn = await db.connect();
      yield conn;
    } finally {
      await conn.close();
    }
  }
}
