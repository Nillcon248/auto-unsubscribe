import type { Observable, Subscription } from 'rxjs';
import { InnerInstance, RxEntity, TargetClass } from '@src/interfaces';
import { RxEntityBase } from './rx-entity-base';

type ObservableMethod = (...args: any[]) => Observable<unknown>;
type SubscriptionMethod = (...args: any[]) => Subscription;

const OverrideMethodNames = ['subscribe', 'pipe', 'lift', 'asObservable'];

export class RxEntityObservable extends RxEntityBase {
    public check(variable: RxEntity): boolean {
        return !!(variable as Observable<unknown>).subscribe;
    }

    public process(
        instance: InnerInstance,
        targetClass: TargetClass,
        observable: Observable<unknown>,
    ): void {
        const subscriptionMethod = this.getOverrideSubscriptionMethod(
            instance,
            targetClass,
            observable,
        );
        this.overrideMethods(observable, subscriptionMethod);
    }

    private getOverrideSubscriptionMethod(
        instance: InnerInstance,
        targetClass: TargetClass,
        observable: Observable<unknown>,
    ): SubscriptionMethod {
        const self = this;
        const originSubscribeMethod = observable.subscribe;

        const subscribeMethod = function (...args: unknown[]): Subscription {
            const subscription: Subscription = originSubscribeMethod.apply(this, args);

            if (!subscription?.closed) {
                self.defineSubscription(instance, targetClass, subscription);
            }

            return subscription;
        };

        return subscribeMethod;
    }

    private overrideMethods(
        observable: Observable<unknown>,
        subscribeMethod: SubscriptionMethod,
    ): void {
        OverrideMethodNames.forEach((methodName) => {
            const originMethod = observable[methodName] as ObservableMethod;

            observable[methodName] = function (this: unknown, ...args: any[]): unknown {
                const result: Observable<unknown> = originMethod.apply(this, args);

                result.subscribe = subscribeMethod;

                return result;
            };
        });
    }
}
