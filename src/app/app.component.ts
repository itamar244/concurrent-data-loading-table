import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { CellRendererComponent } from './components/cell-renderer/cell-renderer.component';
import { DataFetcherService } from './services/data-fetcher.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'my-app';

  columnDefs: ColDef[] = [
    { field: 'make', cellRendererFramework: CellRendererComponent },
    { field: 'model' },
    { field: 'price', cellRendererFramework: CellRendererComponent },
  ];
  rowData$!: Observable<any[]>;

  constructor(private fetcherService: DataFetcherService) {}

  ngOnInit() {
    this.rowData$ = this.fetcherService.fetch();
  }

  onGridReady({ api }: GridReadyEvent) {
    let data: any[] | null = null;
    this.rowData$.subscribe(newData => {
      if (data === null || data.length !== newData.length) {
        data = newData.slice();
        api.setRowData(data);
      } else {
        for (const [i, item] of newData.entries()) {
          Object.assign(data[i], item)
        }
        api.refreshCells();
      }
    });
  }
}
