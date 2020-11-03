import { Injectable } from '@angular/core';
import { Observable, of, scheduled } from 'rxjs';
import { delay, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';
import { asyncObservable } from '../rxjs-utils';
import { DataEnricher } from './interfaces';
import { ManuFactureEnricher } from './manufacture.enricher';
import { PriceFactureEnricher } from './price.enricher';

const rowDataMock = [{ model: 'Celica' }, { model: 'Mondeo' }, { model: 'Boxter' }];

@Injectable()
export class DataFetcherService {
  private enrichers: DataEnricher<typeof rowDataMock[0]>[] = [
    new ManuFactureEnricher(),
    new PriceFactureEnricher(),
  ];
  private concurrent = false;

  public fetch(): Observable<typeof rowDataMock> {
    return of(rowDataMock).pipe(
      delay(200),
      switchMap(data => {
        return this.concurrent ? this.enrichConcurrently(data) : this.enrichSerially(data);
      }),
    );
  }

  private enrichConcurrently(data: { model: string }[]): Observable<{ model: string }[]> {
    const observable = of([]);
    return observable.pipe.apply(observable, [
      ...this.enrichers.map(enricher => switchMap((subData: { model: string }[]) => enricher.enrich(subData))),
      startWith(data),
    ]);
  }

  private enrichSerially(data: { model: string }[]): Observable<{ model: string }[]> {
    return asyncObservable<typeof rowDataMock>(async observer => {
      let currentData = data;

      observer.next(data);

      for (const enricher of this.enrichers) {
        await enricher
          .enrich(currentData)
          .pipe(
            tap(newData => {
              currentData = newData;
              observer.next(newData);
            }),
          )
          .toPromise();
      }

      observer.complete();
    });
  }
}
