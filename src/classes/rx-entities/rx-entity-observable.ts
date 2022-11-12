import { InnerInstance, RxEntity, TargetClass } from '@src/interfaces';
import { Observable, Subject, Subscription } from 'rxjs';
import { RxEntityBase } from './rx-entity-base';

type SubjectKey = keyof Subject<unknown>;
type ObservableMethod = (...args: any[]) => Observable<unknown>;
type SubscriptionMethod = (...args: any[]) => Subscription;

const METHOD_KEYS_TO_OVERRIDE: SubjectKey[] = ['pipe', 'lift', 'asObservable'];

export class RxEntityObservable extends RxEntityBase {
    public check(variable: RxEntity): boolean {
        return variable instanceof Observable;
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

        observable.subscribe = subscriptionMethod;

        this.overrideMethods(observable, subscriptionMethod);
    }

    private getOverrideSubscriptionMethod(
        instance: InnerInstance,
        targetClass: TargetClass,
        observable: Observable<unknown>,
    ): SubscriptionMethod {
        const self = this;
        const originSubscribeMethod = observable.subscribe;

        return function (...args: unknown[]): Subscription {
            const subscription: Subscription = originSubscribeMethod.apply(this, args);

            if (!subscription?.closed) {
                self.defineSubscription(instance, targetClass, subscription);
            }

            return subscription;
        };
    }

    private overrideMethods(
        observable: Observable<unknown>,
        subscribeMethod: SubscriptionMethod,
    ): void {
        METHOD_KEYS_TO_OVERRIDE.forEach((methodName) =>
            this.processObservableMethod(observable, methodName, subscribeMethod),
        );
    }

    private processObservableMethod(
        observable: Observable<unknown>,
        methodName: SubjectKey,
        subscribeMethod: SubscriptionMethod,
    ): void {
        const originMethod = observable[methodName] as ObservableMethod;

        observable[methodName] = function (this: unknown, ...args: any[]): unknown {
            const result: Observable<unknown> = originMethod.apply(this, args);

            result.subscribe = subscribeMethod;

            return result;
        };
    }
}
