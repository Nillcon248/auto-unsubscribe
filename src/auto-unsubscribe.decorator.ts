import { Observable, Subscription } from 'rxjs';

export function AutoUnsubscribe(): any {
  return function (targetClass: any, key: string, descriptor: any): any {
    initializeAutoUnsubscription.call(this, targetClass);

    defineIfProperty.call(this, targetClass, key, descriptor);

    defineIfMethod.call(this, targetClass, descriptor);
  };
}

function initializeAutoUnsubscription(targetClass: any): void {
  if (!targetClass.ɵUnsubscriptionHasInitialized) {
    const defaultNgOnDestroy = targetClass.ngOnDestroy;

    targetClass.ɵUnsubscriptionHasInitialized = true;
    targetClass.ɵSubscriptions = new WeakMap<Object, Subscription>();

    targetClass.ngOnDestroy = function (): any {
      const targetSubscriptions = targetClass.ɵSubscriptions.get(this);

      if (targetSubscriptions?.length) {
        targetSubscriptions.forEach(
          (subscription: Subscription, index: number) => {
            subscription.unsubscribe();

            targetSubscriptions[index] = null;
          }
        );

        targetSubscriptions.length = 0;

        targetClass.ɵSubscriptions.delete(this);
      }

      if (defaultNgOnDestroy && typeof defaultNgOnDestroy === 'function') {
        return defaultNgOnDestroy.apply(this);
      }
    };
  }
}

function defineIfProperty(
  targetClass: any,
  key: string,
  descriptor: any
): void {
  if (!descriptor) {
    descriptor = {
      get: function (): unknown {
        return this[`ɵ${key}`];
      },
      set: function (newValue: Observable<unknown>): void {
        defineSubscribeDefaultMethod.call(this, newValue, targetClass);
        defineSubscribeForMethod.call(this, 'pipe', newValue);
        defineSubscribeForMethod.call(this, 'lift', newValue);
        defineSubscribeForMethod.call(this, 'asObservable', newValue);

        this[`ɵ${key}`] = newValue;
      },
      enumerable: true,
      configurable: true,
    };

    Object.defineProperty(targetClass, key, descriptor);
  }
}

function defineIfMethod(targetClass: any, descriptor: any): void {
  const originalMethod = descriptor?.value;

  if (originalMethod) {
    descriptor.value = function (...args: unknown[]): unknown {
      const result = originalMethod.apply(this, args);

      if (result.subscribe) {
        defineSubscribeDefaultMethod.call(this, result, targetClass);
        defineSubscribeForMethod.call(this, 'pipe', result);
        defineSubscribeForMethod.call(this, 'lift', result);
        defineSubscribeForMethod.call(this, 'asObservable', result);
      } else {
        console.log('subscription');
        setSubsription.call(this, targetClass, result);
      }

      return result;
    };
  }
}

function defineSubscribeDefaultMethod(
  observable: Observable<unknown>,
  targetClass: any
): Observable<unknown> {
  const originSubscribeMethod = observable.subscribe;
  const self = this;

  observable.subscribe = function (...args: unknown[]) {
    const subscription = originSubscribeMethod.apply(this, args);

    if (!subscription?.closed) {
      setSubsription.call(self, targetClass, subscription);
    }

    return subscription;
  };

  return observable;
}

function defineSubscribeForMethod(
  methodName: keyof Observable<unknown>,
  observable: Observable<unknown>
): void {
  const originMethod = observable[methodName] as (
    ...args: any[]
  ) => Observable<unknown>;

  (observable[methodName] as (...args: any[]) => Observable<unknown>) =
    function (): any {
      const result: Observable<unknown> = originMethod.apply(this, arguments);

      result.subscribe = observable.subscribe;

      return result;
    };
}

function setSubsription(targetClass: any, subscription: Subscription): void {
  const targetSubscriptions = targetClass.ɵSubscriptions.get(this) || [];

  targetSubscriptions.push(subscription);
  targetClass.ɵSubscriptions.set(this, targetSubscriptions);
}
