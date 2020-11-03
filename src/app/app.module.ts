import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { DataFetcherService } from './services/data-fetcher.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AgGridModule,
  ],
  providers: [DataFetcherService],
  bootstrap: [AppComponent]
})
export class AppModule { }
