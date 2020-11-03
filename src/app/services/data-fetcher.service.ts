import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, from, observable, Observable, of, scheduled } from 'rxjs';
import { delay, map, mergeMap, startWith, switchMap, tap } from 'rxjs/operators';
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
  private concurrent = true;

  public fetch(): Observable<typeof rowDataMock> {
    return of(rowDataMock).pipe(
      delay(200),
      switchMap(data => {
        return this.concurrent ? this.enrichConcurrently(data) : this.enrichSerially(data);
      }),
    );
  }

  private enrichConcurrently(data: { model: string }[]): Observable<{ model: string }[]> {
    return combineLatest(
      this.enrichers.map(enricher => from(enricher.enrich(data)).pipe(startWith(data))),
    ).pipe(
      map(datas => {
        return datas
          .filter(data => data != null)
          .reduce((acc, data) => acc.map((item, i) => ({ ...item, ...data[i] })));
      }),
    );
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
