import type { Subscription } from 'rxjs';
import { RxClassMemberFactory } from './classes/rx-members';
import { Descriptor, TargetClass } from './interfaces';

export function AutoUnsubscribe(): any {
    return function InnerFunction(
        targetClass: TargetClass,
        key: string,
        descriptor: Descriptor,
    ): any {
        const classMember = RxClassMemberFactory.getInstance(descriptor);

        initializeAutoUnsubscription(targetClass);

        classMember.define(targetClass, key, descriptor);
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
