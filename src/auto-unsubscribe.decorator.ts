import type { Subscription } from 'rxjs';
import { RxClassMemberFactory } from './classes/rx-members';
import { Descriptor, InnerInstance, TargetClass } from './interfaces';

export function AutoUnsubscribe(): any {
    return function InnerFunction(
        this: typeof InnerFunction,
        targetClass: TargetClass,
        key: string,
        descriptor: Descriptor,
    ): any {
        console.log(this);

        // initializeAutoUnsubscription.call(this, targetClass);

        // const classMember = RxClassMemberFactory.getInstance(descriptor);

        // classMember.define(this, targetClass, key, descriptor);
    };
}

function initializeAutoUnsubscription(targetClass: TargetClass): void {
    if (!targetClass?.ɵUnsubscriptionHasInitialized) {
        const defaultNgOnDestroy = targetClass.ngOnDestroy;

        targetClass.ɵUnsubscriptionHasInitialized = true;
        targetClass.ɵSubscriptions = new WeakMap<Object, Subscription[]>();

        targetClass.ngOnDestroy = function (): any {
            const targetSubscriptions = targetClass.ɵSubscriptions.get(this);

            if (targetSubscriptions?.length) {
                targetSubscriptions.forEach((subscription: Subscription, index: number) => {
                    subscription.unsubscribe();

                    targetSubscriptions[index] = null;
                });

                targetSubscriptions.length = 0;

                targetClass.ɵSubscriptions.delete(this);
            }

            if (defaultNgOnDestroy && typeof defaultNgOnDestroy === 'function') {
                return defaultNgOnDestroy.apply(this);
            }
        };
    }
}

// function defineIfProperty(targetClass: TargetClass, key: string, descriptor: Descriptor): void {
//     if (!descriptor) {
//         descriptor = {
//             get: function (): unknown {
//                 return this[`ɵ${key}`];
//             },
//             set: function (newValue: Observable<unknown> | Subscription): void {
//                 if (isObservable(newValue)) {
//                     defineSubscribeDefaultMethod.call(this, newValue, targetClass);
//                     defineSubscribeForMethod.call(this, 'pipe', newValue);
//                     defineSubscribeForMethod.call(this, 'lift', newValue);
//                     defineSubscribeForMethod.call(this, 'asObservable', newValue);
//                 } else if (isSubscription(newValue)) {
//                     setSubscription.call(this, targetClass, newValue);
//                 }

//                 this[`ɵ${key}`] = newValue;
//             },
//             enumerable: true,
//             configurable: true,
//         } as Descriptor;

//         Object.defineProperty(targetClass, key, descriptor);
//     }
// }

// function defineIfMethod(targetClass: TargetClass, descriptor: any): void {
//     const originalMethod = descriptor?.value;

//     if (originalMethod) {
//         descriptor.value = function (...args: unknown[]): unknown {
//             const result = originalMethod.apply(this, args);

//             if (isObservable(result)) {
//                 defineSubscribeDefaultMethod.call(this, result, targetClass);
//                 defineSubscribeForMethod.call(this, 'pipe', result);
//                 defineSubscribeForMethod.call(this, 'lift', result);
//                 defineSubscribeForMethod.call(this, 'asObservable', result);
//             } else if (isSubscription(result)) {
//                 setSubscription.call(this, targetClass, result);
//             }

//             return result;
//         };
//     }
// }

// function defineSubscribeDefaultMethod(
//     this: unknown,
//     observable: Observable<unknown>,
//     targetClass: any,
// ): Observable<unknown> {
//     const originSubscribeMethod = observable.subscribe;
//     const self = this;

//     observable.subscribe = function (...args: unknown[]) {
//         const subscription = originSubscribeMethod.apply(this, args);

//         if (!subscription?.closed) {
//             setSubscription.call(self, targetClass, subscription);
//         }

//         return subscription;
//     };

//     return observable;
// }

// function defineSubscribeForMethod(
//     this: unknown,
//     methodName: keyof Observable<unknown>,
//     observable: Observable<unknown>,
// ): void {
//     const originMethod = observable[methodName] as (...args: any[]) => Observable<unknown>;

//     (observable[methodName] as (...args: any[]) => Observable<unknown>) = function (
//         this: unknown,
//         ...args: any[]
//     ): any {
//         const result: Observable<unknown> = originMethod.apply(this, args);

//         result.subscribe = observable.subscribe;

//         return result;
//     };
// }

// function setSubscription(
//     this: unknown,
//     targetClass: TargetClass,
//     subscription: Subscription,
// ): void {
//     const targetSubscriptions = targetClass.ɵSubscriptions.get(this) || [];

//     targetSubscriptions.push(subscription);
//     targetClass.ɵSubscriptions.set(this, targetSubscriptions);
// }

// function isObservable(variable: unknown): variable is Observable<unknown> {
//     return !!(variable as Observable<unknown>).subscribe;
// }

// function isSubscription(variable: unknown): variable is Subscription {
//     return !!(variable as Subscription).unsubscribe;
// }
