import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataFetcherService } from './services/data-fetcher.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'my-app';

  columnDefs = [{ field: 'make' }, { field: 'model' }, { field: 'price' }];
  rowData$!: Observable<any[]>;

  constructor(private fetcherService: DataFetcherService) {}

  ngOnInit() {
    this.rowData$ = this.fetcherService.fetch();
  }
}
