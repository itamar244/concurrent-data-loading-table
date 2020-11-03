import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DataEnricher } from './interfaces';

const maunfacturersMock = {
  Celica: 'Toyota',
  Mondeo: 'Ford',
  Boxter: 'Porsche',
};

export class ManuFactureEnricher<T> implements DataEnricher<T> {
  enrich(data: T[]): Observable<T[]> {
    return of(
      data.map(item => {
        return { ...item, make: maunfacturersMock[item['model']] };
      }),
    ).pipe(delay(2000));
  }
}
