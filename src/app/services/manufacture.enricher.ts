import { concat, from, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DataEnricher } from './interfaces';

const maunfacturersMock = {
  Celica: 'Toyota',
  Mondeo: 'Ford',
  Boxter: 'Porsche',
};

export class ManuFactureEnricher<T> implements DataEnricher<T> {
  enrich(data: T[]): Observable<T[]> {
    const newData = data.map(item => {
      return { ...item, make: maunfacturersMock[item['model']] };
    });

    return concat(
      of(newData.slice(0, data.length / 2).concat(data.slice(data.length / 2) as any[])).pipe(delay(1000)),
      of(newData).pipe(delay(4000)),
    );
  }
}
