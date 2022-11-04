import { Descriptor, InnerInstance, RxEntity, TargetClass } from '@src/interfaces';
import { RxEntityFactory } from '../rx-entities';
import { RxClassMemberBase } from './rx-class-member-base';

export class RxClassProperty extends RxClassMemberBase {
    public check(descriptor: Descriptor): boolean {
        return !descriptor;
    }

    public define(
        instance: InnerInstance,
        targetClass: TargetClass,
        key: string,
        descriptor: Descriptor,
    ): void {
        let value: RxEntity;

        descriptor = {
            get: function (): RxEntity {
                return value;
            },
            set: function (newValue: RxEntity): void {
                const entity = RxEntityFactory.getInstance(newValue);

                entity.process(instance, targetClass, newValue);

                value = newValue;
            },
            enumerable: true,
            configurable: true,
        };

        Object.defineProperty(targetClass, key, descriptor);
    }
}
