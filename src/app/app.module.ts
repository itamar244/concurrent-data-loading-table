import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { DataFetcherService } from './services/data-fetcher.service';
import { CellRendererComponent } from './components/cell-renderer/cell-renderer.component';

@NgModule({
  declarations: [
    AppComponent,
    CellRendererComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule,
  ],
  providers: [DataFetcherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
