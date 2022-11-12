import { InnerInstance, RxEntity, TargetClass } from '@src/interfaces';
import { Subscription } from 'rxjs';
import { RxEntityBase } from './rx-entity-base';

export class RxEntitySubscription extends RxEntityBase {
    public check(variable: RxEntity): boolean {
        return variable instanceof Subscription;
    }

    public process(
        instance: InnerInstance,
        targetClass: TargetClass,
        variable: Subscription,
    ): void {
        this.defineSubscription(instance, targetClass, variable);
    }
}
