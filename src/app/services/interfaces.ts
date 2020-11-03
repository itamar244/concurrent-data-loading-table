import { Observable } from 'rxjs';

export interface DataEnricher<T> {
  enrich(data: T[]): Observable<T[]>;
}
