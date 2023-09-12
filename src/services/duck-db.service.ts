import { Injectable } from '@angular/core';
import * as duckdb from '@duckdb/duckdb-wasm';

@Injectable({
  providedIn: 'root'
})
export class DuckDbService {
  private db!: duckdb.AsyncDuckDB;

   async getDatabase(): Promise<duckdb.AsyncDuckDB> {
    await this.init();
    return this.db;
  }

   private async init(): Promise<void> {
    await navigator.locks.request('duckdb_lock', async () => {

      await this.initializeWorker();

      await this.initializeDb();
    });
  }

  private async initializeWorker(): Promise<void>{
    const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
    const bundle: duckdb.DuckDBBundle = await duckdb.selectBundle(
      JSDELIVR_BUNDLES
    );

    // Create a worker from the selected bundle
    const worker_url = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker!}");`], {
        type: 'text/javascript',
      })
    );

    const worker = new Worker(worker_url);

    const logger = new duckdb.ConsoleLogger();
    this.db = new duckdb.AsyncDuckDB(logger, worker);
    await this.db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(worker_url);

    await this.db.open({
      query: {castBigIntToDouble: true, castDecimalToDouble: true},
    })
  }

  private async initializeDb(){
    const connection = await this.db.connect();

    //Use DuckDB connection to create item table
    await this.createItemTable(connection);

    //Use DuckDB connection to select data from parquet into table
    await this.fetchData(connection);

    await connection.close();
  }

  private async createItemTable(connection: duckdb.AsyncDuckDBConnection) {
    await connection.query(`
    create table items
    (
      category varchar,
      sub_category varchar,
      items varchar,
      price decimal
    );
    `);
  }

  private async fetchData(connection: duckdb.AsyncDuckDBConnection) {
    const url = `${window.location.origin}/assets/jio_mart_items.parquet`;
    const protocol: duckdb.DuckDBDataProtocol = duckdb.DuckDBDataProtocol.HTTP;

    await this.db.registerFileURL('items.parquet', url, protocol, false);
    await this.db.collectFileStatistics('items.parquet', true);

    await connection.query(`
      insert into items
      (
        category
        , sub_category
        , items
        , price
      )
      select
      category
      , sub_category
      , items
      , price
      from 'items.parquet';
    `);
  }

}
