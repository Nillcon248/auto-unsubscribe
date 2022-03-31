
interface Subscription {
  closed: boolean;
  unsubscribe: () => void;
}

interface Observable {
  subscribe: (...args: any[]) => Subscription;
  pipe: (...args: any[]) => Observable;
  lift: (...args: any[]) => Observable;
  asObservable: (...args: any[]) => Observable;
}


export function AutoUnsubscribe(): any {
  return function InnerFunction(this: typeof InnerFunction, targetClass: any, key: string, descriptor: any): any {
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
      set: function (newValue: Observable | Subscription): void {
        if (isObservable(newValue)) {
          defineSubscribeDefaultMethod.call(this, newValue, targetClass);
          defineSubscribeForMethod.call(this, 'pipe', newValue);
          defineSubscribeForMethod.call(this, 'lift', newValue);
          defineSubscribeForMethod.call(this, 'asObservable', newValue);
        } else if (isSubscription(newValue)) {
          setSubsription.call(this, targetClass, newValue);
        }

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

      if (isObservable(result)) {
        defineSubscribeDefaultMethod.call(this, result, targetClass);
        defineSubscribeForMethod.call(this, 'pipe', result);
        defineSubscribeForMethod.call(this, 'lift', result);
        defineSubscribeForMethod.call(this, 'asObservable', result);
      } else if (isSubscription(result)) {
        setSubsription.call(this, targetClass, result);
      }

      return result;
    };
  }
}

function defineSubscribeDefaultMethod(
  this: unknown,
  observable: Observable,
  targetClass: any
): Observable {
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
  this: unknown,
  methodName: keyof Observable,
  observable: Observable
): void {
  const originMethod = observable[methodName] as (
    ...args: any[]
  ) => Observable;

  (observable[methodName] as (...args: any[]) => Observable) =
    function (this: unknown, ...args: any[]): any {
      const result: Observable = originMethod.apply(this, args);

      result.subscribe = observable.subscribe;

      return result;
    };
}

function setSubsription(this: unknown, targetClass: any, subscription: Subscription): void {
  const targetSubscriptions = targetClass.ɵSubscriptions.get(this) || [];

  targetSubscriptions.push(subscription);
  targetClass.ɵSubscriptions.set(this, targetSubscriptions);
}

function isObservable (variable: unknown): variable is Observable {
  return !!(variable as Observable).subscribe;
}

function isSubscription (variable: unknown): variable is Subscription {
  return !!(variable as Subscription).unsubscribe;
} 
