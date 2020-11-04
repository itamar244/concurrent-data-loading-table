import { Observable } from 'rxjs';

export interface DataEnricher<T> {
  // when observable yields value - the new value is omitted as fetched data.
  // when observable completes - fetches runs next enricher.
  enrich(data: T[]): Observable<T[]>;
}

export interface ParallelDataEnricher<T, U extends T> {
  // receive share replayed data observable, then returns an enriched observable
  // this is useful because data can be loaded parallel even if data$ hasnt yield any value yet
  enrich(data$: Observable<T[]>): Observable<U[]>;
}

// OR maybe
export interface ParallelDataEnricher2<T, U> {
  // when data fetching begin, init is called
  init(): Observable<U>;
  // when data fetching and init emit an initial value, enrich will be called and create enriched data
  enrich(data: T[], fetchedData: U): T[];
}
