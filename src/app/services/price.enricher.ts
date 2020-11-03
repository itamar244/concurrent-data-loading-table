import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DataEnricher } from './interfaces';

export class PriceFactureEnricher<T> implements DataEnricher<T> {
  enrich(data: T[]): Observable<T[]> {
    return of(
      data.map(item => {
        return { ...item, price: Math.round(Math.random() * 100_000) + 50_000 };
      }),
    ).pipe(delay(2000));
  }
}
