import { Component, ElementRef, ViewChild } from '@angular/core';
import * as shell from '@duckdb/duckdb-wasm-shell';
import { DuckDbService } from 'src/services/duck-db.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  @ViewChild('shellContainer')
  shellContainer!: ElementRef<HTMLDivElement>;

  constructor(private duckdbService: DuckDbService){

  }

  async ngOnInit(): Promise<void> {
     const bg = await fetch(
      `https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm-shell@latest/dist/shell_bg.wasm`
    );

    await shell.embed({
      shellModule: bg.arrayBuffer(),
      container: this.shellContainer.nativeElement,
      resolveDatabase: async () => {
        return await this.duckdbService.getDb();
      },
    });
  }
}
