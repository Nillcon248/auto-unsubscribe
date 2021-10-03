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
    targetClass.ɵSubscriptions = [];

    targetClass.ngOnDestroy = function (): any {
      targetClass.ɵSubscriptions.forEach(
        (subscription: Subscription, index: number) => {
          subscription.unsubscribe();

          targetClass.ɵSubscriptions[index] = null;
        }
      );

      targetClass.ɵSubscriptions.length = 0;

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
    let currentValue = targetClass?.[key];

    descriptor = {
      get: function (): unknown {
        return currentValue;
      },
      set: function (newValue: Observable<unknown>): void {
        const originSubscribeMethod = newValue.subscribe;

        newValue.subscribe = function (...args: unknown[]) {
          const subscription = originSubscribeMethod.apply(this, args);

          if (!subscription?.closed) {
            targetClass.ɵSubscriptions.push(subscription);
          }

          return subscription;
        };

        currentValue = newValue;
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
        const originalSubscriptionMethod = result.subscribe;

        result.subscribe = function (
          ...subscribeArgs: unknown[]
        ): Subscription {
          const subscription = originalSubscriptionMethod.apply(
            this,
            subscribeArgs
          );

          targetClass.ɵSubscriptions.push(subscription);

          return subscription;
        };
      } else {
        this.ɵSubscriptions.push(result);
      }

      return result;
    };
  }
}
