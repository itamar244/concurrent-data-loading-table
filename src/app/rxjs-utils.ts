import { Observable, Observer } from 'rxjs';

export function asyncObservable<T>(
  subscribe: (observer: Observer<T>) => Promise<(() => void) | void>,
): Observable<T> {
  return new Observable(observer => {
    let teardown;

    subscribe(observer)
      .then(returendTeardown => {
        teardown = returendTeardown;
      })
      .catch(error => {
        observer.error(error);
      });

    return () => {
      teardown && teardown();
    };
  });
}
