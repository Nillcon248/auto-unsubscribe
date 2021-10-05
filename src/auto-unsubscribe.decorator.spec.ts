import { BehaviorSubject, Subscription } from 'rxjs';
import { AutoUnsubscribe as auto } from './auto-unsubscribe.decorator';

const AutoUnsubscribe = auto;

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

    expect(subscription.closed).toBeFalse();

    component.ngOnDestroy();

    expect(subscription.closed).toBeTrue();
  });

  it('should unsubscribe from method result after ngOnDestroy called', () => {
    const subscription = component.methodObservable().subscribe();

    expect(subscription.closed).toBeFalse();

    component.ngOnDestroy();

    expect(subscription.closed).toBeTrue();
  });

  it('should unsubscribe from method thar return subscription after ngOnDestroy called', () => {
    const subscription = component.methodSubscription();

    expect(subscription.closed).toBeFalse();

    component.ngOnDestroy();

    expect(subscription.closed).toBeTrue();
  });
});
