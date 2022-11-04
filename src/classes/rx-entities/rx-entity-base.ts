import type { Subscription } from 'rxjs';
import { InnerInstance, RxEntity, TargetClass } from '@src/interfaces';

export abstract class RxEntityBase {
    public abstract check(variable: RxEntity): boolean;

    public abstract process(
        instance: InnerInstance,
        targetClass: TargetClass,
        variable: RxEntity,
    ): void;

    protected defineSubscription(
        instance: InnerInstance,
        targetClass: TargetClass,
        subscription: Subscription,
    ): void {
        const targetSubscriptions = targetClass.ɵSubscriptions.get(instance) || [];

        targetSubscriptions.push(subscription);
        targetClass.ɵSubscriptions.set(instance, targetSubscriptions);
    }
}
