import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { filter, takeUntil } from "rxjs/operators";

import { shallowMerge } from 'src/app/lib/fn';


export class State<T> {

  private valueSubject:  BehaviorSubject<T>;
  private changeSubject: Subject<Partial<T>> = new Subject();

  constructor(
    private ownerDestroyed$: Observable<any>,
    initial: T
  ) {
    this.valueSubject = new BehaviorSubject(initial);
  }

  public get value(): T {
    return this.valueSubject.value;
  }

  public update(
    change: Partial<T>
  ): void {
    this.valueSubject.next(
      shallowMerge(this.valueSubject.value, change)
    );
    this.changeSubject.next(change);
  }

  public valueStream(): Observable<T> {
    return this.valueSubject.pipe(
      takeUntil(this.ownerDestroyed$),
    );
  }

  public changeStream(): Observable<Partial<T>> {
    return this.changeSubject.pipe(
      takeUntil(this.ownerDestroyed$),
    );
  }

  public onChange(
    test: (change: Partial<T>) => boolean,
    handler: (value: T) => void
  ): void {
    this.changeSubject.pipe(
      takeUntil(this.ownerDestroyed$),
      filter(test),
    ).subscribe(() => handler(this.valueSubject.value));
  }
}
