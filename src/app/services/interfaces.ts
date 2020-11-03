import { Observable } from 'rxjs';

export interface DataEnricher<T> {
  // when observable yields value - the new value is omitted as fetched data
  // when observable complets - fetches runs next enricher
  enrich(data: T[]): Observable<T[]>;
}
