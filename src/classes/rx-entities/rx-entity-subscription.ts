import type { Subscription } from 'rxjs';
import { InnerInstance, RxEntity, TargetClass } from '@src/interfaces';
import { RxEntityBase } from './rx-entity-base';

export class RxEntitySubscription extends RxEntityBase {
    public check(variable: RxEntity): boolean {
        return !!(variable as Subscription).unsubscribe;
    }

    public process(
        instance: InnerInstance,
        targetClass: TargetClass,
        variable: Subscription,
    ): void {
        this.defineSubscription(instance, targetClass, variable);
    }
}
