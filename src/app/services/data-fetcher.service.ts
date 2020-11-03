import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const rowDataMock = [
  { make: 'Toyota', model: 'Celica', price: 35000 },
  { make: 'Ford', model: 'Mondeo', price: 32000 },
  { make: 'Porsche', model: 'Boxter', price: 72000 },
];

@Injectable()
export class DataFetcherService {
  public fetch(): Observable<typeof rowDataMock> {
    return of(rowDataMock).pipe(delay(200));
  }
}
