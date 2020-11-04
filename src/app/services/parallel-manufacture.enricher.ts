import { concat, Observable, of } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { ParallelDataEnricher } from './interfaces';

const manufacturersMock = {
  Celica: 'Toyota',
  Mondeo: 'Ford',
  Boxter: 'Porsche',
};

export class ParallelManuFactureEnricher<T> implements ParallelDataEnricher<T, T> {
  enrich(data$: Observable<T[]>): Observable<T[]> {
    return data$.pipe(
      switchMap(data => {
        const newData = data.map(item => {
          return {
            ...item,
            make: manufacturersMock[(item as any)['model'] as keyof typeof manufacturersMock],
          };
        });

        return concat(
          of(newData.slice(0, data.length / 2).concat(data.slice(data.length / 2) as any[])).pipe(
            delay(1000),
          ),
          of(newData).pipe(delay(2000)),
        );
      }),
    );
  }
}
