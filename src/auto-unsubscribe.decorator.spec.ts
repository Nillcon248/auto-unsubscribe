import { BehaviorSubject, Subscription } from 'rxjs';
import { AutoUnsubscribe } from './auto-unsubscribe.decorator';

class TestComponent {
  @AutoUnsubscribe()
  parameter$ = new BehaviorSubject(0);

  public ngOnDestroy(): void {}

  @AutoUnsubscribe()
  public methodObservable(): BehaviorSubject<number> {
    return new BehaviorSubject(0);
  }

  @AutoUnsubscribe()
  public methodSubscription(): Subscription {
    return new BehaviorSubject(0).subscribe();
  }
}

describe('AutoUnsubscribe', () => {
  let component: TestComponent;

  beforeEach(() => {
    component = new TestComponent();
  });

  it('should unsubscribe from parameter after ngOnDestroy called', () => {
    const subscription = component.parameter$.subscribe();

    component.ngOnDestroy();
  });
});
