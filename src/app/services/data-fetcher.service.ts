import { Injectable } from '@angular/core';
import { combineLatest, from, Observable, of } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { asyncObservable } from '../rxjs-utils';
import { DataEnricher, ParallelDataEnricher } from './interfaces';
import { ParallelManuFactureEnricher } from './parallel-manufacture.enricher';
import { PriceFactureEnricher } from './price.enricher';

const rowDataMock = [{ model: 'Celica' }, { model: 'Mondeo' }, { model: 'Boxter' }];

type Item = typeof rowDataMock[0];

@Injectable()
export class DataFetcherService {
  private enrichers: DataEnricher<Item>[] = [new PriceFactureEnricher()];
  private parallelEnrichers: ParallelDataEnricher<Item, Item>[] = [
    new ParallelManuFactureEnricher(),
  ];
  private concurrent = true;

  public fetch(): Observable<Item[]> {
    const data$ = of(rowDataMock).pipe(
      switchMap(data => {
        return this.concurrent ? this.enrichConcurrently(data) : this.enrichSerially(data);
      }),
      shareReplay(1),
    );

    const enrichedData$ = combineLatest(this.parallelEnrichers.map(enricher => enricher.enrich(data$))).pipe(
      map(datas => {
        return datas
          .filter(data => data != null)
          .reduce((acc, data) => acc.map((item, i) => ({ ...item, ...data[i] })));
      }),
      startWith<null | Item[]>(null),
    );

    return combineLatest([data$, enrichedData$]).pipe(
      map(([data, enrichedData]) => {
        return enrichedData ?? data;
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
    return asyncObservable<Item[]>(async observer => {
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
