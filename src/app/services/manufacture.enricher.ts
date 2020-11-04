import { concat, from, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DataEnricher } from './interfaces';

const manufacturersMock = {
  Celica: 'Toyota',
  Mondeo: 'Ford',
  Boxter: 'Porsche',
};

export class ManuFactureEnricher<T> implements DataEnricher<T> {
  enrich(data: T[]): Observable<T[]> {
    const newData = data.map(item => {
      return { ...item, make: manufacturersMock[(item as any)['model'] as keyof typeof manufacturersMock] };
    });

    return concat(
      of(newData.slice(0, data.length / 2).concat(data.slice(data.length / 2) as any[])).pipe(delay(1000)),
      of(newData).pipe(delay(2000)),
    );
  }
}
