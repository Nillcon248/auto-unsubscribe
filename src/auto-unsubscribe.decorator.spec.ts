import { BehaviorSubject, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AutoUnsubscribe as AutoUnsubscribeDecorator } from './auto-unsubscribe.decorator';

const AutoUnsubscribe = AutoUnsubscribeDecorator;

class TestComponent {
  @AutoUnsubscribe()
  public parameter$ = new BehaviorSubject(0);

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

  it('should unsubscribe from overided parameter after ngOnDestroy called', () => {
    const subscription1 = component.parameter$.subscribe();

    component.parameter$ = new BehaviorSubject(1);
    const subscription2 = component.parameter$.subscribe();

    expect(subscription1.closed).toBeFalse();
    expect(subscription2.closed).toBeFalse();

    component.ngOnDestroy();

    expect(subscription1.closed).toBeTrue();
    expect(subscription2.closed).toBeTrue();
  });

  it('should unsubscribe from observables with pipe after ngOnDestroy called', () => {
    const subscription = component.parameter$
      .pipe(switchMap(() => of(1)))
      .subscribe();

    expect(subscription.closed).toBeFalse();

    component.ngOnDestroy();

    expect(subscription.closed).toBeTrue();
  });

  it('should unsubscribe from observables with lift after ngOnDestroy called', () => {
    const subscription = component.parameter$
      .lift(switchMap(() => of(1)))
      .subscribe();

    expect(subscription.closed).toBeFalse();

    component.ngOnDestroy();

    expect(subscription.closed).toBeTrue();
  });

  it('should unsubscribe from asObservable() after ngOnDestroy called', () => {
    const subscription = component.parameter$.asObservable().subscribe();

    expect(subscription.closed).toBeFalse();

    component.ngOnDestroy();

    expect(subscription.closed).toBeTrue();
  });
});
